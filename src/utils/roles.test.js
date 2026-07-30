import assert from 'node:assert/strict';
import test from 'node:test';
import { ROLES, hasPermission } from './roles.js';

test('all course staff roles retain lesson-management permission', () => {
  for (const role of [ROLES.webDeveloper, ROLES.tester, ROLES.instructor, ROLES.editor]) {
    assert.equal(hasPermission(role, 'manage_lessons'), true);
  }
});

test('learners cannot manage lessons', () => {
  assert.equal(hasPermission(ROLES.learner, 'manage_lessons'), false);
});
