import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, fetch }) {
	const res = await fetch(url.href);
	if (res.ok) {
		const result: Paged<ProductDto> = await res.json();
		return result;
	}
	throw error(res.status);
}
