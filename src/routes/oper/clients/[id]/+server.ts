/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getRelativeTime } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
	if (params.id == "new") {
		return json({});
	}
	const e = await prisma.client.findFirstOrThrow({
		where: {
			id: parseInt(params.id)
		}
	});
	const result: ClientDto = {
		id: e.id,
		active: e.active,
		username: e.username,
		phone: e.phone,
		name: e.name,
		description: e.description,
		address: e.address,
		devices: JSON.parse(e.devicesJ),
		hashJwt: e.hashJwt,
		createdDate: formatTime(e.createdGmt),
		onlineDate: getRelativeTime(e.onlineGmt),
	}
	return json(result);
}

export async function DELETE({ params }) {
	const body = await prisma.client.findFirstOrThrow({
		where: {
			id: parseInt(params.id)
		}
	});
	if (body.active) {
		return new Response(null, {
			status: 400,
		});
	}
	await prisma.client.delete({
		where: {
			id: parseInt(params.id)
		}
	})
	return new Response(null, {
		status: 200,
	});
}