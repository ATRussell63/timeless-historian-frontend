import { writable } from "svelte/store";

export const hoverData = writable(null);
export const selectedJewel = writable(null);
export const selectedLeague = writable(null);
export const forceHidden = writable(false);
export const stashMetadata = writable({});

export function clearSelection() {
    selectedJewel.set(null)
    selectedLeague.set(null)
    hoverData.set(null)
}