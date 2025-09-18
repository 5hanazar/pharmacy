<script lang="ts">
	import { t } from "$lib/i18n";
	import ProductCard from "$lib/ProductCard.svelte";
	export let data: { result: any[] };

	import { register } from 'swiper/element/bundle';
	register();
</script>

<style>
</style>