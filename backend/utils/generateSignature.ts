// generateSignature.ts
import crypto from 'crypto';

export const generateBitgetSignature = (payload: object, secret: string): string => {
  const json = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(json).digest('hex');
};