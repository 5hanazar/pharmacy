/** @type {import('./$types').RequestHandler} */
import prisma from '$lib/server';
import type { ProductDtoView } from '$lib/server/index.js';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const lang: number = locals.lang
	const groupName = url.searchParams.get("g") || "";
	const products = await prisma.product.findMany({
		where: {
			active: true,
			keywords: {
				contains: groupName
			}
		},
		orderBy: {
			sortIndex: 'desc'
		}
	});
	const result: ProductDtoView[] = await Promise.all(
		products.map(async (e) => {
			return {
				id: e.id,
				barcode: e.barcode,
				name: JSON.parse(e.namesJ)[lang],
				description: JSON.parse(e.descriptionsJ)[lang],
				images: JSON.parse(e.imagesJ),
			};
		})
	);

	return json({ result: result, groupName });
}
