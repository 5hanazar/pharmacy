/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT } from "$lib/server";

export async function POST({ request }) {
	const text = await request.text();

	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

	const items: { name: string; address: string; phone: string; }[] = [];
	for (let i = 0; i < lines.length; i=i+3) {
		items.push({ name: lines[i], address: lines[i+1], phone: lines[i+2].replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '').substring(0, 12) });
	}

	const timestamp = getTimestampGMT()
	await prisma.pharmacy.createMany({
		data: items.map((e) => ({
			active: true,
			name: e.name,
			phone: e.phone,
			phonesJ: JSON.stringify([e.phone]),
			address: e.address,
			description: "",
			password: "123",
			createdGmt: timestamp,
			modifiedGmt: timestamp,
		})),
	});

	return new Response(null, {
		status: 200,
	});
}