// import 'dotenv/config';

export async function load({ fetch }) {
	try {
		const res = await fetch(`/api/data/summary`);
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