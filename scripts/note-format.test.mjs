// Note: compact metadata keeps the complete Task contract — see .agents/notes/harness/maintained-documents.md
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formatNoteMetadata } from './lib/note-format.mjs';
import { parseNote, taskContractHash, validateNote } from './lib/note-v2.mjs';

test('compact metadata preserves exact values and Task contract', () => {
  const source = readFileSync('standards/harness-note/2/fixtures/valid-task.md', 'utf8');
  const note = parseNote(source);
  note.meta.work.verification[0].args = ['- [x] literal', '引号 " 和换行\n', '', '  '];
  const formatted = formatNoteMetadata(note.meta);
  assert.deepEqual(JSON.parse(formatted), note.meta);
  assert.equal(formatNoteMetadata(JSON.parse(formatted)), formatted);
  const next = parseNote('---\n' + formatted + '\n---\n' + note.body);
  assert.equal(taskContractHash(next), taskContractHash(note));
  assert.equal(validateNote('---\n' + formatted + '\n---\n' + note.body).errors.length, 0);
  assert.ok(formatted.length < JSON.stringify(note.meta, null, 2).length);
});

test('long scalar values and unknown metadata survive without truncation', () => {
  const meta = { schema: 'harness-note/2', extension: { long: '长'.repeat(300), list: [null, true, 0, { nested: ['a', 'b'] }] } };
  assert.deepEqual(JSON.parse(formatNoteMetadata(meta)), meta);
});
