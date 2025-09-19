/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT } from "$lib/server";

export async function POST({ request }) {
	const text = await request.text();

	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

	const items: { code: string; name: string }[] = [];
	for (let i = 0; i < lines.length; i=i+2) {
		items.push({ code: lines[i], name: lines[i+1] });
	}

	await prisma.category.createMany({
		data: items.map((item) => ({
			active: true,
			code: item.code,
			namesJ: JSON.stringify(["", item.name, ""]),
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