/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT } from "$lib/server";

export async function POST({ request }) {
	const text = await request.text();

	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

	let currentGroup = "";
	const items: { name: string; price: number; group: string }[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.startsWith("group:")) {
			currentGroup = line.replace("group:", "").trim();
			continue;
		}
		const name = line;
		const priceLine = lines[i + 1] ?? "";
		const price = parseFloat(priceLine);
		if (name && !isNaN(price)) {
			items.push({ name, price, group: currentGroup });
			i++;
		}
	}

	await prisma.product.createMany({
		data: items.map((item, i) => ({
			active: true,
			barcode: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
			namesJ: JSON.stringify(["", item.name, ""]),
			descriptionsJ: JSON.stringify(["", "", ""]),
			keywords: item.group,
			price: Math.round(item.price * 0.24),
			sortIndex: 0,
			imagesJ: `["product${i+1}_0.png"]`,
			createdGmt: getTimestampGMT(),
			modifiedGmt: getTimestampGMT(),
		})),
	});

	return new Response(null, {
		status: 200,
	});
}