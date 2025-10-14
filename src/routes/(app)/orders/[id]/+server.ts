/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";

export async function DELETE({ locals, params }) {
	const user: ClientDtoView = locals.user;
	await prisma.orderRequest.update({
		data: {
			active: false
		},
		where: {
			id: parseInt(params.id),
			clientId: user.id
		}
	})
	return new Response(null, {
		status: 200,
	});
}