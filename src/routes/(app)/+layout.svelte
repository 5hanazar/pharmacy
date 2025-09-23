<script lang="ts">
	import "$lib/main.scss";
	if (typeof window !== "undefined") {
		// @ts-ignore
		import("bootstrap/js/dist/carousel");
		// @ts-ignore
		import("bootstrap/js/dist/dropdown");
		// @ts-ignore
		import("bootstrap/js/dist/collapse");
	}

	import Preloader from "$lib/Preloader.svelte";
	import { onMount } from "svelte";

	export let data: { categories: CategoryDtoView[] };

	let loaded = false;
	onMount(() => {
		const waitForAssets = new Promise<void>((resolve) => {
			if (document.readyState === "complete") {
				resolve();
			} else {
				window.addEventListener("load", () => resolve());
			}
		});
		const waitForFonts = document.fonts.ready;
		Promise.all([waitForAssets, waitForFonts]).then(() => {
			setTimeout(() => {
				const preloader = document.getElementById('preloader')!;
				const animation = preloader.animate([{ opacity: 1 }, { opacity: 0 }], {
					duration: 200,
					fill: "forwards",
				});
				animation.onfinish = () => {
					loaded = true;
				};
			}, 500);
		});
		const nav = document.getElementById("navbarNavDropdown");
		if (!nav) return;
		nav.addEventListener("click", (e) => {
			const target = e.target as HTMLElement;
			if (target.tagName === "A" && nav.classList.contains("show")) {
				const collapse = document.querySelector(".navbar-collapse") as any;
				if (collapse) {
					if (window.bootstrap && window.bootstrap.Collapse) {
						const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(collapse);
						bsCollapse.hide();
					} else {
						const toggler = document.querySelector(".navbar-toggler") as HTMLElement;
						if (toggler) toggler.click();
					}
				}
			}
		});
	});

	import { browser } from "$app/environment";
	import { t, locale } from '$lib/i18n';
	import { invalidateAll } from "$app/navigation";
	const getCookie = (cname: any) => {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
    const getExpireDate = () => {
		const expireDate = new Date();
		expireDate.setUTCHours(0, 0, 0);
		expireDate.setUTCFullYear(expireDate.getUTCFullYear() + 1, 0, 1);
		return expireDate.toUTCString();
	};
	if (browser) {
		const l = getCookie("l");
		if (l == "1") locale.set("en");
		else if (l == "2") locale.set("ru");
		else if (l == "3") locale.set("tk");
		locale.subscribe(async (v) => {
			let l = "";
			if (v == "en") l = "1";
			else if (v == "ru") l = "2";
			else if (v == "tk") l = "3";
			document.cookie = `l=${l};path=/;SameSite=None;Secure;expires=${getExpireDate()}`;
			await invalidateAll();
		});
	}
	const setLang = (lang: any) => {
		locale.set(lang)
	}
</script>

<svelte:head>
	<meta name="description" content="Pharmacy - find your cure." />
	<title>Pharmacy | find your cure.</title>
</svelte:head>

{#if !loaded}
	<Preloader />
{/if}
<main class="flex-fill">
	<div class="sticky-top bg-primary z-2 shadow">
		<header class="navbar navbar-expand-lg" data-bs-theme="dark">
			<div class="container">
				<a href="/" class="navbar-brand d-flex gap-3 text-decoration-none align-items-center text-white">
					Pharmacy
				</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarNavDropdown">
					<ul class="navbar-nav ms-auto">
						<li class="nav-item dropdown">
							<button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
								{$t("language")}
							</button>
							<ul class="dropdown-menu">
								<li><button class="dropdown-item" on:click={() => setLang('en')}>English</button></li>
								<li><button class="dropdown-item" on:click={() => setLang('ru')}>Русский</button></li>
							</ul>
						</li>
						<li class="nav-item dropdown">
							<button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
								{$t("categories")}
							</button>
							<ul class="dropdown-menu">
								<li><a class="dropdown-item" href="/products">{$t("all_products")}</a></li>
								{#each data.categories as category}
									<li><a class="dropdown-item" href="/products?g={category.code}">{category.name}</a></li>
								{/each}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</header>
	</div>
	<slot />
</main>

<style lang="scss">
	:global(html) {
		height: 100%;
		scroll-behavior: auto !important;
	}
	:global(body) {
		height: 100%;
		margin: 0;
	}
</style>