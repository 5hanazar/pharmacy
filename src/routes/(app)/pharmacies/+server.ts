/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getRelativeTime } from '$lib/server';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const user: ClientDtoView = locals.user;

	const pageIndex = parseInt(url.searchParams.get("p") || "1");
	const size = parseInt(url.searchParams.get("s") || "20");

	const query = url.searchParams.get("q") || "";
	const ordQ = url.searchParams.get('o') ? url.searchParams.get('o')!.split(';') : ['id', 'ascending']
	ordQ[1] = ordQ[1] == 'ascending' ? 'asc' : 'desc'

	let where: any = {
		active: true,
	}
	if (query.length > 0) {
		where['OR'] = [
			{
				name: {
					contains: query
				}
			},
			{
				phonesJ: {
					contains: query
				}
			},
			{
				address: {
					contains: query
				}
			},
		]
	}

	let orderBy: any = {}
	orderBy[ordQ[0]] = ordQ[1]

	const pharmacies = await prisma.pharmacy.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		where,
		orderBy
	});
	const data = pharmacies.map(e => ({
		id: e.id,
		name: e.name,
		phone: e.phone,
		phones: JSON.parse(e.phonesJ),
		address: e.address,
		description: e.description,
		password: e.password,
		createdDate: formatTime(e.createdGmt),
		modifiedDate: getRelativeTime(e.modifiedGmt),
	}))
	const count = await prisma.pharmacy.count({
		where
	});

	let qry = ""
	url.searchParams.forEach((value: any, key: any) => {
		if (key != 'p') qry += `&${key}=${value}`
	});
	if (qry.length > 0) qry.slice(1);

	const result: Paged<PharmacyDtoView> & { query: string } = {
		count,
		data: data,
		size,
		pageIndex,
		query: qry
	};
	return json(result);
}
