/**
 * SWR fetcher using the global Axios instance.
 * The http instance already unwraps the API envelope,
 * so SWR receives the clean data payload directly.
 */

import http from "@/shared/lib/http";

/**
 * SWR fetcher using the global Axios instance.
 * The http interceptor already unwraps the API envelope,
 * so this returns the clean data payload (typed as T via SWR generics).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swrFetcher = <T = any>(url: string): Promise<T> => http.get<T>(url) as unknown as Promise<T>;

export default swrFetcher;
