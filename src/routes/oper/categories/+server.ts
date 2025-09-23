/** @type {import('./$types').RequestHandler} */
import prisma, { getTimestampGMT, convertCategory } from "$lib/server";
import type { Member } from "@prisma/client";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
	const pageIndex = parseInt(url.searchParams.get("p") || "1");
	const size = parseInt(url.searchParams.get("s") || "20");
	const query = url.searchParams.get("q") || "";
	const ordQ = !url.searchParams.get("o") ? ["id", "desc"] : url.searchParams.get("o")!.split(";");
	ordQ[1] = ordQ[1] == "ascending" ? "asc" : "desc";

	let where = undefined;
	if (query != "") {
		where = {
			namesJ: {
				contains: query,
			},
		};
	}

	let orderBy: any = {};
	orderBy[ordQ[0]] = ordQ[1];

	const groups = await prisma.category.findMany({
		skip: (pageIndex - 1) * size,
		take: size,
		where,
		orderBy,
	});
	const count = await prisma.category.count({
		where,
	});

	const data: CategoryDto[] = groups.map((e) => {
		return convertCategory(e);
	});

	const result: Paged<CategoryDto> = {
		count,
		data,
		size,
		pageIndex,
	};
	return json(result);
}

export async function POST({ request, locals }) {
	const user: Member = locals.user;

	const input = Object.fromEntries(await request.formData());
	const body: PostCategoryDto = await JSON.parse(input.data);

	if (body.id == 0)
		body.id = (
			await prisma.category.create({
				data: {
					active: body.active,
					code: body.code,
					namesJ: JSON.stringify(body.names),
					descriptionsJ: JSON.stringify(body.descriptions),
					parentCode: body.parentCode,
					createdGmt: getTimestampGMT(),
					modifiedGmt: getTimestampGMT(),
				},
			})
		).id;
	else {
		const categoryOld = await prisma.category.findFirstOrThrow({
			where: {
				id: body.id
			}
		});
		await prisma.category.update({
			data: {
				active: body.active,
				code: body.code,
				namesJ: JSON.stringify(body.names),
				descriptionsJ: JSON.stringify(body.descriptions),
				parentCode: body.parentCode,
				modifiedGmt: getTimestampGMT(),
			},
			where: {
				id: body.id,
			},
		});
		await prisma.$executeRawUnsafe(`update products set keywords = REPLACE(keywords, '${categoryOld.code};', '${body.code};')`);
		await prisma.$executeRawUnsafe(`update categories set parentCode = REPLACE(parentCode, '${categoryOld.code}', '${body.code}')`);
	}
	return new Response(body.id.toString(), {
		status: 200,
	});
}
