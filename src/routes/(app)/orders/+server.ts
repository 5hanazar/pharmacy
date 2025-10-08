/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals, url }) {
	const user: ClientDtoView = locals.user;

	const pageIndex = parseInt(url.searchParams.get("p") || "1");
	const size = parseInt(url.searchParams.get("s") || "8");

	const buf = await prisma.orderRequest.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		include: {
			orderRequestLines: {
				include: {
					product: true,
				},
			},
		},
		where: {
			active: true,
			clientId: user.id
		},
	});

	const data = buf.map<OrderRequestDtoView>((e) => ({
		phone: e.phoneToContact,
		address: e.address,
		description: e.description,
		lines: e.orderRequestLines.map<OrderRequestLineDtoView>((r) => ({
			barcode: r.product.barcode,
			name: r.product.namesJ,
			description: r.product.descriptionsJ,
			price: r.product.price,
		})),
		createdDate: formatTime(e.createdGmt),
	}));

	const count = await prisma.orderRequest.count({
		where: {
			active: true,
		}
	});

	const result: Paged<OrderRequestDtoView> = {
		count,
		data: data,
		size,
		pageIndex,
	};

	return json(result);
}
