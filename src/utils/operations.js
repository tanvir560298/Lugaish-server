import { isIP } from "node:net";

export function readiness(connected, draining = false) {
  return {
    status: connected && !draining ? 200 : 503,
    body: { ready: connected && !draining },
  };
}
export function trustedProxy(value) {
  if (!value?.trim()) return false;
  if (/^(true|false|\d+)$/i.test(value))
    throw Error(
      "TRUST_PROXY must use actual trusted proxy addresses/CIDRs, not boolean or hop count",
    );
  const entries = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const entry of entries) {
    if (["loopback", "linklocal", "uniquelocal"].includes(entry)) continue;
    const [address, prefix, extra] = entry.split("/");
    const version = isIP(address);
    if (
      !version ||
      extra !== undefined ||
      (prefix !== undefined &&
        (!/^\d+$/.test(prefix) ||
          Number(prefix) < 1 ||
          Number(prefix) > (version === 4 ? 32 : 128)))
    )
      throw Error(
        "TRUST_PROXY must contain explicit valid IP addresses/CIDRs or local subnet names; catch-all networks are forbidden",
      );
  }
  return entries;
}
export const operationalEvents = new Set([
  "frontend_exception",
  "frontend_rejection",
  "api_failure",
  "auth_failure",
  "classroom_media_failure",
  "classroom_render_failure",
  "library_render_failure",
]);
export function operationalEvent(body) {
  return body &&
    typeof body.event === "string" &&
    operationalEvents.has(body.event)
    ? body.event
    : null;
}
