/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getTimestampGMT } from "$lib/server";
import { OrderResponseLine } from "@prisma/client";
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
				orderBy: {
					line: 'asc'
				}
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
				id: r.productId,
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
			responses: []
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
		username: user.name
	};

	return json(result);
}

export async function POST({ request, locals }) {
	const user: PharmacyDtoView = locals.user;
	const input = Object.fromEntries(await request.formData());
	const body: PostOrderResponseDtoView = await JSON.parse(input.data);

	const _check = await prisma.orderResponse.findFirst({
		where: {
			orderRequestId: body.orderRequestId,
			pharmacyId: user.id,
		}
	})
	if (_check != null) {
		return new Response("", {
			status: 200,
		});
	}

	const r = await prisma.orderResponse.create({
		data: {
			active: true,
			orderRequestId: body.orderRequestId,
			pharmacyId: user.id,
			description: body.description,
			createdGmt: getTimestampGMT(),
			modifiedGmt: getTimestampGMT(),
		}
	})

	const linesP: OrderResponseLine[] = []
	body.lines.forEach((e, i) => {
		linesP.push({ line: i + 1, orderResponseId: r.id, productId: e.productId, price: e.price, quantity: e.quantity })
	})

	await prisma.orderResponseLine.createMany({
		data: linesP
	})

	return new Response("", {
		status: 200,
	});
}