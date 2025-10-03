import { writable } from "svelte/store";

export const search_result = writable(null);

export const data_summary = writable(null);

export const account_name = writable(null);

export const account_leagues = writable([]);

export const stashes_per_league = writable({});

export const api_jewel_data = writable({});

export const bulk_result = writable(null);

export const waiting_on_api = writable(false);

export function logout() {
    account_name.set(null)
    account_leagues.set([])
    stashes_per_league.set({})
    localStorage.removeItem('token_exp')
    localStorage.removeItem('access_token')
    localStorage.removeItem('account_name')
    localStorage.removeItem('code_verifier')
    localStorage.removeItem('oauth_state')
}
