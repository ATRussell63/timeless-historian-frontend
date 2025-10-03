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
        const response_code = await response.status
        console.log(`response from ${url}:`)
        console.log(response_body)
        console.log('response headers')
        console.log(response_headers)

        if (response_code !== 200) {
            parseRequestError(response)
        }

        return response_body
    } catch (e) {
        console.log('Error in makeRequest:')
        console.log(e)
    }
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

    // Sometimes old private leagues get stuck in here so we cross reference the available leagues
    const avail_leagues_response = await makeRequest(URLS.leagues)
    const avail_leagues = avail_leagues_response.leagues

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
import { tick } from 'svelte';
import { logout } from '../store'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function searchDBForJewel(jewel, sample = false) {
    waiting_on_api.set(true)

    let redirectAfter = false

    let request_body = {
        "jewel_type": 'Any',
        "seed": 'Any',
        "general": 'Any',
        "mf_mods": null
    }

    const limit = getRandomInt(15, 20)
    let url = `/api/data/sample?limit=${limit}`;

    if (!sample) {
        request_body = {
            "jewel_type": jewel.jewel_type,
            "seed": jewel.seed,
            "general": jewel.general,
            "mf_mods": jewel.mf_mods
        }
        url = '/api/search';
    }

    if (!import.meta.env.PROD) {
        url = 'http://localhost:5000' + url.replace('/api', '');
    }

    let method = sample ? 'GET' : 'POST'

    try {
        let req_obj = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
        }
        if (method === 'POST') {
            req_obj['body'] = JSON.stringify(request_body)
        }
        const response = await fetch(url, req_obj);
        const data = { body: request_body, response: await response.json() };
        search_result.set(data);
        if (response.ok && Object.keys(data.response.results).length > 0) {
            redirectAfter = true
        } else {
            throwErrorToast('No jewels found', 'Search returned 0 results')
            redirectAfter = false
        }

    } catch (err) {
        parseRequestError(response);
        redirectAfter = false
    } finally {
        waiting_on_api.set(false);
    }

    return redirectAfter
}

async function parseRequestError(response) {
    if (response.status === 429) {
        // we got rate limited, throw an error saying how long we're banned for
        const retryAfter = response.headers.get('Retry-After')
        throwErrorToast(
            'Rate Limit Exceeded',
            `Try again in ${retryAfter} seconds.`
        )
    } else if (response.status === 401) {
        // Unauthorized, either completely bogus token or expired
        // TODO - log the user out, probably want to give them a toast warning that the token expired too
        throwErrorToast('Invalid/expired token', 'Please log in again')
        logout()
    } else {
        console.log('Unrecognized error:')
        console.log(response)
        console.log(await response.json())
    }
}

function throwErrorToast(error_title, error_body) {
    toast.pop()
    toast.push(`<p style='font-family: Roboto-Bold;'>${error_title}</p><p style='font-family: Roboto;'>${error_body}</p>`,
        {
            duration: 3000,
            theme: {
                '--toastColor': 'hsl(var(--foreground))',
                '--toastBackground': 'hsl(var(--background))',
                '--toastBarBackground': 'red',
            }
        })
}

export async function searchDBThenScroll(jewel, scrollTarget) {
    await searchDBForJewel(jewel)
    await tick();
    document.getElementById('resultsScrollTarget').scrollIntoView({ block: 'end', behavior: 'smooth' });
}