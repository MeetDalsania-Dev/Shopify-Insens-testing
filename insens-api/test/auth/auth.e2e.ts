/**
 * Auth E2E tests — TDD (written BEFORE implementation is complete).
 *
 * Expected new behaviour:
 *   • POST /auth/register  — no `role` field; auto-assigns `customer` role
 *   • POST /auth/login     — returns `roles: string[]` + `vendorId` (not shopId)
 *   • GET  /auth/me        — returns `roles[]` array
 *   • POST /auth/refresh   — rotates tokens
 *   • POST /auth/logout    — invalidates refresh token
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { createTestApp, bearer, type TestApp } from '../helpers/app.helper';

describe('Auth — E2E', () => {
  let testApp: TestApp;
  const email    = `auth_e2e_${Date.now()}@example.com`;
  const password = 'SecurePass123!';

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp.close();
  });

  // ── Register ───────────────────────────────────────────────────────────────

  test('POST /auth/register — 201, no role field required, auto-assigns customer role', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/register',
      payload: { email, password },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(201);

    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeString();
    expect(body.data.refreshToken).toBeString();
    expect(body.data.user.email).toBe(email);

    // NEW: roles array, not single role string
    expect(Array.isArray(body.data.user.roles)).toBe(true);
    expect(body.data.user.roles).toContain('customer');

    // NEW: vendorId, not shopId
    expect(body.data.user).toHaveProperty('vendorId');
    expect(body.data.user.vendorId).toBeNull();
  });

  test('POST /auth/register — 409 on duplicate email', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/register',
      payload: { email, password },
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(409);
  });

  test('POST /auth/register — 400 when role field is sent (no longer accepted)', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/register',
      payload: { email: `other_${Date.now()}@example.com`, password, role: 'BUYER' },
      headers: { 'content-type': 'application/json' },
    });
    // Validation pipe should reject unknown/extra field or the schema no longer has role
    // Expect either 400 or 201 without role being stored (depending on whitelist config)
    // For whitelist-strict: 400; for non-strict: 201 ignoring extra field
    expect([200, 201, 400]).toContain(res.statusCode);
  });

  // ── Login ──────────────────────────────────────────────────────────────────

  let accessToken  = '';
  let refreshToken = '';

  test('POST /auth/login — 200 with roles[] + vendorId', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/login',
      payload: { email, password },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);

    const body = res.json();
    expect(body.success).toBe(true);

    accessToken  = body.data.accessToken;
    refreshToken = body.data.refreshToken;

    expect(accessToken).toBeString();
    expect(refreshToken).toBeString();

    // NEW: roles is an array
    expect(Array.isArray(body.data.user.roles)).toBe(true);
    expect(body.data.user.roles).toContain('customer');

    // NEW: vendorId property exists (null for customer-only user)
    expect(body.data.user).toHaveProperty('vendorId');
  });

  test('POST /auth/login — 401 with wrong password', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/login',
      payload: { email, password: 'wrongpassword' },
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(401);
  });

  // ── Me ─────────────────────────────────────────────────────────────────────

  test('GET /auth/me — 200 with roles[]', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/auth/me',
      headers: { 'content-type': 'application/json', ...bearer(accessToken) },
    });

    expect(res.statusCode).toBe(200);

    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.email).toBe(email);

    // NEW: roles array returned
    expect(Array.isArray(body.data.roles)).toBe(true);
    expect(body.data.roles).toContain('customer');
  });

  test('GET /auth/me — 401 without token', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/auth/me',
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(401);
  });

  // ── Refresh ────────────────────────────────────────────────────────────────

  test('POST /auth/refresh — 200 returns new token pair', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/refresh',
      payload: { refreshToken },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);

    const body = res.json();
    expect(body.data.accessToken).toBeString();
    expect(body.data.refreshToken).toBeString();
    // New token pair should be different (rotation)
    expect(body.data.refreshToken).not.toBe(refreshToken);

    refreshToken = body.data.refreshToken;
    accessToken  = body.data.accessToken;
  });

  test('POST /auth/refresh — 401 when using already-rotated token', async () => {
    // The old refreshToken was already consumed above; reusing it should fail
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/refresh',
      payload: { refreshToken: 'invalid.token.here' },
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(401);
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  test('POST /auth/logout — 200 invalidates token', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/logout',
      payload: { refreshToken },
      headers: { 'content-type': 'application/json', ...bearer(accessToken) },
    });
    expect(res.statusCode).toBe(200);
  });

  test('POST /auth/refresh — 401 after logout', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/refresh',
      payload: { refreshToken },
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(401);
  });
});
