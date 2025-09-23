<script lang="ts">
	import ProductCard from '$lib/ProductCard.svelte';

	export let data: HomeDtoView;

	import { register } from 'swiper/element/bundle';
	register();
</script>

<div class="container">
{#each data.list as row}
	<h3 class="display-5">{row.title}</h3>
	<swiper-container slides-per-view="4" breakpoints={{0: {slidesPerView: 2}, 992: {slidesPerView: 4}}} navigation="true" loop="true" space-between={'10'}>
		{#each row.products as product}
			{#key product.id}
			<swiper-slide>
				<ProductCard product={product} />
			</swiper-slide>
			{/key}
		{/each}
	</swiper-container>
{/each}
</div>

<style>
</style>