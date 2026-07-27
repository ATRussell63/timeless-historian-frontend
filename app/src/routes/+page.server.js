import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
	try {
		const summary_resp = await fetch('/r', { method: 'POST', body: JSON.stringify({ func: 'summary' })});
		if (!summary_resp.ok) throw new Error('Failed to fetch summary data');
		const summary_data = await summary_resp.json();

		const latest_resp = await fetch('/r', { method: 'POST', body: JSON.stringify({ func: 'latest' })})
		if (!latest_resp.ok) throw new Error('Failed to fetch latest jewel');
		const latest_jewel = await latest_resp.json();

		return {
			'summary': summary_data.body,
			'latest': latest_jewel.body
		}
	} catch (error) {
		console.error(error);
		return {
			summary: null,
			latest: null
		};
	}
}