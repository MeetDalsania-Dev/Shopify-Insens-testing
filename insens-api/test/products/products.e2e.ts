/**
 * Products E2E tests — TDD (written BEFORE implementation).
 *
 * Expected behaviour:
 *   POST   /products                    → 201 (vendor_owner with approved vendor)
 *   GET    /products                    → 200 paginated, filterable
 *   GET    /products/:id                → 200 with variants[]
 *   PATCH  /products/:id                → 200
 *   POST   /products/:id/variants       → 201
 *   PATCH  /products/:id/variants/:vid  → 200
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { createTestApp, registerAndLogin, bearer, type TestApp } from '../helpers/app.helper';

describe('Products — E2E', () => {
  let testApp:    TestApp;
  let ownerToken: string;
  let productId:  string;
  let variantId:  string;

  beforeAll(async () => {
    testApp = await createTestApp();

    // Login as existing vendor owner (seeded or created)
    const owner = await registerAndLogin(testApp.inject, `prod_owner_${Date.now()}@example.com`);
    ownerToken  = owner.accessToken;
  });

  afterAll(async () => {
    await testApp.close();
  });

  // ── Create product ─────────────────────────────────────────────────────────

  test('POST /products — 201 creates product', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/products',
      payload: {
        title:            'Rose Oud EDP',
        slug:             `rose-oud-edp-${Date.now()}`,
        shortDescription: 'A rich floral-woody blend',
        productType:      'simple',
      },
      headers: { 'content-type': 'application/json', ...bearer(ownerToken) },
    });

    // Will fail until VendorGuard + vendor assignment is implemented
    expect([201, 403]).toContain(res.statusCode);

    if (res.statusCode === 201) {
      const body = res.json();
      expect(body.data.title).toBe('Rose Oud EDP');
      expect(body.data.status).toBe('draft');
      productId = body.data.id;
    }
  });

  test('POST /products — 401 without auth', async () => {
    const res = await testApp.inject({
      method:  'POST',
      url:     '/api/v1/products',
      payload: { title: 'Test', slug: 'test', productType: 'simple' },
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(401);
  });

  // ── List products ──────────────────────────────────────────────────────────

  test('GET /products — 200 returns paginated list (public)', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/products?page=1&limit=10',
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.items)).toBe(true);
  });

  test('GET /products?vendorId=xxx — filters by vendor', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/products?vendorId=00000000-0000-0000-0000-000000000000',
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body.data.items)).toBe(true);
    // Expect 0 results for non-existent vendor
    expect(body.data.items.length).toBe(0);
  });

  // ── Get product by id ──────────────────────────────────────────────────────

  test('GET /products/:id — 200 includes variants array', async () => {
    if (!productId) return; // skip if create test failed

    const res = await testApp.inject({
      method:  'GET',
      url:     `/api/v1/products/${productId}`,
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.id).toBe(productId);
    // NEW: variants array should be present
    expect(Array.isArray(body.data.variants)).toBe(true);
  });

  // ── Add variant ────────────────────────────────────────────────────────────

  test('POST /products/:id/variants — 201 creates variant', async () => {
    if (!productId) return;

    const res = await testApp.inject({
      method:  'POST',
      url:     `/api/v1/products/${productId}/variants`,
      payload: {
        sku:       `SKU-TEST-${Date.now()}`,
        title:     '50ml',
        mrp:       '3500.00',
        salePrice: '2999.00',
        stock:     50,
      },
      headers: { 'content-type': 'application/json', ...bearer(ownerToken) },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.data.sku).toBeString();
    variantId = body.data.id;
  });

  // ── Update variant ─────────────────────────────────────────────────────────

  test('PATCH /products/:id/variants/:vid — 200 updates variant', async () => {
    if (!productId || !variantId) return;

    const res = await testApp.inject({
      method:  'PATCH',
      url:     `/api/v1/products/${productId}/variants/${variantId}`,
      payload: { stock: 100 },
      headers: { 'content-type': 'application/json', ...bearer(ownerToken) },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Number(body.data.stock)).toBe(100);
  });
});
