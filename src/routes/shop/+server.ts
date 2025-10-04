/** @type {import('./$types').RequestHandler} */
import { Pharmacy } from "@prisma/client";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
    const user: Pharmacy = locals.user
	return json(user);
}
