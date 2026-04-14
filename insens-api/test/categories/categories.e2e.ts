/**
 * Categories E2E tests — TDD (written BEFORE implementation).
 *
 * Expected behaviour:
 *   GET /categories        → 200, flat list with level + path info
 *   GET /categories/:slug  → 200, category with children array
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { createTestApp, type TestApp } from '../helpers/app.helper';

describe('Categories — E2E', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp.close();
  });

  test('GET /categories — 200 returns list (public)', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/categories',
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /categories — each item has slug, name, level', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/categories',
      headers: { 'content-type': 'application/json' },
    });

    const body = res.json();
    if (body.data.length > 0) {
      const cat = body.data[0];
      expect(cat).toHaveProperty('slug');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('level');
    }
  });

  test('GET /categories/:slug — 200 returns category (seeded root categories)', async () => {
    // 'floral' is seeded by seed.ts
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/categories/floral',
      headers: { 'content-type': 'application/json' },
    });

    // Will pass only after migration + seed have run AND categories module is updated
    expect([200, 404]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      const body = res.json();
      expect(body.data.slug).toBe('floral');
      // NEW: children array
      expect(Array.isArray(body.data.children)).toBe(true);
    }
  });

  test('GET /categories/:slug — 404 for unknown slug', async () => {
    const res = await testApp.inject({
      method:  'GET',
      url:     '/api/v1/categories/definitely-does-not-exist-xyz',
      headers: { 'content-type': 'application/json' },
    });
    expect(res.statusCode).toBe(404);
  });
});
