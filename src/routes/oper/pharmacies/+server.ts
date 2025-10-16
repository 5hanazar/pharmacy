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

	const pharmacies = await prisma.pharmacy.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		where,
		orderBy
	});
	const count = await prisma.pharmacy.count({
		where
	})

	const data: PharmacyDto[] = pharmacies.map((e) => {
		return {
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
		};
	});

	const result: Paged<PharmacyDto> = {
		count, data, size, pageIndex
	}
	return json(result);
}

export async function POST({ request }) {
	const input = Object.fromEntries(await request.formData());
	const body: PostPharmacyDto = await JSON.parse(input.data);

	if (body.id == 0) {
		const timestamp = getTimestampGMT()
		body.id = (
			await prisma.pharmacy.create({
				data: {
					active: body.active,
					name: body.name,
					phone: body.phone,
					phonesJ: JSON.stringify(body.phones),
					address: body.address,
					description: body.description,
					password: body.password,
					createdGmt: timestamp,
					modifiedGmt: timestamp,
				},
			})
		).id;
	} else
		await prisma.pharmacy.update({
			data: {
				active: body.active,
				name: body.name,
				phone: body.phone,
				phonesJ: JSON.stringify(body.phones),
				address: body.address,
				description: body.description,
				password: body.password,
				modifiedGmt: getTimestampGMT()
			},
			where: {
				id: body.id,
			},
		});
	return new Response(body.id.toString(), {
		status: 200,
	});
}
