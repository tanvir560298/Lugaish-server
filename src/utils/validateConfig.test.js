import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProductionConfig } from './validateConfig.js';

const validConfig = {
  JWT_SECRET: 'a-secure-production-secret-that-is-long-enough',
  MONGODB_URI: 'mongodb+srv://example.invalid/lugaish',
  CORS_ORIGINS: ['https://lugaish.example'],
};

test('allows local development defaults outside production', () => {
  assert.doesNotThrow(() => validateProductionConfig({}, 'development'));
});

test('rejects insecure production configuration', () => {
  assert.throws(() => validateProductionConfig({ JWT_SECRET: 'short', MONGODB_URI: '', CORS_ORIGINS: [] }, 'production'));
});

test('accepts secure production configuration', () => {
  assert.doesNotThrow(() => validateProductionConfig(validConfig, 'production'));
});
