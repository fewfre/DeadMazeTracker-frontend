import { onMount } from "svelte";
import type { Readable } from "svelte/store";

/** `useInterval` for svelete that allows for dynamic delay. Stops interval if delay is 0 or null/undefined. */
export function useSvelteInterval(callback:()=>void, delayStore:Readable<number|null|undefined>) {
  let intervalId:NodeJS.Timeout;

  onMount(() => {
    // Subscribe to changes in the delay store
    const unsubscribe = delayStore.subscribe((delay) => {
      // Clear old interval
      if (intervalId) clearInterval(intervalId);
      
      // Start new interval with updated delay
      if (!!delay) {
        intervalId = setInterval(callback, delay);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  });
}