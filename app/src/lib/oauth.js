

function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64UrlEncode(array);
}

function base64UrlEncode(buffer) {
    return btoa(String.fromCharCode(...buffer))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function redirectToAuthorize() {
    let code_verifier = generateCodeVerifier()

    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    let code_challenge = base64UrlEncode(new Uint8Array(digest));

    let state = generateCodeVerifier();

    let redirectURL = 'https://www.pathofexile.com/oauth/authorize'
    redirectURL += '?client_id=timelesshistorian'
    redirectURL += '&response_type=code'
    redirectURL += '&scope=' + encodeURIComponent('account:profile account:leagues account:stashes account:characters')
    redirectURL += '&state=' + state
    redirectURL += '&redirect_uri=https://www.timelesshistorian.xyz'
    redirectURL += '&code_challenge=' + code_challenge
    redirectURL += '&code_challenge_method=S256'

    localStorage.setItem('code_verifier', code_verifier);
    localStorage.setItem('oauth_state', state);
    // TODO remove this in bulk release
    console.log('CODE VERIFIER')
    console.log(code_verifier)
    window.location.href = redirectURL;
}

export async function getAccessCode(oauth_code) {
    const code_verifier = localStorage.getItem('code_verifier');

    const tokenURL = 'https://www.pathofexile.com/oauth/token'
    const body = new URLSearchParams({
        'client_id': 'timelesshistorian',
        // 'client_secret': '',
        'grant_type': 'authorization_code',
        'code': oauth_code,
        'redirect_uri': 'https://www.timelesshistorian.xyz',
        'scope': encodeURIComponent('account:profile account:leagues account:stashes'),
        'code_verifier': code_verifier
    })

    try {
        let response = await fetch(tokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })

        let response_body = await response.json();
        try {
            localStorage.setItem('token_exp', Date.now() + response_body.expires_in)
            localStorage.setItem('access_token', response_body.access_token)
        } catch (e) {
            console.log('Error in response body:')
            console.log(response_body)
        }
    } catch (e) {
        console.log('Error in token fetch:')
        console.log(e)
    }
}