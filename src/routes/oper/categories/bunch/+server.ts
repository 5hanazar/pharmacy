/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT } from "$lib/server";

export async function POST({ request }) {
	const text = await request.text();

	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

	const items: { code: string; ruName: string; tmName: string; }[] = [];
	for (let i = 0; i < lines.length; i=i+3) {
		items.push({ code: lines[i], ruName: lines[i+1], tmName: lines[i+2] });
	}

	await prisma.category.createMany({
		data: items.map((item) => ({
			active: true,
			code: item.code,
			namesJ: JSON.stringify(["", item.ruName, item.tmName]),
			descriptionsJ: JSON.stringify(["", "", ""]),
			parentCode: "",
			createdGmt: getTimestampGMT(),
			modifiedGmt: getTimestampGMT(),
		})),
	});

	return new Response(null, {
		status: 200,
	});
}