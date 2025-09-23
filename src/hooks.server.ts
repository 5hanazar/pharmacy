import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import prisma, { getTimestampGMT } from "$lib/server";
import { PRIVATE_KEY } from "$env/static/private";
import type { Client } from "@prisma/client";
import { base } from "$app/paths";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const p = event.url.pathname;
	const myCookie = cookie.parse(event.request.headers.get("cookie") || "");
	if (p.startsWith(`${base}/oper`)) {
		const user: { username: string; password: string; } | null = await decrypt(myCookie.pharmacy_oper_user);
		if (p.startsWith(`${base}/oper/login`)) {
			if (user != null) {
				const buf = await prisma.member.findFirst({
					where: {
						username: user.username,
						password: user.password,
						active: true
					},
				});
				if (buf != null) return new Response("", { status: 303, headers: { Location: `${base}/oper` } });
			}
		} else {
			if (user == null) return new Response("", { status: 303, headers: { Location: `${base}/oper/login` } });
			const buf = await prisma.member.findFirst({
				where: {
					username: user.username,
					password: user.password,
					active: true
				},
			});
			if (buf == null) return new Response("", { status: 303, headers: { Location: `${base}/oper/login` } });
			else {
				await prisma.member.update({
					data: {
						onlineGmt: getTimestampGMT(),
					},
					where: {
						id: buf.id,
					},
				});
				event.locals.user = buf;
			}
		}
	} else if (!p.startsWith(`${base}/images`) && !p.startsWith(`${base}/uploads`)) {
		let user: { id: number; phone: string; hashJwt: string } | null = await decrypt(myCookie.pharmacy_user);
		let createUser = false;
		let buf = null;
		if (user == null) createUser = true;
		else {
			buf = await prisma.client.findFirst({
				where: {
					id: user.id,
					phone: user.phone,
					hashJwt: user.hashJwt,
					active: true,
				},
			});
			if (buf == null) createUser = true;
		}

		if (createUser) {
			const uq = `user${Math.floor(100000 + Math.random() * 900000)}`;
			const timestamp = getTimestampGMT();
			buf = await prisma.client.create({
				data: {
					active: true,
					username: uq,
					phone: uq,
					name: "",
					description: "",
					address: "",
					devicesJ: JSON.stringify([event.request.headers.get("User-Agent")?.toString().slice(0, 60) ?? ""]),
					hashJwt: Math.random().toString(36).slice(2, 10),
					createdGmt: timestamp,
					modifiedGmt: timestamp,
					imageGmt: timestamp,
					onlineGmt: 0,
				},
			});
		}

		user = {
			id: buf!.id,
			phone: buf!.phone,
			hashJwt: buf!.hashJwt,
		};

		const timestamp = getTimestampGMT();
		await prisma.client.update({
			data: {
				onlineGmt: timestamp,
			},
			where: {
				id: user!.id,
			},
		});

		event.locals.user = parseClient(buf!);
		event.locals.lang = parseInt(myCookie.l || '1') - 1
		const token = jwt.sign(JSON.stringify(user), PRIVATE_KEY);
		const response = await resolve(event);
		if (createUser) response.headers.append(
			"Set-Cookie",
			`pharmacy_user=${token};path=/;SameSite=None;Secure`
		);
		return response;
	}
	const response = await resolve(event);
	return response;
}
const decrypt = (token: any, drop = false) =>
	new Promise<any>(async (resolve, reject) => {
		if (token == undefined) {
			if (drop) reject(401);
			else resolve(null);
		} else {
			jwt.verify(token, PRIVATE_KEY, (err: any, v: any) => {
				if (err) {
					if (drop) reject(401);
					else resolve(null);
				} else resolve(v);
			});
		}
	});
const parseClient = (e: Client): ClientDtoView => {
	return {
		id: e.id,
		username: e.username,
		phone: e.phone,
		name: e.name,
		description: e.description,
		address: e.address,
		imageGmt: e.imageGmt
	}
};