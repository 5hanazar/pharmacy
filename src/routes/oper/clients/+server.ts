/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getRelativeTime, getTimestampGMT } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
	const pageIndex = parseInt(url.searchParams.get('p') || '1')
	const size = parseInt(url.searchParams.get('s') || '20')
	const query = url.searchParams.get('q') || ''
	const ordQ = !url.searchParams.get('o') ? ['id', 'desc'] : url.searchParams.get('o')!.split(';')
	ordQ[1] = ordQ[1] == 'ascending' ? 'asc' : 'desc'

	let where = undefined
	if (query != '') {
		where = {
			OR: [
				{
					name: {
						contains: query
					}
				},
				{
					phone: {
						contains: query
					}
				}
			]
		}
	}

	let orderBy: any = {}
	orderBy[ordQ[0]] = ordQ[1]

	const clients = await prisma.client.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		where,
		orderBy
	});
	const count = await prisma.client.count({
		where
	})

	const data: ClientDto[] = clients.map((e) => {
		return {
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
		};
	});

	const result: Paged<ClientDto> = {
		count, data, size, pageIndex
	}
	return json(result);
}

export async function POST({ request }) {
	const input = Object.fromEntries(await request.formData());
	const body: PostClientDto = await JSON.parse(input.data);

	if (body.id == 0) {
		const timestamp = getTimestampGMT()
		body.id = (
			await prisma.client.create({
				data: {
					active: body.active,
					username: body.username,
					phone: body.phone,
					name: body.name,
					description: body.description,
					address: body.address,
					devicesJ: JSON.stringify([]),
					hashJwt: body.hashJwt,
					createdGmt: timestamp,
					modifiedGmt: timestamp,
					imageGmt: timestamp,
					onlineGmt: timestamp,
				},
			})
		).id;
	} else
		await prisma.client.update({
			data: {
				active: body.active,
				username: body.username,
				phone: body.phone,
				name: body.name,
				description: body.description,
				address: body.address,
				hashJwt: body.hashJwt
			},
			where: {
				id: body.id,
			},
		});
	return new Response(body.id.toString(), {
		status: 200,
	});
}
