import assert from 'node:assert/strict';
import test from 'node:test';
import { ROLES, hasPermission } from './roles.js';

test('all course staff roles retain lesson-management permission', () => {
  for (const role of [ROLES.webDeveloper, ROLES.tester, ROLES.instructor, ROLES.editor, ROLES.intern]) {
    assert.equal(hasPermission(role, 'manage_lessons'), true);
  }
});

test('interns can publish and manage content without destructive account authority', () => {
  assert.equal(hasPermission(ROLES.intern, 'manage_lessons'), true);
  assert.equal(hasPermission(ROLES.intern, 'manage_site'), true);
  assert.equal(hasPermission(ROLES.intern, 'publish_post'), true);
  assert.equal(hasPermission(ROLES.intern, 'manage_users'), false);
  assert.equal(hasPermission(ROLES.intern, 'manage_roles'), false);
  assert.equal(hasPermission(ROLES.intern, 'manage_email'), false);
});

test('learners cannot manage lessons', () => {
  assert.equal(hasPermission(ROLES.learner, 'manage_lessons'), false);
});
