/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";
import type { ProductDtoView } from "$lib/server/index.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
	const lang: number = locals.lang
	const id = parseInt(params.id);
	const e = await prisma.product.findFirstOrThrow({
		where: {
			id,
		},
	});

	const product: ProductDtoView = {
		id: e.id,
		barcode: e.barcode,
		name: JSON.parse(e.namesJ)[lang],
		description: JSON.parse(e.descriptionsJ)[lang],
		price: e.price,
		images: JSON.parse(e.imagesJ),
	};

	let buf = await prisma.product.findMany({
		take: 4,
		where: {
			id: {
				gt: id,
			},
		},
	});
	if (buf.length < 4) {
		buf = await prisma.product.findMany({
			take: 4,
			where: {
				id: {
					lt: id,
				},
			},
			orderBy: {
				id: "desc",
			},
		});
	}
	const similar: ProductDtoView[] = await Promise.all(
		buf.map(async (e) => {
			return {
				id: e.id,
				barcode: e.barcode,
				name: JSON.parse(e.namesJ)[lang],
				description: JSON.parse(e.descriptionsJ)[lang],
				images: JSON.parse(e.imagesJ),
			};
		})
	);

	return json({ product, similar });
}
