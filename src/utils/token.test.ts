import { describe, it, expect } from 'vitest';

import { generateOTP, generateToken, hashToken } from './token';

describe('hashToken', () => {
  it('should return same hash for same token', () => {
    const token = 'abcdef';

    expect(hashToken(token)).toBe(hashToken(token));
  });

  it('should return different hashes for different tokens', () => {
    expect(hashToken('abc')).not.toBe(hashToken('xyz'));
  });
});

describe('generateOTP', () => {
  it('should return a 6-digit numeric string', () => {
    const otp = generateOTP();
    expect(otp).toMatch(/^\d{6}$/);
  });
});

describe('generateToken', () => {
  it('should return a 64 character hex string', () => {
    const token = generateToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });
});
