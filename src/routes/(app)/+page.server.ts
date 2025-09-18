/** @type {import('./$types').PageServerLoad} */
import type { ProductDtoView } from '$lib/server';
import prisma from '$lib/server';

export async function load({ locals }) {
	const lang: number = locals.lang
	const products = await prisma.product.findMany({
		take: 8,
		where: {
			active: true,
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
				price: e.price,
				images: JSON.parse(e.imagesJ),
			};
		})
	);
	return { result }
}