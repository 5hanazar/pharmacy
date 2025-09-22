/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";
import type { ProductDtoView } from "$lib/server/index.js";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
	const lang: number = locals.lang;

	const categories = await prisma.category.findMany({
		where: {
			active: true,
		},
	});
	const list: { code: string; title: string; products: ProductDtoView[] }[] = [];

	for (const category of categories) {
		const products = await prisma.product.findMany({
			take: 10,
			where: {
				keywords: category.code,
			},
			orderBy: {
				sortIndex: "desc",
			},
		});

		const productViews: ProductDtoView[] = products.map((e) => ({
			id: e.id,
			barcode: e.barcode,
			name: JSON.parse(e.namesJ)[lang],
			description: JSON.parse(e.descriptionsJ)[lang],
			groupName: JSON.parse(category.namesJ)[lang],
			price: e.price,
			images: JSON.parse(e.imagesJ),
		}));

		list.push({
			code: category.code,
			title: JSON.parse(category.namesJ)[lang],
			products: productViews,
		});
	}

	const categoryViews: CategoryDtoView[] = categories.map((e) => {
		return {
			id: e.id,
			code: e.code,
			name: JSON.parse(e.namesJ)[lang],
			description: JSON.parse(e.descriptionsJ)[lang],
		};
	});

	return json({ categories: categoryViews, list });
}
