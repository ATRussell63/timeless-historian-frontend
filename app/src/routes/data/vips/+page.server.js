import { env } from '$env/dynamic/private';
import { PUBLIC_CURRENT_LEAGUE } from '$env/static/public';

export async function load({ fetch }) {
    try {
        let search_params = {
            leagues: [ PUBLIC_CURRENT_LEAGUE ]
        }
        const vips_resp = await fetch('/r', { method: 'POST', body: JSON.stringify({ func: 'vips', search_params })})
        if (!vips_resp.ok) throw new Error('Failed to fetch data')
        const vips_data = await vips_resp.json()
        console.log(vips_data)

        return {
            data: vips_data
        }
    } catch (error) {
        console.error(error);
        return {
            data: null
        }
    }
}