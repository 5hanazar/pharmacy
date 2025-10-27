/** @type {import('./$types').RequestHandler} */
import prisma, { convertProductView, formatTime, getRelativeTime } from "$lib/server";
import { Category, Pharmacy } from "@prisma/client";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
	const user: ClientDtoView = locals.user;
	const lang: number = locals.lang;

	const categories = await prisma.$queryRaw<Category[]>`SELECT * FROM categories WHERE active = 1 ORDER BY RAND();`;
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

	const buf: Pharmacy[] = await prisma.$queryRaw<Pharmacy[]>`SELECT * FROM pharmacies WHERE active = 1 ORDER BY RAND() LIMIT 8;`;
	const pharmacies = buf.map(e => ({
		id: e.id,
		name: e.name,
		phone: e.phone,
		phones: JSON.parse(e.phonesJ),
		address: e.address,
		description: e.description,
		password: e.password,
		createdDate: formatTime(e.createdGmt),
		modifiedDate: getRelativeTime(e.modifiedGmt),
	}))

	const categoryViews: CategoryDtoView[] = categories.sort((a, b) => a.id - b.id).map((e) => {
		return {
			id: e.id,
			code: e.code,
			name: JSON.parse(e.namesJ)[lang],
			description: JSON.parse(e.descriptionsJ)[lang],
		};
	});
	const result: HomeDtoView = { categories: categoryViews, pharmacies: pharmacies, list: list };
	return json(result);
}
