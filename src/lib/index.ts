import { base } from "$app/paths";

export const getFileFromUrl = async (name: string, url: string) => {
	try {
		const response = await fetch(`${base}/images` + url);
		const data = await response.blob();
		return new File([data], name, {
			type: data.type,
		});
	} catch (e) {
		console.log(e);
	}
};
export const readURL = (file: File) => {
	return new Promise<string>((res, rej) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const t = e.target;
			if (t == null || t.result == null) rej(e);
			else res(t.result.toString() || "");
		};
		reader.onerror = (e) => rej(e);
		reader.readAsDataURL(file);
	});
};
export const formToObj = (e: any) => {
	const data = Object.fromEntries(new FormData(e.target).entries());
	return data
}
export const clearForm = (e: any) => {
	Array.from(e.target.elements).forEach((input: any) => {
		if (input.tagName == 'INPUT') input.value = ""
	});
}
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