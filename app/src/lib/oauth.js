

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
    redirectURL += '&redirect_uri=https://www.timelesshistorian.xyz/'
    redirectURL += '&code_challenge=' + code_challenge
    redirectURL += '&code_challenge_method=S256'

    localStorage.setItem('code_verifier', code_verifier);
    localStorage.setItem('oauth_state', state);
    window.location.href = redirectURL;
}

export async function getAccessCode(oauth_code) {
    const code_verifier = localStorage.getItem('code_verifier');

    const request_body = {
        oauth_code: oauth_code,
        code_verifier: code_verifier
    }

    try {
        let response = await fetch('/fs/token', {
            method: 'POST',
            body: JSON.stringify(request_body)
        })

        const fs_response = await response.json();
        const { body, headers, status } = fs_response
        try {
            localStorage.setItem('token_exp', Date.now() + (body.expires_in * 1000))
            localStorage.setItem('access_token', body.access_token)
        } catch (e) {
            console.log('Error in response body:')
            console.log(fs_response)
        }
    } catch (e) {
        console.log('Error in token fetch:')
        console.log(e)
    }
}