/** @type {import('./$types').PageServerLoad} */
import prisma from "$lib/server/index.js";

export async function load({ locals }) {
	const lang: number = locals.lang
	const buf = await prisma.category.findMany({
		where: {
			active: true,
			parentCode: "",
		},
	});
	const categories: CategoryDtoView[] = buf.map((e) => {
		return {
			id: e.id,
			code: e.code,
			name: JSON.parse(e.namesJ)[lang],
			description: JSON.parse(e.descriptionsJ)[lang],
		};
	});
	return { categories };
}
