import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import argon from 'argon2';

import { and, eq } from 'drizzle-orm';
import app from '../../app.js';
import { db } from '../../db/index.js';
import {
  accountsTable,
  rolesTable,
  usersTable,
  verificationsTable,
} from '../../db/schema.js';
import { sendVerificationEmail } from '../../features/auth/auth.email.js';
import { AppError } from '../../utils/app-error.js';

vi.mock('../../features/auth/auth.email.js', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
  sendWelcomeEmail: vi.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
  sendPasswordResetEmail: vi
    .fn()
    .mockResolvedValue({ data: { id: 'mock-id' } }),
  sendPasswordChangedEmail: vi
    .fn()
    .mockResolvedValue({ data: { id: 'mock-id' } }),
  sendGoogleAccountLinkedEmail: vi
    .fn()
    .mockResolvedValue({ data: { id: 'mock-id' } }),
}));

describe('GET /', () => {
  it('should return API is running', async () => {
    const res = await request(app).get('/');

    expect(res.text).toBe('API is running...');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/auth/signup', () => {
  beforeEach(async () => {
    await db.delete(usersTable);
  });

  it('should create a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Johndoe@1',
    });
    // HTTP response
    expect(res.status).toBe(201);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.email).toBe('johndoe@gmail.com');
    expect(res.body.user.name).toBe('John Doe');

    // Email
    expect(sendVerificationEmail).toHaveBeenCalledOnce();

    // Account
    const account = await db.query.accountsTable.findFirst({
      where: and(
        eq(accountsTable.userId, res.body.user.id),
        eq(accountsTable.providerId, 'credential'),
      ),
    });

    expect(account).not.toBeUndefined();

    expect(await argon.verify(account?.password!, 'Johndoe@1')).toBe(true);

    // Verification
    const verification = await db.query.verificationsTable.findFirst({
      where: and(eq(verificationsTable.userId, res.body.user.id)),
    });

    expect(verification).not.toBeUndefined();

    // Role
    const userRole = await db.query.rolesTable.findFirst({
      where: eq(rolesTable.name, 'user'),
    });

    expect(userRole).toBeDefined();
    expect(res.body.user.roleId).toBe(userRole!.id);
  });

  it('should return 409 when email already exists', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Johndoe@1',
    };

    const res1 = await request(app).post('/api/auth/signup').send(userData);

    const res2 = await request(app).post('/api/auth/signup').send(userData);

    expect(res1.body.user).toBeDefined();
    expect(res1.status).toBe(201);

    expect(res2.body.user).toBeUndefined();
    expect(res2.status).toBe(409);

    const users = await db.query.usersTable.findMany({
      where: eq(usersTable.email, userData.email),
    });

    expect(users).toHaveLength(1);
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/auth/signup').send({});

    expect(res.status).toBe(400);
  });
  it('should return 500 for failed email send', async () => {
    vi.mocked(sendVerificationEmail).mockRejectedValueOnce(
      new AppError('Failed to send verification email', 500),
    );

    const res = await request(app).post('/api/auth/signup').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Johndoe@1',
    });

    expect(res.status).toBe(500);
  });
});
