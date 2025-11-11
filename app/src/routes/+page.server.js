// import 'dotenv/config';

export async function load({ fetch }) {
	try {
		let summary_url = '/api/data/summary';
            if (!import.meta.env.PROD) {
                summary_url = 'http://localhost:5000' + summary_url.replace('/api', '');
            }
		const summary_res = await fetch(summary_url);
		if (!summary_res.ok) throw new Error('Failed to fetch summary data');
		const summary_data = await summary_res.json();

		let latest_jewel_url = '/api/data/latest';
            if (!import.meta.env.PROD) {
                latest_jewel_url = 'http://localhost:5000' + latest_jewel_url.replace('/api', '');
            }
		const latest_res = await fetch(latest_jewel_url);
		if (!latest_res.ok) throw new Error('Failed to fetch latest jewel');
		const latest_jewel = await latest_res.json();

		return {
			'summary': summary_data,
			'latest': latest_jewel
		}
	} catch (error) {
		console.error(error);
		return {
			data: null
		};
	}
}