// Tests for the triggers and token use of .github/workflows/ci.yml.
// Changes reach MudXtra/ha-cartographer through fork pull requests, so CI must run on them with a read-only token and no secrets.

import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { test } from 'node:test';

import YAML from 'yaml';

import { repoRoot } from './helpers/ci-harness.mjs';

const workflow = YAML.parse(fs.readFileSync(path.join(repoRoot, '.github', 'workflows', 'ci.yml'), 'utf8'));

test('ci.yml: pull requests into main run CI, so a fork pull request shows its checks', () => {
  assert.deepEqual(workflow.on.pull_request, { branches: ['main'] });
  assert.ok(workflow.on.push, 'pushes still run CI');
});

test('ci.yml: the workflow token is read-only, so a fork pull request needs no write access', () => {
  assert.deepEqual(workflow.permissions, { contents: 'read' });
});

test('ci.yml: publish-ci, the only job that writes or uses secrets, never runs for a pull request', () => {
  assert.match(workflow.jobs['publish-ci'].if, /github\.event_name != 'pull_request'/);
  const others = Object.entries(workflow.jobs).filter(([name]) => name !== 'publish-ci');
  for (const [name, job] of others) {
    assert.equal(job.permissions, undefined, `${name} keeps the read-only workflow token`);
    assert.doesNotMatch(JSON.stringify(job), /secrets\./, `${name} uses no secrets`);
  }
});
