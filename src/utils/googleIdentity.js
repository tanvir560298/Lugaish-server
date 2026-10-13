export function requireGoogleIdentity(payload) {
  if (
    typeof payload?.uid !== "string" ||
    !payload.uid ||
    typeof payload.email !== "string" ||
    !payload.email ||
    payload.email.length > 320 ||
    payload.email_verified !== true ||
    payload.firebase?.sign_in_provider !== "google.com"
  )
    throw new Error("Sign in using a verified Google account.");
  return payload;
}
