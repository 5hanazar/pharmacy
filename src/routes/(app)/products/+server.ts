/** @type {import('./$types').RequestHandler} */
import prisma from '$lib/server';
import type { Paged, ProductDtoView } from '$lib/server/index.js';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
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
	else if (groupCode.length > 0) {
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
	const categories = await prisma.category.findMany({
		where: {
			active: true
		}
	});
	const data: ProductDtoView[] = await Promise.all(
		products.map(async (e) => {
			return {
				id: e.id,
				barcode: e.barcode,
				name: JSON.parse(e.namesJ)[lang],
				description: JSON.parse(e.descriptionsJ)[lang],
				groupName: JSON.parse(categories.find(o => o.code == e.keywords)?.namesJ ?? "")[lang],
				price: e.price,
				images: JSON.parse(e.imagesJ),
			};
		})
	);
	const count = await prisma.product.count({
		where
	});
	const result: Paged<ProductDtoView> & { query: string, groupCode: string } = {
		count,
		data: data,
		size,
		pageIndex,
		query: query.length > 0 ? `q=${query}` : `g=${groupCode}`,
		groupCode: groupCode.length > 0 ? groupCode : 'all'
	};
	return json(result);
}
