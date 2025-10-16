/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getRelativeTime } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
	if (params.id == "new") {
		return json({});
	}
	const e = await prisma.pharmacy.findFirstOrThrow({
		where: {
			id: parseInt(params.id)
		}
	});
	const result: PharmacyDto = {
		id: e.id,
		active: e.active,
		name: e.name,
		phone: e.phone,
		phones: JSON.parse(e.phonesJ),
		address: e.address,
		description: e.description,
		password: e.password,
		createdDate: formatTime(e.createdGmt),
		modifiedDate: getRelativeTime(e.modifiedGmt),
	}
	return json(result);
}

export async function DELETE({ params }) {
	const body = await prisma.pharmacy.findFirstOrThrow({
		where: {
			id: parseInt(params.id)
		}
	});
	if (body.active) {
		return new Response(null, {
			status: 400,
		});
	}
	await prisma.pharmacy.delete({
		where: {
			id: parseInt(params.id)
		}
	})
	return new Response(null, {
		status: 200,
	});
}