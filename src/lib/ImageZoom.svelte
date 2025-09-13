<script lang="ts">
	import { onMount } from "svelte";
	import panzoom from "panzoom";
	export let src: string;
	export let alt: string = "";
	let imgEl: HTMLImageElement;

	const getMinZoom = (img: HTMLImageElement) => {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const iw = img.naturalWidth;
		const ih = img.naturalHeight;
		if (vw < vh) {
			return vw / iw; // fit to width
		} else {
			return vh / ih; // fit to height
		}
	}

	onMount(() => {
		const minZoom = getMinZoom(imgEl);
		const instance = panzoom(imgEl, { maxZoom: Math.max(2, minZoom * 3), minZoom: minZoom, initialZoom: minZoom, autocenter: true });
		return () => instance.dispose();
	});
</script>

<div>
	<img bind:this={imgEl} {src} {alt} draggable="false" />
</div>

<style>
	div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #00000080;
		z-index: 10;
	}
</style>
