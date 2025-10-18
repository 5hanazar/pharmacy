/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT } from "$lib/server";

export async function POST({ request }) {
	const text = await request.text();

	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

	let currentGroup = "";
	const items: { ruName: string; tmName: string; price: number; group: string }[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.startsWith("group:")) {
			currentGroup = line.replace("group:", "").trim();
			continue;
		}

		const ruName = line;
		const tmName = lines[i + 1] ?? "";
		const priceLine = lines[i + 2] ?? "";
		const price = parseFloat(priceLine);

		if (ruName && tmName && !isNaN(price)) {
			items.push({ ruName, tmName, price, group: currentGroup });
			i += 2;
		}
	}

	await prisma.product.createMany({
		data: items.map((item, i) => ({
			active: true,
			barcode: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
			namesJ: JSON.stringify(["", item.ruName, item.tmName]),
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