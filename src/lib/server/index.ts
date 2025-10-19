// place files you want to import through the `$lib` alias in this folder.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;

export const filePath = "C:/Users/User/Documents/shapro/svkit/pharmacy/static/images"
export const filePathUploads = "C:/Users/User/Documents/shapro/svkit/pharmacy/static/uploads"
//export const filePath = "/var/www/html/shypa/images"
//export const filePathUploads = "/var/www/html/shypa/uploads"

export const convertProduct = async (e: any): Promise<ProductDto> => {
	return {
		id: e.id,
		active: e.active,
		barcode: e.barcode,
		names: JSON.parse(e.namesJ),
		descriptions: JSON.parse(e.descriptionsJ),
		keywords: e.keywords,
		price: e.price,
		sortIndex: e.sortIndex,
		images: JSON.parse(e.imagesJ),
		createdDate: formatTime(e.createdGmt),
		modifiedDate: getRelativeTime(e.modifiedGmt),
	};
};
export const convertCategory = (e: any): CategoryDto => {
	return {
		id: e.id,
		active: e.active,
		code: e.code,
		names: JSON.parse(e.namesJ),
		descriptions: JSON.parse(e.descriptionsJ),
		parentCode: e.parentCode,
		createdDate: formatTime(e.createdGmt),
		modifiedDate: getRelativeTime(e.modifiedGmt),
	};
};
export const convertProductView = async (e: any, userId: number, lang: number): Promise<ProductDtoView> => {
	const basket = await prisma.basket.findUnique({
		where: {
			warehouse_productId_clientId: {
				warehouse: 0,
				productId: e.id,
				clientId: userId
			}
		}
	});
	const categories = await prisma.category.findMany({
		where: {
			active: true
		}
	});
	return {
		id: e.id,
		barcode: e.barcode,
		name: JSON.parse(e.namesJ)[lang],
		description: JSON.parse(e.descriptionsJ)[lang],
		groupName: JSON.parse(categories.find(o => o.code == e.keywords)?.namesJ ?? "")[lang],
		price: e.price,
		inBasket: basket?.quantity ?? 0,
		isFavorite: false,
		images: JSON.parse(e.imagesJ),
	};
};

export const getTimestampGMT = () => {
	return Math.round(Date.now() / 1000);
};
export const getRelativeTime = (timestamp: number): string => {
	const timeDifferenceInSeconds = Math.floor(getTimestampGMT() - timestamp);
	const intervals = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
	};
	for (const interval in intervals) {
		const numberOfUnits = Math.floor(timeDifferenceInSeconds / intervals[interval]);
		if (numberOfUnits >= 1) {
			return `${numberOfUnits} ${interval}${numberOfUnits > 1 ? "s" : ""} ago`;
		}
	}
	return "just now";
};
export const formatTime = (timestampGMT: number): string => {
    //returns date in UTC+5
	const today = new Date((timestampGMT + 18000) * 1000);
	const yyyy = today.getUTCFullYear();
	const mm = today.getUTCMonth() + 1;
	const dd = today.getUTCDate();
	const hh = today.getUTCHours();
	const m = today.getUTCMinutes();

	let smm = mm.toString();
	let sdd = dd.toString();
	let shh = hh.toString();
	let sm = m.toString();

	if (mm < 10) smm = "0" + mm;
	if (dd < 10) sdd = "0" + dd;
	if (hh < 10) shh = "0" + hh;
	if (m < 10) sm = "0" + m;
	return sdd + "." + smm + "." + yyyy + " " + shh + ":" + sm + " (UTC+5)";
};