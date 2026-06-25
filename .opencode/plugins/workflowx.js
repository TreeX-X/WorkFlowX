/**
 * WorkflowX plugin for OpenCode.
 *
 * OpenCode 1.17 plugins export an async server plugin function that returns
 * hook handlers. Project assets are declared in opencode.json and .opencode/*;
 * this plugin only injects WorkflowX runtime guidance into the system prompt.
 */

const WORKFLOWX_BOOTSTRAP = [
  '# WorkflowX Main-Agent Workflow',
  '',
  'You are running with WorkflowX, a file-driven multi-agent workflow framework.',
  'In OpenCode, the current main agent orchestrates directly. Do not route orchestration through a separate workflow agent.',
  'Available commands: /xwhole, /xlocal, /xunit, /xprompt, /xstatus',
  '',
  '## Quick Reference',
  '- `/xwhole [requirement]` - Full workflow: discovery/planning -> coderX -> evaluatorX loop',
  '- `/xlocal [requirement]` - Local workflow: PRD detection/minimal Hybrid Tree -> coderX -> evaluatorX loop',
  '- `/xunit [requirement]` - Minimal: promptX -> coderX, no evaluation by default',
  '- `/xprompt [prompt]` - Prompt optimization only',
  '- `/xstatus` - Generate HTML status report',
  '',
  '## Core Agents',
  '- Main Agent: workflow coordinator and sole Hybrid Tree document writer',
  '- coderX: Code implementation',
  '- evaluatorX: Code audit',
  '- promptMasterX: Prompt optimization',
  '- abstracterX: Code analysis',
  '',
  '## Key Features',
  '- Socratic Requirements Discovery (module 08)',
  '- Hybrid Tree PRD management (Parent + Children)',
  '- AC cross-validation (evaluatorX does not trust coderX declarations)',
  '- Token-optimized iteration (incremental context, section caching)',
].join('\n');

module.exports = async function WorkflowXPlugin() {
  return {
    'experimental.chat.system.transform': async (_input, output) => {
      output.system.push(WORKFLOWX_BOOTSTRAP);
    },
  };
};
