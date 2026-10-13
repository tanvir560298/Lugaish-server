const DEFAULT_JWT_SECRET = "your_jwt_secret_key_change_in_production";

export function validateProductionConfig(
  config,
  nodeEnv = process.env.NODE_ENV,
) {
  if (nodeEnv !== "production") return;

  const errors = [];
  if (!["staging", "production"].includes(config.APP_ENV)) {
    errors.push("APP_ENV must explicitly be staging or production");
  }
  if (
    !config.JWT_SECRET ||
    config.JWT_SECRET === DEFAULT_JWT_SECRET ||
    config.JWT_SECRET.length < 32
  ) {
    errors.push("JWT_SECRET must be a unique secret of at least 32 characters");
  }
  const database =
    /^(?:mongodb|mongodb\+srv):\/\/[^/]+\/([^/?#]+)(?:\?[^#]*)?$/.exec(
      config.MONGODB_URI || "",
    )?.[1];
  if (!database)
    errors.push("MONGODB_URI must contain an explicit database name");
  if (
    !Array.isArray(config.CORS_ORIGINS) ||
    !config.CORS_ORIGINS.some((origin) => origin.startsWith("https://"))
  ) {
    errors.push("At least one HTTPS CORS origin must be configured");
  }

  if (!config.FIREBASE_PROJECT_ID || /^your-/.test(config.FIREBASE_PROJECT_ID))
    errors.push(
      "FIREBASE_PROJECT_ID must identify the real Google sign-in project",
    );
  if (
    config.CORS_ORIGINS?.some((origin) => {
      try {
        const url = new URL(origin);
        return (
          url.protocol !== "https:" ||
          url.origin !== origin ||
          !!url.username ||
          !!url.password
        );
      } catch {
        return true;
      }
    })
  )
    errors.push(
      "Production CORS entries must be exact HTTPS origins without paths or credentials",
    );
  try {
    const frontend = new URL(config.FRONTEND_URL);
    if (
      frontend.protocol !== "https:" ||
      frontend.origin !== config.FRONTEND_URL ||
      frontend.username ||
      frontend.password ||
      /^(localhost|.*\.localhost|127\..*|0\.0\.0\.0|\[::1\])$/i.test(
        frontend.hostname.replace(/\.$/, ""),
      )
    )
      throw Error();
    if (!config.CORS_ORIGINS?.includes(frontend.origin))
      errors.push("FRONTEND_URL must be included in CORS origins");
  } catch {
    errors.push("FRONTEND_URL must be an exact public HTTPS origin");
  }
  if (config.APP_ENV === "staging") {
    if (!/(?:^|[_-])staging(?:$|[_-])/i.test(database || ""))
      errors.push("Staging requires an explicitly staging-named database");
  } else if (/(?:^|[_-])staging(?:$|[_-])/i.test(database || "")) {
    errors.push("Production must not use a staging database");
  }
  if (errors.length)
    throw new Error(`Invalid production configuration: ${errors.join("; ")}`);
}
