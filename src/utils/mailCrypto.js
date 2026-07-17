import crypto from 'crypto';
import config from '../config.js';

function getKey() {
  if (!config.GMAIL_TOKEN_ENCRYPTION_KEY || config.GMAIL_TOKEN_ENCRYPTION_KEY.length < 32) {
    throw new Error('GMAIL_TOKEN_ENCRYPTION_KEY must be at least 32 characters');
  }
  return crypto.createHash('sha256').update(config.GMAIL_TOKEN_ENCRYPTION_KEY).digest();
}

export function encryptSecret(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map(part => part.toString('base64url')).join('.');
}

export function decryptSecret(value) {
  const [iv, tag, encrypted] = value.split('.').map(part => Buffer.from(part, 'base64url'));
  if (!iv || !tag || !encrypted) throw new Error('Stored mail credential is invalid');
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
