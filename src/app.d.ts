// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	interface CategoryDtoView {
		id: number;
		code: string;
		name: string;
		description: string;
	};
}

export {};
