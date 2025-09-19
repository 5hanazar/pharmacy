<script lang="ts">
	export let result: any //Paged<any> & { query: string };
	export let link: string;
</script>

<div>
	{#each Array(Math.ceil(result.count / result.size)) as _, i}
		<a class:active={result.pageIndex == i + 1} href={`${link}?p=${i + 1}&${result.query}`}>{i + 1}</a>
	{/each}
</div>

<style>
	div {
		display: inline-block;
		grid-column: 1/-1;
		text-align: center;
	}
	a {
		display: inline-block;
		padding: .5rem 0;
		width: 2.5rem;
		text-align: center;
		text-decoration: none;
	}
	a.active {
		background-color: #00796B;
		color: #fff;
	}
	a:not(.active):hover {
		background-color: #eee;
	}
</style>
