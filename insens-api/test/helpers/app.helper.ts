/**
 * Test application helper.
 *
 * Bootstraps the full NestJS + Fastify app against the real database
 * (configured via DATABASE_URL in the .env file).
 * Starts on a random free port and uses native fetch() for HTTP calls.
 */
import 'reflect-metadata';
import { Test }                                from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule }                           from '../../src/app.module';
import { globalValidationPipe }                from '../../src/core/pipes/validation.pipe';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type InjectOpts = {
  method:   HttpMethod;
  url:      string;          // relative path, e.g. /api/v1/auth/register
  payload?: unknown;
  headers?: Record<string, string>;
};

export type InjectResult = {
  statusCode: number;
  json:       () => any;
};

export type TestApp = {
  inject:  (opts: InjectOpts) => Promise<InjectResult>;
  close:   () => Promise<void>;
};

export async function createTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter({ logger: false }),
  );

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(globalValidationPipe);

  await app.init();
  // Listen on a random OS-assigned port
  await app.listen(0, '127.0.0.1');

  const baseUrl = await app.getUrl();  // returns http://127.0.0.1:<port>

  const inject = async (opts: InjectOpts): Promise<InjectResult> => {
    const url     = `${baseUrl}${opts.url}`;
    const hasBody = opts.payload !== undefined;
    const res = await fetch(url, {
      method:  opts.method,
      headers: {
        ...(hasBody ? { 'content-type': 'application/json' } : {}),
        ...(opts.headers ?? {}),
      },
      body: hasBody ? JSON.stringify(opts.payload) : undefined,
    });

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    return {
      statusCode: res.status,
      json:       () => parsed,
    };
  };

  return {
    inject,
    close: () => app.close(),
  };
}

/** Convenience: register + login, return tokens */
export async function registerAndLogin(
  inject:   TestApp['inject'],
  email     = `test_${Date.now()}@example.com`,
  password  = 'Test1234!',
) {
  await inject({
    method:  'POST',
    url:     '/api/v1/auth/register',
    payload: { email, password },
  });

  const res = await inject({
    method:  'POST',
    url:     '/api/v1/auth/login',
    payload: { email, password },
  });

  const body = res.json();
  return {
    accessToken:  body.data?.accessToken  as string,
    refreshToken: body.data?.refreshToken as string,
    user:         body.data?.user,
  };
}

/** Build bearer auth header */
export function bearer(token: string): Record<string, string> {
  return { authorization: `Bearer ${token}` };
}
