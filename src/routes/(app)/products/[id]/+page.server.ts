/** @type {import('./$types').PageServerLoad} */
import { error } from "@sveltejs/kit";

export async function load({ url, cookies }) {
	let cookieString = "";
	for (const { name, value } of cookies.getAll()) cookieString += `${name}=${value};`;
	const res = await fetch(url.href, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Cookie: cookieString,
		},
	});
	if (res.ok) {
		const result: { product: ProductDtoView; similar: ProductDtoView[] } =
			await res.json();
		return result;
	}
	throw error(res.status);
}
