<script lang="ts">
	export let product: any;
</script>

<div class="card border-0">
	<a href={`/products/${product.id}`}><img src={product.images.length == 0 ? `/no_image.webp` : `/images/${product.images[0]}`} class="card-img-top p-3" alt="" on:error={(e) => e.target.src = "/no_image.webp"} /></a>
	<div class="card-body pt-0">
		<h5 class="card-title m-0 lh-1">
			{#if product.name.length > 50}
				{product.name.substring(0, 50)}...<br />
			{:else}
				{product.name.substring()}<br />
			{/if}
		</h5>
		<button type="button" class="btn btn-primary">Primary</button>
	</div>
</div>

<style lang="scss">
	.card img {
		aspect-ratio: 1/1;
		transition: scale 0.1s linear;
	}
	.card {
		//border-color: #C62828;
		//color: #C62828;
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