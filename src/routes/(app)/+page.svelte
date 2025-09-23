<script lang="ts">
	import ProductCard from '$lib/ProductCard.svelte';
	export let data: HomeDtoView;

	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import { Navigation } from 'swiper';
	let modules = [Navigation];

	/*let swiperEl: any;
	onMount(() => {
		swiperEl.breakpoints = {
			0: { slidesPerView: 2 },
			992: { slidesPerView: 4 },
		};
	});*/
</script>

<div class="container pb-4">
{#each data.list as row}
	<h3 class="display-5 mt-5 mb-3">{row.title}</h3>
	<Swiper
		modules={modules}
		spaceBetween={10}
		slidesPerView={4}
		navigation={true}
		breakpoints={{
			0: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 4,
			},
		}}
	>
		{#each row.products as product}
			{#key product.id}
			<SwiperSlide>
				<ProductCard product={product} />
			</SwiperSlide>
			{/key}
		{/each}
	</Swiper>
{/each}
</div>

<style lang="scss">
	h3 {
		text-align: center;
		&:first-child {
			margin-top: 1.5rem !important;
		}
	}
</style>