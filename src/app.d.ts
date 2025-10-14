// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	type HomeDtoView = {
		categories: CategoryDtoView[];
		list: { code: string; title: string; products: ProductDtoView[] }[];
	};
	type CategoryDtoView = {
		id: number;
		code: string;
		name: string;
		description: string;
	};
	type ProductDtoView = {
		id: number;
		barcode: string;
		name: string;
		description: string;
		groupName: string;
		price: number;
		inBasket: number;
		isFavorite: boolean;
		images: string[];
	};
	type ClientDto = {
		id: number;
		active: boolean;
		username: string;
		phone: string;
		name: string;
		description: string;
		address: string;
		devices: string[];
		hashJwt: string;
		createdDate: string;
		onlineDate: string;
	};
	type PostClientDto = {
		id: number;
		active: boolean;
		username: string;
		phone: string;
		name: string;
		description: string;
		address: string;
		hashJwt: string;
	};
	type ClientDtoView = {
		id: number;
		username: string;
		phone: string;
		name: string;
		description: string;
		address: string;
		imageGmt: number;
	}
	type PostClientDtoView = {
		name: string;
		description: string;
	};
	type FileDto = {
		id: string;
		time: number;
		size: string;
	};
	type Paged<T> = {
		count: number;
		data: T[];
		size: number;
		pageIndex: number;
	};
	type SocketMessageDto = {
		topic: string;
		phone: string;
		text: string;
	};
	type ProductDto = {
		id: number;
		active: boolean;
		barcode: string;
		names: string[];
		descriptions: string[];
		keywords: string;
		price: number;
		sortIndex: number;
		images: string[];
		createdDate: string;
		modifiedDate: string;
	};
	type PostProductDto = {
		id: number;
		active: boolean;
		barcode: string;
		names: string[];
		descriptions: string[];
		keywords: string;
		sortIndex: number;
	};

	type CategoryDto = {
		id: number;
		active: boolean;
		code: string;
		parentCode: string;
		names: string[];
		descriptions: string[];
		createdDate: string;
		modifiedDate: string;
	};
	type PostCategoryDto = {
		id: number;
		active: boolean;
		code: string;
		parentCode: string;
		names: string[];
		descriptions: string[];
	};
	type PostAdditionDtoView = {
		productId: number;
		addition: number;
	};
	type PostOrderRequestDtoView = {
		clientName: string;
		phoneToContact: string;
		address: string;
		description: string;
	};
	type OrderRequestDtoView = {
		phone: string;
		address: string;
		description: string;
		lines: OrderRequestLineDtoView[];
		total: number;
		createdDate: string;
	};
	type OrderRequestLineDtoView = {
		barcode: string;
		name: string;
		description: string;
		price: number;
		quantity: number;
	};
}

export {};
