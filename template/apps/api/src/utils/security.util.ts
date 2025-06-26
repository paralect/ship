import { hash, verify } from '@node-rs/argon2';
import crypto from 'crypto';

// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
const ALPHABET = 'abcdefghijklmnpqrstuvwxyz23456789';

const RANDOM = {
  read(bytes: Uint8Array) {
    crypto.getRandomValues(bytes);
  },
};

export const generateSecureToken = async (tokenLength = 24) => {
  const { generateRandomString } = await import('@oslojs/crypto/random');

  return generateRandomString(RANDOM, ALPHABET, tokenLength);
};

export const hashPassword = async (password: string): Promise<string> =>
  hash(password, {
    memoryCost: 19456, // 19 MB
    timeCost: 2, // 2 iterations
    outputLen: 32, // 32 bytes
    parallelism: 1, // 1 thread
  });

export const verifyPasswordHash = async (hashedPassword: string, password: string): Promise<boolean> =>
  verify(hashedPassword, password);

export const hashToken = async (token: string): Promise<string> => {
  const { sha256 } = await import('@oslojs/crypto/sha2');
  const { encodeHexLowerCase } = await import('@oslojs/encoding');

  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

export const verifyTokenHash = async (hashedToken: string | undefined, token: string): Promise<boolean> => {
  const { constantTimeEqual } = await import('@oslojs/crypto/subtle');

  const computedHash = await hashToken(token);

  return constantTimeEqual(new TextEncoder().encode(computedHash), new TextEncoder().encode(hashedToken));
};
