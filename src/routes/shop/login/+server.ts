/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '$env/static/private'

export async function POST({ request }) {
	const user = await request.json();
	const buf = await prisma.pharmacy.findUnique({
		where: {
			active: true,
			phone: user.phone,
			password: user.password
		}
	})
	if (buf == null) return new Response(null, { status: 401 });
	const token = jwt.sign(JSON.stringify(user), PRIVATE_KEY)
	return new Response(`pharmacy_shop_user=${token}`, {
		headers: {
			'Set-Cookie': `pharmacy_shop_user=${token};path=/;SameSite=None;Secure;expires=${getExpireDate()}`
		},
		status: 200
	});
}
const getExpireDate = () => {
	const expireDate = new Date();
	expireDate.setUTCHours(0, 0, 0);
	expireDate.setUTCFullYear(expireDate.getUTCFullYear() + 1, 0, 1);
	return expireDate.toUTCString();
};