/** @type {import('./$types').RequestHandler} */
import prisma, { convertProductView, getTimestampGMT } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
	const user: ClientDtoView = locals.user;
	const lang: number = locals.lang
	const buf = await prisma.basket.findMany({
		include: {
			product: true
		},
		where: {
			clientId: user.id
		},
		orderBy: {
			createdGmt: 'asc'
		}
	})
	let total: number = 0;
	const products: ProductDtoView[] = await Promise.all(
		buf.map(async (e) => {
			total += e.product.price * e.quantity;
			return await convertProductView(e.product, user.id, lang)
		})
	);

	return json({total, products});
}

export async function POST({ request, locals }) {
	const user: ClientDtoView = locals.user;
	const data: PostAdditionDtoView = await request.json();
	const result = await prisma.basket.findUnique({
		where: {
			warehouse_productId_clientId: {
				warehouse: 0,
				productId: data.productId,
				clientId: user.id
			}
		}
	})
	if (result) {
		if (result.quantity + data.addition <= 0) {
			await prisma.basket.delete({
				where: {
					warehouse_productId_clientId: {
						warehouse: 0,
						productId: data.productId,
						clientId: user.id
					}
				}
			})
		} else {
			await prisma.basket.update({
				data: {
					quantity: result.quantity + data.addition
				},
				where: {
					warehouse_productId_clientId: {
						warehouse: 0,
						productId: data.productId,
						clientId: user.id
					}
				}
			})
		}
	} else {
		if (data.addition > 0) {
			await prisma.basket.create({
				data: {
					warehouse: 0,
					productId: data.productId,
					clientId: user.id,
					quantity: data.addition,
					createdGmt: getTimestampGMT()
				}
			})
		}
	}
	const buf = await prisma.basket.findUnique({
		where: {
			warehouse_productId_clientId: {
				warehouse: 0,
				productId: data.productId,
				clientId: user.id
			}
		}
	})
	return new Response(buf?.quantity.toString() ?? "0", {
		status: 200,
	});
}