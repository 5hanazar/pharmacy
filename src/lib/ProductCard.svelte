<script lang="ts">
	import { t } from "$lib/i18n";
	export let product: ProductDtoView;
		const toBasket = async (addition: number) => {
		const buf: PostAdditionDtoView = { productId: product.id, addition: addition };
		const response = await fetch("/basket", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Cookie": document.cookie
			},
			body: JSON.stringify(buf),
		});
		const res = await response.text();
		product.inBasket = parseFloat(res)
	};
</script>

<div class="card">
	<a href={`/products/${product.id}`}><img src={product.images.length == 0 ? `/no_image.webp` : `/images/${product.images[0]}`} class="card-img-top p-3" alt="" on:error={(e) => e.target.src = "/no_image.webp"} /></a>
	<div class="card-body pt-0">
		<h5 class="card-title mt-0">
			{#if product.name.length > 50}
				{product.name.substring(0, 50)}...<br />
			{:else}
				{product.name}<br />
			{/if}
		</h5>
		<p class="card-text">{product.description}</p>
		<div class="d-flex gap-3">
			<button type="button" class="btn btn-primary" on:click={() => toBasket(1)}>{$t("purchase")}</button>
			{#if product.inBasket > 0}
				{product.inBasket}
				<button type="button" class="btn btn-primary" on:click={() => toBasket(-1)}>-</button>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.card img {
		aspect-ratio: 1/1;
		transition: scale 0.1s linear;
	}
	.card {
		img:hover {
			scale: 1.02;
		}
	}

	@media screen and (width < 992px) {
		img {
			padding: 0.5rem !important;
		}
		.card-body {
			padding: 0.6rem;
		}
		.card-title {
			font-size: 1.1rem;
		}
	}
</style>