import { normalizeRole, ROLES } from "../utils/roles.js";
// Tester lesson authoring has an explicit isolated collection. Other privileged
// APIs operate on live users/groups/configuration and have no sandbox boundary.
export function permitsLivePermission(role, permission) {
  return (
    normalizeRole(role) !== ROLES.tester || permission === "manage_lessons"
  );
}
