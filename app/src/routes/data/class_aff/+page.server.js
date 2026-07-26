import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
    try {
        const class_aff_resp = await fetch('/api', { method: 'POST', body: JSON.stringify({ func: 'class_aff', limit: 20 })})
        if (!class_aff_resp.ok) throw new Error('Failed to fetch data')
        const class_aff_data = await class_aff_resp.json()
        console.log(class_aff_data)

        return {
            data: class_aff_data
        }
    } catch (error) {
        console.error(error);
        return {
            data: null
        }
    }
}