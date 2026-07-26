import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
    try {
        const joats_resp = await fetch('/api', { method: 'POST', body: JSON.stringify({ func: 'joats', limit: 20 })})
        if (!joats_resp.ok) throw new Error('Failed to fetch jewel data')
        const joats_data = await joats_resp.json()
        console.log(joats_data)

        return {
            data: joats_data
        }
    } catch (error) {
        console.error(error);
        return {
            data: null
        }
    }
}