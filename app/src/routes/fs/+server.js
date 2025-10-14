import { json } from "@sveltejs/kit";

const api_base_url = 'https://api.pathofexile.com'

export async function POST({ request }) {
    /** Accept instructions on how to make a request to the PoE API 
     * 
     * url: url suffix like /profile, /account/leagues, etc to be appended to the base url
     * token: the oauth access token 
    */

    const r = await request.json()

    try {
        const token = r.token
        const url = api_base_url + r.url

        // console.log(`pinging ${url} with ${token}`)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Access-Control-Allow-Origin': api_base_url,
                "User-Agent": "timelesshistorian/1.0 (timelessauditor@gmail.com)",
                "Accept": "application/json",
            }
        })

        const body = await response.json();
        // console.log('response from ' + url)
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