const api_base_url = 'https://api.pathofexile.com'


export async function getAccountName() {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
        console.log('No token to getAccountName with!')
        return
    }

    const profileURL = api_base_url + '/profile'
    try {
        const response = await fetch(profileURL, {method: 'GET'});
        const response_body = await response.json();
        const account_name = response_body.name;
        return account_name
    } catch(e) {
        console.log('Error in getAccountName:')
        console.log(e)
    }
}