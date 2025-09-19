/** @type {import('./$types').RequestHandler} */
import prisma from '$lib/server';
import type { ProductDtoView } from '$lib/server/index.js';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const lang: number = locals.lang

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
		where,
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

	return json({ result: result, groupCode });
}
