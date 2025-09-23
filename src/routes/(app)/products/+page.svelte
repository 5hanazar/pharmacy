<script lang="ts">
	import Pager from '$lib/Pager.svelte';
	import ProductCard from '$lib/ProductCard.svelte';
	export let data: Paged<ProductDtoView>;
</script>

<section class="container">
	<h3>{data.groupCode}</h3>
	{#each data.data as product}
		{#key product.id}
			<ProductCard product={product} />
		{/key}
	{/each}
	<Pager result={data} link="/products" />
</section>

<style lang="scss">
	h3 {
		display: inline-block;
		grid-column: 1/-1;
		margin-bottom: 0;
		text-align: center;
	}
</style>