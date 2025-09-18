/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT, type Paged, type PostProductDto, type ProductDto, filePath, convertProduct } from "$lib/server";
import type { Member } from "@prisma/client";
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
					barcode: {
						contains: query
					}
				},
				{
					namesJ: {
						contains: query
					}
				},
				{
					descriptionsJ: {
						contains: query
					}
				},
				{
					keywords: {
						contains: query
					}
				}
			]
		}
	}

	let orderBy: any = {}
	orderBy[ordQ[0]] = ordQ[1]

	const products = await prisma.product.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		where,
		orderBy
	});
	const count = await prisma.product.count({
		where
	})
	const data: ProductDto[] = await Promise.all(products.map(async (e) => {
		return await convertProduct(e)
	}));

	const result: Paged<ProductDto> = {
		count, data, size, pageIndex
	}
	return json(result);
}

import fs from "fs";
export async function POST({ request, locals }) {
	const user: Member = locals.user;

	const input = Object.fromEntries(await request.formData());
	const body: PostProductDto = await JSON.parse(input.data);

	if (body.id == 0) {
		body.id = (await prisma.product.create({
			data: {
				active: body.active,
				barcode: body.barcode,
				namesJ: JSON.stringify(body.names),
				descriptionsJ: JSON.stringify(body.descriptions),
				keywords: body.keywords,
				price: 0,
				sortIndex: body.sortIndex,
				imagesJ: "[]",
				createdGmt: getTimestampGMT(),
				modifiedGmt: getTimestampGMT()
			},
		})).id;
	}
	else {
		await prisma.product.update({
			data: {
				active: body.active,
				barcode: body.barcode,
				namesJ: JSON.stringify(body.names),
				descriptionsJ: JSON.stringify(body.descriptions),
				keywords: body.keywords,
				sortIndex: body.sortIndex,
				modifiedGmt: getTimestampGMT()
			},
			where: {
				id: body.id,
			},
		});
	}

	if (parseInt(input.newImg.toString()) == 1) {
		let fls: string[] = [];
		for await (const key of Object.keys(input)) {
			if (key.startsWith("image")) {
				const f = input[key] as File;
				const buffer = await f.arrayBuffer();
				const _nm = `product${body.id}_${parseInt(key.substring(5))}`;
				const nm = `${_nm}.${f.name.split(".").pop()}`;
				fs.writeFileSync(`${filePath}/${nm}`, new DataView(buffer));
				fls.push(nm);
			}
		}
		await prisma.product.update({
			data: {
				imagesJ: JSON.stringify(fls),
			},
			where: {
				id: body.id,
			},
		});
	}

	return new Response(body.id.toString(), {
		status: 200,
	});
}