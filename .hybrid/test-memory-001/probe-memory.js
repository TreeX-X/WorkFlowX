#!/usr/bin/env node
/**
 * TEST-MEMORY-001 manual MCP server-memory probe.
 * Runs the @modelcontextprotocol/server-memory server via JSON-RPC over stdio
 * because the coderX subagent does not expose mcp__server-memory__* tool wrappers.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const memoryFile = path.join(__dirname, 'server-memory-graph.json');
const outLog = path.join(__dirname, 'probe-memory-output.json');

const server = spawn('npx', ['-y', '@modelcontextprotocol/server-memory'], {
  cwd: __dirname,
  env: { ...process.env, MEMORY_FILE_PATH: memoryFile },
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
});

let requestId = 0;
const pending = new Map();
const output = [];

function log(kind, data) {
  const entry = { t: new Date().toISOString(), kind, data };
  output.push(entry);
  console.error(`[${entry.t}] ${kind}:`, JSON.stringify(data, null, 2));
}

function send(method, params) {
  const id = ++requestId;
  const msg = { jsonrpc: '2.0', id, method, params };
  const line = JSON.stringify(msg) + '\n';
  log('SEND', msg);
  server.stdin.write(line);
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function callTool(name, args) {
  const id = ++requestId;
  const msg = {
    jsonrpc: '2.0',
    id,
    method: 'tools/call',
    params: { name, arguments: args },
  };
  const line = JSON.stringify(msg) + '\n';
  log('SEND', msg);
  server.stdin.write(line);
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

server.stderr.on('data', (chunk) => {
  log('SERVER-STDERR', chunk.toString().trim());
});

let buffer = '';
server.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop();
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      log('RECV', msg);
      if (msg.id && pending.has(msg.id)) {
        const { resolve } = pending.get(msg.id);
        pending.delete(msg.id);
        resolve(msg);
      }
    } catch (e) {
      log('PARSE-ERR', { line, error: e.message });
    }
  }
});

async function run() {
  try {
    log('INFO', { memoryFile, memoryFileExists: fs.existsSync(memoryFile) });

    // Initialize
    const init = await send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'TEST-MEMORY-001-probe', version: '1.0' },
    });
    if (init.error) throw new Error(JSON.stringify(init.error));

    send('notifications/initialized', {}).catch(() => {});

    // A. Server availability / read_graph
    const readBefore = await callTool('read_graph', {});
    log('RESULT-A', readBefore.result || readBefore.error);

    // B. Write round-trip: create entities and relations
    const createEntities = await callTool('create_entities', {
      entities: [
        {
          name: 'WorkflowX_Architecture',
          entityType: 'project',
          observations: [
            'WorkFlowX orchestrator uses Hybrid Trees (Parent + Child).',
            'Routes via .hybrid/status.json.',
            'Supports /xwhole, /xlocal, /xunit.',
          ],
        },
        {
          name: 'TestMemory001_Feature',
          entityType: 'feature',
          observations: [
            'Diagnostic feature verifying mcp/server-memory integration.',
            'Tests availability, round-trip write, search, open, conflict handling.',
          ],
        },
        {
          name: 'TestMemory001_Lesson',
          entityType: 'lesson',
          observations: [
            'Captures findings from TEST-MEMORY-001.',
            'Primary rule: when code truth conflicts with memory, code truth wins.',
          ],
        },
      ],
    });
    log('RESULT-B-entities', createEntities.result || createEntities.error);

    const createRelations = await callTool('create_relations', {
      relations: [
        { from: 'WorkflowX_Architecture', to: 'TestMemory001_Feature', relationType: 'uses_memory_for' },
        { from: 'TestMemory001_Feature', to: 'TestMemory001_Lesson', relationType: 'validates' },
      ],
    });
    log('RESULT-B-relations', createRelations.result || createRelations.error);

    const readAfter = await callTool('read_graph', {});
    log('RESULT-B-readback', readAfter.result || readAfter.error);

    // C. Memory read usage link
    const search = await callTool('search_nodes', { query: 'WorkflowX_Architecture OR TestMemory001_Feature' });
    log('RESULT-C-search', search.result || search.error);

    const open = await callTool('open_nodes', { names: ['WorkflowX_Architecture', 'TestMemory001_Feature', 'TestMemory001_Lesson'] });
    log('RESULT-C-open', open.result || open.error);

    // E. Memory conflict handling: inject a false observation, then correct it
    const falseObs = 'Current .hybrid/status.json status is xwhole (this is intentionally wrong for testing).';
    const addFalse = await callTool('add_observations', {
      observations: [
        { entityName: 'WorkflowX_Architecture', contents: [falseObs] },
      ],
    });
    log('RESULT-E-false', addFalse.result || addFalse.error);

    const openAfterFalse = await callTool('open_nodes', { names: ['WorkflowX_Architecture'] });
    log('RESULT-E-open-false', openAfterFalse.result || openAfterFalse.error);

    // Correct by removing the false observation and adding the corrected one
    const correctedObs = 'Current .hybrid/status.json status is wait (code truth verified at runtime).';
    const removeFalse = await callTool('delete_observations', {
      deletions: [
        { entityName: 'WorkflowX_Architecture', observations: [falseObs] },
      ],
    });
    log('RESULT-E-remove', removeFalse.result || removeFalse.error);

    const addCorrect = await callTool('add_observations', {
      observations: [
        { entityName: 'WorkflowX_Architecture', contents: [correctedObs] },
      ],
    });
    log('RESULT-E-correct', addCorrect.result || addCorrect.error);

    const finalRead = await callTool('read_graph', {});
    log('RESULT-FINAL', finalRead.result || finalRead.error);

    server.stdin.end();
    await new Promise((r) => server.on('close', r));

    fs.writeFileSync(outLog, JSON.stringify(output, null, 2));
    log('INFO', { wroteLog: outLog });
  } catch (err) {
    log('FATAL', { error: err.message, stack: err.stack });
    fs.writeFileSync(outLog, JSON.stringify(output, null, 2));
    server.kill();
    process.exit(1);
  }
}

run();
