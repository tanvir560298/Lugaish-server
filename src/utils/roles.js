export const ROLES = {
  learner: 'learner',
  webDeveloper: 'web_developer',
  instructor: 'instructor',
  editor: 'editor',
};

export const ROLE_VALUES = Object.values(ROLES);

export const ROLE_LABELS = {
  [ROLES.learner]: 'Learner',
  [ROLES.webDeveloper]: 'Web Developer',
  [ROLES.instructor]: 'Instructor',
  [ROLES.editor]: 'Editor',
};

export const ROLE_PERMISSIONS = {
  [ROLES.learner]: [],
  [ROLES.webDeveloper]: [
    'manage_roles',
    'manage_users',
    'create_post',
    'edit_any_post',
    'publish_post',
    'manage_lessons',
    'manage_site',
    'manage_email',
  ],
  [ROLES.instructor]: [
    'create_post',
    'edit_own_post',
    'manage_lessons',
  ],
  [ROLES.editor]: [
    'create_post',
    'edit_any_post',
    'publish_post',
  ],
};

const legacyRoleMap = {
  admin: ROLES.webDeveloper,
  moderator: ROLES.editor,
  user: ROLES.learner,
};

export function normalizeRole(role) {
  if (ROLE_VALUES.includes(role)) return role;
  return legacyRoleMap[role] ?? ROLES.learner;
}

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[normalizeRole(role)] ?? [];
}

export function hasPermission(role, permission) {
  return getRolePermissions(role).includes(permission);
}
