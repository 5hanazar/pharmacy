<script lang="ts">
	import ProductCard from '$lib/ProductCard.svelte';
	export let data;
</script>

<div class="container bread"><span>Все продукты</span> > <a href="#">{data.groupName}</a></div>
<section class="container products">
	{#each data.result as product}
		{#key product.id}
			<ProductCard product={product} />
		{/key}
	{/each}
</section>

<style lang="scss">
	.bread {
		font-size: 1.5rem;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}
</style>