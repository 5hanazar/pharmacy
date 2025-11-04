/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals, url }) {
	const user: ClientDtoView = locals.user;
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
			clientId: user.id,
		},
		orderBy: {
			createdGmt: 'desc'
		}
	});

	const data = await Promise.all(
		buf.map(async (e) => {
			const responses = await getResponses(lang, e.id);
			let total = 0;
			const lines = e.lines.map<OrderRequestLineDtoView>((r) => {
				total += r.product.price * r.quantity;
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
				total: Math.round(total * 100) / 100,
				createdDate: formatTime(e.createdGmt),
				responses: responses,
			};
		})
	);

	const count = await prisma.orderRequest.count({
		where: {
			active: true,
			clientId: user.id,
		},
	});

	const result: Paged<OrderRequestDtoView> = {
		count,
		data: data,
		size,
		pageIndex,
	};

	return json(result);
}


const getResponses = async (lang: number, requestId: number) => {
	const buf = await prisma.orderResponse.findMany({
		include: {
			pharmacy: true,
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
			orderRequestId: requestId
		},
		orderBy: {
			createdGmt: 'desc'
		}
	});

	const data = buf.map<OrderResponseDtoView>((e) => {
		let total = 0;
		const lines = e.lines.map<OrderResponseLineDtoView>((r) => {
			total += r.price * r.quantity
			return {
				barcode: r.product.barcode,
				name: JSON.parse(r.product.namesJ)[lang],
				description: JSON.parse(r.product.descriptionsJ)[lang],
				price: r.price,
				quantity: r.quantity,
			};
		});
		return {
			id: e.id,
			pharmacyId: e.pharmacyId,
			pharmacyName: e.pharmacy.name,
			pharmacyPhone: e.pharmacy.phone,
			pharmacyAddress: e.pharmacy.address,
			description: e.description,
			lines: lines,
			total: Math.round(total * 100) / 100,
			createdDate: formatTime(e.createdGmt),
		};
	});

	return data;
}
