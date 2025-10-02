/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT } from "$lib/server";
import { OrderRequestLine } from "@prisma/client";

export async function POST({ request, locals }) {
	const user: ClientDtoView = locals.user;
	const input = Object.fromEntries(await request.formData());
	const body: PostOrderDtoView = await JSON.parse(input.data);

	const basket = await prisma.basket.findMany({
		include: {
			product: true
		},
		where: {
			warehouse: 0,
			clientId: user.id
		},
		orderBy: {
			createdGmt: 'asc'
		}
	})
	if (basket.length == 0) {
		return new Response("", {
			status: 403,
		});
	}

	const order = await prisma.orderRequest.create({
		data: {
			active: true,
			clientId: user.id,
			phoneToContact: body.phoneToContact,
			address: body.address,
			description: body.description,
			createdGmt: getTimestampGMT(),
			modifiedGmt: getTimestampGMT(),
		},
	})

	const orderlines: OrderRequestLine[] = []
	basket.forEach((e, i) => {
		orderlines.push({ line: i + 1, orderRequestId: order.id, productId: e.productId, quantity: e.quantity })
	})

	await prisma.orderRequestLine.createMany({
		data: orderlines
	})

	await prisma.basket.deleteMany({
		where: {
			warehouse: 0,
			clientId: user.id
		}
	})

	await prisma.client.update({
		data: {
			name: body.clientName
		},
		where: {
			id: user.id
		}
	})

	return new Response("", {
		status: 200,
	});
}