/** @type {import('./$types').RequestHandler} */
import prisma, { convertCategory, type CategoryDto } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
	if (params.id == "new") {
		return json({});
	}
	const e = await prisma.category.findFirstOrThrow({
		where: {
			id: parseInt(params.id),
		},
	});
	const result: CategoryDto = convertCategory(e);
	return json(result);
}

export async function DELETE({ params }) {
	await prisma.category.delete({
		where: {
			id: parseInt(params.id),
		},
	});
	return new Response(null, {
		status: 200,
	});
}
