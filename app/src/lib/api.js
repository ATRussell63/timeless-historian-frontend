const api_base_url = 'https://api.pathofexile.com'

const URLS = {
    profile: api_base_url + '/profile',
    leagues: api_base_url + '/account/leagues',
    stashes: api_base_url + '/stash',
    characters: api_base_url + '/character'
}

const SUPPORTED_STASH_TYPES = ['PremiumStash', 'QuadStash', 'NormalStash']

async function makeRequest(url) {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
        console.log('No token to make request!')
        return
    }

    try {
        const response = await fetch(url, 
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            });
        const response_body = await response.json();
        const response_headers = await response.headers;
        console.log(`response from ${url}:`)
        console.log(response_body)
        console.log('response headers')
        console.log(response_headers)
        return response_body
    } catch(e) {
        console.log('Error in makeRequest:')
        console.log(e)
    }
}

function parseRateLimitHeader() {

}

export async function getAccountName() {
    const response = await makeRequest(URLS.profile)
    return response.name
}

export async function getAccountLeagues() {
    // We want to only include leagues that the account actually plays
    // Get the character list and make a list of present leagues
    const acc_characters_response = await makeRequest(URLS.characters)
    const leagues = new Set(acc_characters_response.characters.map((c) => c.league))
    console.log('account has characters in:')
    console.log(leagues)

    // Sometimes old private leagues get stuck in here so we cross reference the available leagues
    const avail_leagues_response = await makeRequest(URLS.leagues)
    const avail_leagues = avail_leagues_response.leagues
    console.log('current leagues:')
    console.log(avail_leagues)

    return avail_leagues.filter(l => leagues.has(l.name))
}

export async function getLeagueStashList(league) {
    let stashes = await getAccountStashes(league)
    if (stashes.length > 0) {
        stashes = flattenStashes(stashes)
        league_to_stashes[league] = filterUnsupportedStashTypes(stashes)
    }

    return stashes
}

export async function getAccountStashes(league) {
    const response = await makeRequest(URLS.stashes + '/' + league)
    return response.stashes
}

export function flattenStashes(stashes) {
    // StashTabs can have children, and in that case they should not have items
    // reformats the list of StashTabs by removing the parent 'layer' of tabs

    const flatStashes = [];
    for (const stash of stashes) {
        if (stash.children) {
            flatStashes.push(...stash.children)
        } else {
            flatStashes.push(stash)
        }
    }
    return flatStashes
}

export function filterUnsupportedStashTypes(stashes) {
    // only include stashes that we can render easily
    // I'm not going to crawl the fossil tab just because there's 1 jewel in it!
    return stashes.filter(s => SUPPORTED_STASH_TYPES.includes(s.type))
}

export async function getJewelsFromStashTab(league, stash_id) {
    const response = await makeRequest(URLS.stashes + '/' + league + '/' + stash_id)

    return response.stash.items.filter(i => i.typeLine === 'Timeless Jewel')
}

import { toast } from '@zerodevx/svelte-toast';
import { search_result, waiting_on_api } from '../store';

export async function searchDBForJewel(jewel) {
    console.log('searching db for jewel')
    console.log(jewel)
    try {
            const request_body = {
                    "jewel_type": jewel.jewel_type,
                    "seed": jewel.seed,
                    "general": jewel.general,
                    "mf_mods": jewel.mf_mods
                }
            let url = '/api/search';
            if (!import.meta.env.PROD) {
                url = 'http://localhost:5000' + url.replace('/api', '');
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(request_body)
            });

            const data = { body: request_body, response: await response.json() };
            console.log('setting search result')
            console.log(data)
            search_result.set(data);
            if (response.ok && Object.keys(data.response.results).length > 0) {
                // TODO - restore this redirect in the actual search page
                // goto('/search/results');
            } else {
                // display an error somewhere
                toast.pop()
                toast.push(`<p style='font-family: Roboto-Bold;'>No jewels found</p><p style='font-family: Roboto;'>Search returned 0 results</p>`,
                           {duration: 3000,
                            theme: {
                                '--toastColor': 'hsl(var(--foreground))',
                                '--toastBackground': 'hsl(var(--background))',
                                '--toastBarBackground': 'red',
                                }
                           })
            }

            } catch (err) {
            error = err.message;
            } finally {
            waiting_on_api.set(false);
        }
}
