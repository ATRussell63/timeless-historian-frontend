import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
    try {
        const general_hist_resp = await fetch('/api', { method: 'POST', body: JSON.stringify({ func: 'general_hist' })})
        if (!general_hist_resp.ok) throw new Error('Failed to fetch jewel data')
        const general_hist_data = await general_hist_resp.json()
        console.log(general_hist_data)

        return {
            data: general_hist_data
        }
    } catch (error) {
        console.error(error);
        return {
            data: null
        }
    }
}