/** @type {import('./$types').RequestHandler} */
import prisma, { convertProductView } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ params, locals }) {
	const user: ClientDtoView = locals.user;
	const lang: number = locals.lang
	const id = parseInt(params.id);
	const e = await prisma.product.findFirstOrThrow({
		where: {
			id,
		},
	});

	const product: ProductDtoView = await convertProductView(e, user.id, lang)

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
			return await convertProductView(e, user.id, lang)
		})
	);

	return json({ product, similar });
}
