// import 'dotenv/config';

export async function load({ fetch }) {
	try {
		let url = '/api/data/summary';
            if (!import.meta.env.PROD) {
                url = 'http://localhost:5000' + url.replace('/api', '');
            }
		const res = await fetch(url);
		if (!res.ok) throw new Error('Failed to fetch summary data');
		const data = await res.json();

		return {
			data: data
		};
	} catch (error) {
		console.error(error);
		return {
			data: null
		};
	}
}