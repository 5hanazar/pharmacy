/** @type {import('./$types').RequestHandler} */
import prisma, { convertProductView } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
	const user: ClientDtoView = locals.user;
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

		const productViews: ProductDtoView[] = await Promise.all(
			products.map(async (e) => {
				return await convertProductView(e, user.id, lang)
			})
		);

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
	const result: HomeDtoView = { categories: categoryViews, list: list };
	return json(result);
}
