<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';
	import ImageZoom from '$lib/ImageZoom.svelte';
	import ProductCard from '$lib/ProductCard.svelte';
	export let data;
	let showZoom = false;
	afterNavigate(() => {
		showZoom = false;
	});
</script>

<div class="container pb-4">
	{#key data.product.id}
	<div class="d-flex flex-lg-row flex-column align-items-center my-5">
		<div class="col-lg-6">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img src={data.product.images.length == 0 ? `${base}/no_image.webp` : `${base}/images/${data.product.images[0]}`} class="d-block mx-lg-auto img-fluid" draggable="false" alt={data.product.name} on:error={(e) => e.target.src = `${base}/no_image.webp`} on:click={() => showZoom = true} />
		</div>
		<div class="col-lg-6 pt-4 pt-lg-0 ps-lg-4">
			<h1 class="display-5">{data.product.name}</h1>
			<p class="lead m-0 description">{data.product.price}</p>
		</div>
	</div>
	<section>
		<h3>{$t("similar")}</h3>
		{#each data.similar as product}
			<ProductCard product={product} />
		{/each}
	</section>
	{#if showZoom}
		<ImageZoom src={data.product.images.length == 0 ? `${base}/no_image.webp` : `${base}/images/${data.product.images[0]}`} alt="" />
		<button class="zoom-close" on:click={() => showZoom = false} type="button" aria-label="Закрыть">&times;</button>
	{/if}
	{/key}
</div>

<style>
	section > h3 {
		display: inline-block;
		grid-column: 1/-1;
		margin-bottom: 0;
	}
	.description {
		white-space: break-spaces;
	}
	.zoom-close {
		position: fixed;
		top: 24px;
		right: 32px;
		z-index: 11;
		background: #ffffffdd;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		font-family: none;
		font-size: 2rem;
		cursor: pointer;
		box-shadow: 0 2px 8px #0003;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>