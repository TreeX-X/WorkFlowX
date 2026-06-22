/**
 * WorkflowX plugin for OpenCode.ai
 *
 * Registers skills directory and injects orchestratorX bootstrap context.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.resolve(__dirname, '..', 'skills');
const AGENTS_DIR = path.resolve(__dirname, '..', 'agents');
const COMMANDS_DIR = path.resolve(__dirname, '..', 'commands');
const MCP_CONFIG_PATH = path.resolve(__dirname, '..', 'mcp.json');

export default {
  name: 'workflowx',
  version: '1.0.0',

  /**
   * Called when OpenCode loads the plugin.
   * Registers skills and agents directories.
   */
  onLoad(ctx) {
    // Register skills directory
    if (fs.existsSync(SKILLS_DIR)) {
      ctx.registerSkillsDir(SKILLS_DIR);
    }

    // Register agents directory
    if (fs.existsSync(AGENTS_DIR)) {
      ctx.registerAgentsDir(AGENTS_DIR);
    }

    // Register commands directory
    if (fs.existsSync(COMMANDS_DIR)) {
      ctx.registerCommandsDir(COMMANDS_DIR);
    }

    // Register MCP servers from .opencode/mcp.json when runtime exposes a registrar
    if (fs.existsSync(MCP_CONFIG_PATH) && typeof ctx.registerMcpServers === 'function') {
      try {
        const mcpConfig = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));
        if (mcpConfig.mcpServers) {
          ctx.registerMcpServers(mcpConfig.mcpServers);
        }
      } catch (err) {
        // Non-fatal: OpenCode may load mcp.json itself or not support runtime registration.
      }
    }
  },

  /**
   * System prompt transform.
   * Injects WorkflowX bootstrap context at session start.
   */
  onSystemPrompt(prompt) {
    const bootstrap = [
      '# WorkflowX Multi-Agent Orchestration',
      '',
      'You are running with WorkflowX, a multi-agent orchestration framework.',
      'Available commands: /xwhole, /xlocal, /xunit, /xprompt, /xstatus',
      '',
      '## Quick Reference',
      '- `/xwhole [requirement]` — Full workflow: Planning → coderX → evaluatorX loop',
      '- `/xlocal [requirement]` — Local workflow: PRD detection → coderX → evaluatorX loop',
      '- `/xunit [requirement]` — Minimal: promptMasterX → coderX, no evaluation',
      '- `/xprompt [prompt]` — Prompt optimization only',
      '- `/xstatus` — Generate HTML status report',
      '',
      '## Core Agents',
      '- orchestratorX: Workflow coordinator (sole document writer)',
      '- coderX: Code implementation (Karpathy guidelines)',
      '- evaluatorX: Code audit (AC cross-validation)',
      '- promptMasterX: Prompt optimization (37 anti-patterns)',
      '- abstracterX: Code analysis',
      '',
      '## Key Features',
      '- Socratic Requirements Discovery (module 08)',
      '- Hybrid Tree PRD management (Parent + Children)',
      '- AC cross-validation (evaluatorX does not trust coderX declarations)',
      '- Token-optimized iteration (incremental context, section caching)',
    ].join('\n');

    return prompt + '\n\n' + bootstrap;
  }
};
