<script lang="ts">
	import { t } from "$lib/i18n";
	import ProductCard from "$lib/ProductCard.svelte";
	export let data: { result: any[] };

	import { register } from 'swiper/element/bundle';
	register();
</script>

<style>
	.factory {
		border-radius: 2rem;
	}
	@media only screen and (min-width: 1400px) {
		.lead {
			font-size: 1.5rem
		}
	}
</style>