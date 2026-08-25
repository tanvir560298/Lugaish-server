const DEFAULT_JWT_SECRET = 'your_jwt_secret_key_change_in_production';

export function validateProductionConfig(config, nodeEnv = process.env.NODE_ENV) {
  if (nodeEnv !== 'production') return;

  const errors = [];
  if (!config.JWT_SECRET || config.JWT_SECRET === DEFAULT_JWT_SECRET || config.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be a unique secret of at least 32 characters');
  }
  if (!/^mongodb(\+srv)?:\/\//.test(config.MONGODB_URI || '')) {
    errors.push('MONGODB_URI must be configured');
  }
  if (!Array.isArray(config.CORS_ORIGINS) || !config.CORS_ORIGINS.some(origin => origin.startsWith('https://'))) {
    errors.push('At least one HTTPS CORS origin must be configured');
  }

  if (errors.length) throw new Error(`Invalid production configuration: ${errors.join('; ')}`);
}
