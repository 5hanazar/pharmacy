/** @type {import('./$types').RequestHandler} */
import prisma, { convertProductView, formatTime, getRelativeTime } from "$lib/server";
import { getCache, setCache } from "$lib/server/cache";
import { Category, Pharmacy } from "@prisma/client";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
	const user: ClientDtoView = locals.user;
	const lang: number = locals.lang;

	let bufCategories: Category[];
	let bufPharmacies: Pharmacy[];
	const cached = getCache('home');
	if (cached) {
		const a = JSON.parse(cached);
		bufCategories = a.bufCategories
		bufPharmacies = a.bufPharmacies
	} else {
		bufCategories = await prisma.$queryRaw<Category[]>`SELECT * FROM categories WHERE active = 1 ORDER BY RAND();`;
		bufPharmacies = await prisma.$queryRaw<Pharmacy[]>`SELECT * FROM pharmacies WHERE active = 1 ORDER BY RAND() LIMIT 8;`;
		setCache('home', JSON.stringify({ bufCategories, bufPharmacies }));
	}

	const list: { code: string; title: string; products: ProductDtoView[] }[] = [];
	for (const category of bufCategories) {
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

	const pharmacies = bufPharmacies.map(e => ({
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

	const categoryViews: CategoryDtoView[] = bufCategories.sort((a, b) => a.id - b.id).map((e) => {
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
