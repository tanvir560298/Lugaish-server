// Mutating JSON endpoints accept an object, never a null/array payload. Field
// validation remains with the individual endpoint rather than coercing values.
export function objectBody(req, res, next) {
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
  ) {
    return res
      .status(400)
      .json({ error: "Provide a JSON object for this request." });
  }
  next();
}
