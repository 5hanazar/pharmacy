<script lang="ts">
	import { base } from '$app/paths';
	import Pager from '$lib/Pager.svelte';
	import ProductCard from '$lib/ProductCard.svelte';
	export let data: Paged<ProductDtoView> & { query: string, groupName: string };
</script>

<section class="container pb-4">
	<h3 class="display-5">{data.groupName}</h3>
	{#each data.data as product}
		{#key product.id}
			<ProductCard product={product} />
		{/key}
	{/each}
	<Pager result={data} link="{base}/products" />
</section>

<style lang="scss">
	h3 {
		display: inline-block;
		grid-column: 1/-1;
		margin-top: 1.5rem;
		margin-bottom: 0;
		text-align: center;
	}
</style>