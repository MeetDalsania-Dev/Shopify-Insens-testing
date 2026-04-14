import http from './http';

// The Axios response interceptor unwraps data, so the actual runtime value is T.
// We cast here so SWR hooks receive the correct type.
export const swrFetcher = (url: string): Promise<any> => http.get(url) as unknown as Promise<any>;
