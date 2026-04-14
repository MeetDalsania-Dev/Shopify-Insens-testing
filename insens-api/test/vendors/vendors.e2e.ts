/**
 * Vendors E2E tests — TDD (written BEFORE implementation).
 *
 * Expected behaviour:
 *   POST   /vendors              → 201 PENDING (vendor_owner role required)
 *   GET    /vendors              → 200 paginated list
 *   GET    /vendors/:id          → 200 single vendor
 *   PATCH  /vendors/:id          → 200 (vendor owner only)
 *   PATCH  /admin/vendors/:id/approve  → 200 → status: active
 *   PATCH  /admin/vendors/:id/suspend  → 200 → status: suspended
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { createTestApp, registerAndLogin, bearer, type TestApp } from '../helpers/app.helper';

describe('Vendors — E2E', () => {
  let testApp:     TestApp;
  let ownerToken:  string;
  let adminToken:  string;
  let vendorId:    string;

  const vendorPayload = {
    legalName:   'Test Perfumes Pvt Ltd',
    displayName: 'Test Perfumes',
    slug:        `test-perfumes-${Date.now()}`,
    email:       'vendor@testperfumes.com',
    phone:       '+919876543210',
  };

  beforeAll(async () => {
    testApp = await createTestApp();

    // Register a vendor_owner user (after implementation, register auto-assigns customer;
    // a separate endpoint or admin panel assigns vendor_owner role)
    const owner = await registerAndLogin(testApp.inject, `vendor_owner_${Date.now()}@example.com`);
    ownerToken   = owner.accessToken;

    // Login as admin (seeded via seed.ts — password from ADMIN_PASSWORD env var or Tempo@123 default)
    const adminRes = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/auth/login',
      payload: {
        email:    process.env.ADMIN_EMAIL    ?? 'admin@insens.com',
        password: process.env.ADMIN_PASSWORD ?? 'Tempo@123',
      },
    });
    const adminBody = adminRes.json();
    adminToken = adminBody.data?.accessToken ?? '';
  });

  afterAll(async () => {
    await testApp.close();
  });

  // ── Create ─────────────────────────────────────────────────────────────────

  test('POST /vendors — 201 creates vendor with status pending', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/vendors',
      payload: vendorPayload,
      headers: { 'content-type': 'application/json', ...bearer(ownerToken) },
    });

    expect(res.statusCode).toBe(201);

    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('pending');
    expect(body.data.approvalStatus).toBe('pending_review');
    expect(body.data.displayName).toBe(vendorPayload.displayName);

    vendorId = body.data.id;
    expect(vendorId).toBeString();
  });

  test('POST /vendors — 401 without auth', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/vendors',
      payload: vendorPayload,
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(401);
  });

  // ── List ───────────────────────────────────────────────────────────────────

  test('GET /vendors — 200 returns paginated list (public)', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/vendors?page=1&limit=10',
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);

    const body = res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.items)).toBe(true);
    expect(typeof body.data.total).toBe('number');
  });

  // ── Get by ID ──────────────────────────────────────────────────────────────

  test('GET /vendors/:id — 200 returns vendor', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     `/api/v1/vendors/${vendorId}`,
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.id).toBe(vendorId);
  });

  test('GET /vendors/:id — 404 for non-existent id', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/vendors/00000000-0000-0000-0000-000000000000',
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(404);
  });

  // ── Update ─────────────────────────────────────────────────────────────────

  test('PATCH /vendors/:id — 200 owner can update their vendor', async () => {
    const res = await testApp.inject({
      method:  'PATCH',
      url:     `/api/v1/vendors/${vendorId}`,
      payload: { displayName: 'Updated Perfumes' },
      headers: { 'content-type': 'application/json', ...bearer(ownerToken) },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.displayName).toBe('Updated Perfumes');
  });

  // ── Admin approval ─────────────────────────────────────────────────────────

  test('PATCH /admin/vendors/:id/approve — 200 sets status to active', async () => {
    const res = await testApp.inject({
      method:  'PATCH',
      url:     `/api/v1/admin/vendors/${vendorId}/approve`,
      headers: bearer(adminToken),
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.approvalStatus).toBe('approved');
    expect(body.data.status).toBe('active');
  });

  test('PATCH /admin/vendors/:id/suspend — 200 sets status to suspended', async () => {
    const res = await testApp.inject({
      method:  'PATCH',
      url:     `/api/v1/admin/vendors/${vendorId}/suspend`,
      headers: bearer(adminToken),
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.status).toBe('suspended');
  });
});
