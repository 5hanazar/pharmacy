import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getTimestampGMT = () => {
	return Math.round(Date.now() / 1000);
};
async function main() {
	const now = getTimestampGMT();
	const user = await prisma.member.create({
		data: {
			active: true,
			username: "admin",
			password: "123",
			name: "Administrator",
			description: "",
			createdGmt: now,
			onlineGmt: now
		},
	});
	await prisma.client.create({
		data: {
			active: true,
			username: "sha",
			phone: "+99362010203",
			name: "Shanazar",
			description: "",
			address: "magtymguly",
			devicesJ: "[\"tel1\", \"comp1\"]",
			hashJwt: "12345678",
			createdGmt: now,
			modifiedGmt: now,
			imageGmt: 0,
			onlineGmt: now
		}
	})
	await prisma.pharmacy.create({
		data: {
			active: true,
			name: "aptek",
			phone: "+99362010203",
			phonesJ: "[\"+99362010203\"]",
			address: "magtymguly",
			description: "this is pharma",
			password: "123",
			createdGmt: now,
			modifiedGmt: now,
		}
	})
	console.log(`A new member was inserted.\nName: ${user.username}\nPassword: ${user.password}`);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});