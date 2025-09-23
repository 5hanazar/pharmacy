/** @type {import('./$types').RequestHandler} */
import prisma, { convertProductView } from '$lib/server';
import translations from '$lib/translations.js';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const user: ClientDtoView = locals.user;
	const lang: number = locals.lang

	const pageIndex = parseInt(url.searchParams.get("p") || "1");
	const size = parseInt(url.searchParams.get("s") || "8");

	const query = url.searchParams.get("q") || "";
	const groupCode = url.searchParams.get("g") || "";

	let where: any = {
		active: true,
	}
	if (query.length > 0) {
		where['OR'] = [
			{
				namesJ: {
					contains: query
				}
			},
			{
				descriptionsJ: {
					contains: query
				}
			}
		]
	}
	if (groupCode.length > 0) {
		where['keywords'] = {
			contains: groupCode
		}
	}

	const products = await prisma.product.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		where,
		orderBy: {
			sortIndex: 'desc'
		}
	});
	const data: ProductDtoView[] = await Promise.all(
		products.map(async (e) => {
			return await convertProductView(e, user.id, lang)
		})
	);
	const count = await prisma.product.count({
		where
	});

	const categories = await prisma.category.findMany({
		where: {
			active: true
		}
	});
	const langMap = ["en", "ru", "tk"];
	const locale = langMap[lang] || "en";
	const result: Paged<ProductDtoView> & { query: string, groupName: string } = {
		count,
		data: data,
		size,
		pageIndex,
		query: query.length > 0 ? `q=${query}` : `g=${groupCode}`,
		groupName: groupCode.length > 0 ? JSON.parse(categories.find(o => o.code == groupCode)?.namesJ ?? "")[lang] : translations[locale]['all_products']
	};
	return json(result);
}
