import { sha256 } from 'js-sha256';


function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function randomBytes() {
    const randomArray = new Uint8Array(32);
    const randomString = window.crypto.getRandomValues(randomArray);
    let secret = ''
    randomString.forEach((b) => b = secret += String.fromCharCode(b));
    return secret
}

export function redirectToAuthorize() {
    let code = randomBytes();
    let code_verifier = base64UrlEncode(code);
    let code_challenge = base64UrlEncode(sha256(code_verifier));

    let state = base64UrlEncode(randomBytes());

    let redirectURL = 'https://www.pathofexile.com/oauth/authorize'
    redirectURL += '?client_id=timelesshistorian'
    redirectURL += '&response_type=code'
    redirectURL += '&scope=' + base64UrlEncode('account:profile account:leagues account:stashes')
    redirectURL += '&state=' + state
    redirectURL += '&redirect_uri=https://www.timelesshistorian.xyz'
    redirectURL += '&code_challenge=' + code_challenge
    redirectURL += '&code_challenge_method=S256'

    localStorage.setItem('code_verifier', code_verifier);
    localStorage.setItem('oauth_state', state);

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
        'scope': 'account:profile account:leagues account:stashes',
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
        } catch(e) {
            console.log('Error in response body:')
            console.log(response_body)
        }
    } catch(e) {
        console.log('Error in token fetch:')
        console.log(e)
    }
}