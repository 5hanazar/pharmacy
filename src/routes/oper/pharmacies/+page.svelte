<script lang="ts">
	export let data;
	import { DataTable, OverflowMenu, OverflowMenuItem, Pagination, Toolbar, ToolbarContent, ToolbarSearch, Checkbox, Button, DataTableSkeleton } from "carbon-components-svelte";
	import Search from "carbon-icons-svelte/lib/Search.svelte";
	import Add from "carbon-icons-svelte/lib/Add.svelte";
	import { page } from "$app/stores";
	import { goto, invalidateAll } from "$app/navigation";
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	const destroy = async (id: number) => {
		const response = await fetch(`${base}/oper/pharmacies/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		if (response.ok) {
			await invalidateAll();
		} else alert("Error " + response.status);
	};
	const _ab0 = (a: any, b: any) => 0;
	const headers = [
		{ key: "id", value: "Id", sort: _ab0 },
		{ key: "active", value: "Актив", sort: _ab0 },
		{ key: "name", value: "Имя", sort: _ab0 },
		{ key: "phone", value: "Телефон", sort: _ab0 },
		{ key: "address", value: "Адрес", sort: _ab0 },
		{ key: "description", value: "Описание", sort: _ab0 },
		{ key: "password", value: "Пароль", sort: _ab0 },
		{ key: "createdDate", value: "Дата создания", sort: false },
		{ key: "modifiedDate", value: "Дата изменения", sort: false },
		{ key: "overflow", empty: true },
	];
	let loading = false;
	let searchValue = $page.url.searchParams.get("q") || "";
	let sortKey: string | null = null;
	let sortDirection = "none";
	const getO = $page.url.searchParams.get("o");
	if (getO != null) {
		sortKey = getO.split(";")[0];
		sortDirection = getO.split(";")[1];
	}
	const move = async () => {
		loading = true;
		let arr = [];
		if (searchValue != "") arr.push(`q=${searchValue}`);
		if (sortKey != undefined) arr.push(`o=${sortKey};${sortDirection}`);
		if (data.pageIndex != 1) arr.push(`p=${data.pageIndex}`);
		if (browser) await goto(`${base}/oper/pharmacies?${arr.join("&")}`, { replaceState: true });
		loading = false;
	};
	$: sortKey, sortDirection, move();
</script>

{#if loading}
	<DataTableSkeleton {headers} showHeader={false} rows={data.count} />
{:else}
	<DataTable {headers} bind:sortKey bind:sortDirection rows={data.data} sortable>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key == "overflow"}
				<OverflowMenu flipped>
					<OverflowMenuItem href={`${base}/oper/pharmacies/${row.id}`} text="Изменить" />
					<OverflowMenuItem danger text="Удалить" on:click={() => destroy(row.id)} />
				</OverflowMenu>
			{:else if cell.key == "active"}
				<Checkbox checked={cell.value == 1} disabled />
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch persistent bind:value={searchValue} />
				<Button icon={Search} iconDescription="Поиск" on:click={() => move()} />
				<Button icon={Add} kind="ghost" href={`${base}/oper/pharmacies/new`}>Создать</Button>
			</ToolbarContent>
		</Toolbar>
	</DataTable>
	<Pagination pageSizeInputDisabled totalItems={data.count} bind:page={data.pageIndex} on:update={() => move()} pageSize={data.size} />
{/if}