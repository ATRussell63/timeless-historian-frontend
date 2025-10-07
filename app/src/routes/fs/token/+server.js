import { json } from '@sveltejs/kit'
import { CLIENT_SECRET } from '$env/static/private';

const tokenURL = 'https://www.pathofexile.com/oauth/token'

export async function POST({ request }) {
    /** Accepts an oauth code and code verifier to fetch an oauth access code */

    const r = await request.json()

    try {
        const request_body = new URLSearchParams({
            'client_id': 'timelesshistorian',
            'client_secret': CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': r.oauth_code,
            'redirect_uri': 'https://www.timelesshistorian.xyz/',
            'scope': 'account:profile account:leagues account:stashes account:characters',
            'code_verifier': r.code_verifier
        })

        // console.log('pinging /token with:')
        // console.log(request_body)

        const response = await fetch(tokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": "timelesshistorian/1.0 (timelessauditor@gmail.com)",
                "Accept": "application/json",
            },
            body: request_body
        })

        const body = await response.json()
        // console.log('/token response:')
        // console.log(body)
        return json({
            body: body,
            headers: response.headers,
            status: response.status
        })

    } catch (e) {
        console.log(e)
        return json({
            error: e
        })
    }
}