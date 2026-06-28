import { useSWR } from "sswr";
import { writable, type Readable } from "svelte/store";
import { getToken } from "../../components/structure/auth/auth0-helpers";
import { envVars } from "../../utils/env-vars";
import { useSvelteInterval } from "../../utils/hooks";

export type SWRFetchOptions<T> = Partial<Omit<SWROptions<T>, 'fetcher'> & { refreshInterval?:Readable<number|null|undefined> }>;
export type SWRFetchOptionsExposed<T=any> = Pick<SWRFetchOptions<T>, 'refreshInterval'>;
export const useSwrFetch = <T,>(key:string, fetcher:() => Promise<T>, options?:SWRFetchOptions<T>) => {
  let isFetching = writable(false);
  let intervalId: NodeJS.Timeout | null = null;

  const swrResult = useSWR<T>(key, {
    ...options,
    fetcher: async () => {
      isFetching.set(true);
      try {
        return await fetcher();
      } finally {
        isFetching.set(false);
      }
    }
  });
	if(options?.refreshInterval) useSvelteInterval(() =>(swrResult.mutate(undefined)), options.refreshInterval);
	
	return {
		...swrResult,
		isFetching
	};
}

export const getHeadersForJsonPostWithAuth = async (forceRefresh = false) => ({
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	[envVars.API_AUTH_HEADER]: `Bearer ${await getToken(forceRefresh)}`
})

export type ErrorableResponse<T> = T | { error:string };

const parseJsonResponse = async (resp: Response): Promise<{ resp: Response; json: {}; text: string }> => {
	try {
		const json = await resp.json();
		return { resp, json, text: '' };
	} catch {
		const text = await resp.text();
		return { resp, json: { error: text || 'Invalid JSON response from server' }, text };
	}
};

const extractErrorMessage = (data: unknown, text: string, status: number) => {
	if (data && typeof data === 'object' && !Array.isArray(data)) {
		const errorData = data as Record<string, unknown>;
		if (typeof errorData.error === 'string') return errorData.error;
		if (typeof errorData.message === 'string') return errorData.message;
	}
	return text || `HTTP ${status}`;
};

export const standardJsonPostFetch = async <Req extends {}, Res>(url:string, req:Req) : Promise<ErrorableResponse<Res>> => {
	const makeRequest = async (forceRefresh: boolean) => {
		const headers = await getHeadersForJsonPostWithAuth(forceRefresh);
		return await fetch(url, { method: 'POST', headers, body: JSON.stringify(req) }).then(parseJsonResponse);
	};

	let { resp, json, text } = await makeRequest(false);

	if (resp.ok) { return json as Res;}

	if (resp.status === 401) {
		({ resp, json, text } = await makeRequest(true));
		if (resp.ok) { return json as Res; }
	}

	const errMsg = extractErrorMessage(json, text, resp.status);
	return { error: String(errMsg) };
};

export type SWRFetcher<D = any> = (...props: any[]) => Promise<D> | D;
// sswr / swrev types aren't working for me, so just redefining it here
export interface SWROptions<D = any> {
    // /**
    //  * Determines the cache to use for SWR.
    //  */
    // cache: SWRCache;
    // /**
    //  * Determines the error event target where
    //  * the errors will be dispatched.
    //  */
    // errors: SWREventManager;
    /**
     * Determines the fetcher function to use.
     */
    fetcher: SWRFetcher<D>;
    /**
     * Represents the fallback data to use instead of undefined.
     * Keep in mind SWR will still attempt to re-validate
     * unless `revalidateOnStart` is set false.
     */
    fallbackData: D | undefined;
    /**
     * Determines if we should attempt to load the
     * initial data from the cache. If this fails, we'll show
     * the `fallbackData`.
     */
    loadInitialCache: boolean;
    /**
     * Determines if SWR should perform a revalidation when
     * it's called.
     */
    revalidateOnStart: boolean;
    /**
     * Determines the dedupling interval.
     * This interval represents the time SWR will
     * avoid to perform a request if the last one was
     * made before `dedupingInterval` ago.
     */
    dedupingInterval: number;
    /**
     * Revalidates the data when the window re-gains focus.
     */
    revalidateOnFocus: boolean;
    /**
     * Interval throttle for the focus event.
     * This will ignore focus re-validation if it
     * happened last time `focusThrottleInterval` ago.
     */
    focusThrottleInterval: number;
    /**
     * Revalidates the data when a network connect change
     * is detected (basically the browser / app comes back online).
     */
    revalidateOnReconnect: boolean;
    // /**
    //  * You can use this function to manually call
    //  * the notify callback when the application has
    //  * reconnected. You can also return a function
    //  * that will be called as a cleanup.
    //  */
    // reconnectWhen: (notify: () => void, options: NetworkOptions) => void | (() => void);
    // /**
    //  * You can use this function to manually call
    //  * the notify callback when the application has
    //  * gained focus. You can also return a function
    //  * that will be called as a cleanup.
    //  */
    // focusWhen: (notify: () => void, options: VisibilityOptions) => void | (() => void);
    // /**
    //  * The revalidation function to use. If not specified,
    //  * it will use the default revalidation with the `revalidateOptions`.
    //  */
    // revalidateFunction: SWRRevalidateFunction<D> | undefined;
}