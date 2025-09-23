/** @type {import('./$types').RequestHandler} */
import prisma, { convertCategory, convertProduct } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
	const buf = await prisma.category.findMany({
		where: {
			active: true,
		},
		orderBy: {
			parentCode: "asc"
		}
	});
	const groups = buf.map((e) => {
		return convertCategory(e);
	});

	if (params.id == "new") {
		return json({ result: {}, groups });
	}
	const e = await prisma.product.findFirstOrThrow({
		where: {
			id: parseInt(params.id),
		},
	});
	const result: ProductDto = await convertProduct(e);
	return json({ result, groups });
}

export async function DELETE({ params }) {
	await prisma.product.delete({
		where: {
			id: parseInt(params.id),
		},
	});
	return new Response(null, {
		status: 200,
	});
}