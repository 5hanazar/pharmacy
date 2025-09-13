<script>
	import { base } from "$app/paths";
	import {
		Header,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent,
		Content,
	} from "carbon-components-svelte";

	let isSideNavOpen = false;
</script>

<svelte:head>
	<link rel="stylesheet" href={`${base}/g10.css`} />
</svelte:head>

<Header company="Pharmacy" platformName="Oper" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink text="Главная" href={`${base}/oper`} />
		<SideNavLink text="Клиенты" href={`${base}/oper/clients`} />
		<SideNavLink text="Товары" href={`${base}/oper/products`} />
		<SideNavLink text="Категории" href={`${base}/oper/categories`} />
		<SideNavLink text="Файлы" href={`${base}/oper/files`} />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>

<style>
	:global(.bx--form > .bx--form-item) {
		margin-bottom: 1rem !important;
	}
</style>