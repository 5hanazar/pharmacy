/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";

export async function POST({ request }) {
	const { type }: { type: number } = await request.json();
	if (type == 0) {
		await prisma.$executeRawUnsafe("delete from clients where createdGmt = onlineGmt")
	}
	return new Response(null, {
		status: 200,
	});
}