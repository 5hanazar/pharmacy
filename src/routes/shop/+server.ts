/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals, url }) {
	const user: PharmacyDtoView = locals.user;
	const lang: number = locals.lang;

	const pageIndex = parseInt(url.searchParams.get("p") || "1");
	const size = parseInt(url.searchParams.get("s") || "8");

	const buf = await prisma.orderRequest.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		include: {
			lines: {
				include: {
					product: true,
				},
			},
		},
		where: {
			active: true,
		},
		orderBy: {
			createdGmt: 'desc'
		}
	});

	const data = buf.map<OrderRequestDtoView>((e) => {
		let total = 0;
		const lines = e.lines.map<OrderRequestLineDtoView>((r) => {
			total += r.product.price * r.quantity
			return {
				barcode: r.product.barcode,
				name: JSON.parse(r.product.namesJ)[lang],
				description: JSON.parse(r.product.descriptionsJ)[lang],
				price: r.product.price,
				quantity: r.quantity,
			};
		});
		return {
			id: e.id,
			phone: e.phoneToContact,
			address: e.address,
			description: e.description,
			lines: lines,
			total: total,
			createdDate: formatTime(e.createdGmt),
		};
	});

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
