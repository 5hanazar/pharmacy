<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { base } from "$app/paths";
	import { formatTime } from "$lib";
	import { DataTable, OverflowMenu, OverflowMenuItem, Toolbar, ToolbarContent, FileUploaderButton, Pagination } from "carbon-components-svelte";
	export let data;
	const destroy = async (id: string) => {
		loading = true;
		const response = await fetch(`${base}/oper/files`, {
			method: "DELETE",
			headers: {
				"Content-Type": "text/plain",
				Accept: "application/json",
			},
			body: id,
		});
		loading = false;
		if (response.ok) {
			await invalidateAll();
		} else alert("Error " + response.status);
	};
	const unzip = async (id: string) => {
		loading = true;
		const response = await fetch(`${base}/oper/files`, {
			method: "PUT",
			headers: {
				"Content-Type": "text/plain",
				Accept: "application/json",
			},
			body: id,
		});
		loading = false;
		if (response.ok) {
			await invalidateAll();
		} else alert("Error " + response.status);
	};
	const headers = [
		{ key: "id", value: "Id" },
		{ key: "time", value: "Time" },
		{ key: "size", value: "Size" },
		{ key: "overflow", empty: true },
	];
	let loading = false;
	let progress = 0;

	const add = async (event: CustomEvent<readonly File[]>) => {
		const myFiles = event.detail;
		if (data.result.find((e) => e.id == myFiles[0].name)) {
			alert("File already exists");
			return;
		}
		loading = true;
		progress = 0;

		const fromData = new FormData();
		fromData.append("myFile", myFiles[0]);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", `${base}/oper/files`);
		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) {
				progress = Math.round((e.loaded / e.total) * 100);
			}
		};
		xhr.onload = async () => {
			loading = false;
			progress = 0;
			if (xhr.status === 200) {
				await invalidateAll();
			} else {
				alert("Could not upload");
			}
		};
		xhr.onerror = () => {
			loading = false;
			progress = 0;
			alert("Could not upload");
		};
		xhr.send(fromData);
	};
</script>

<DataTable {headers} rows={data.result}>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key == "overflow"}
			{#if !row.id.startsWith("c1_")}
				<OverflowMenu flipped>
					{#if row.size != "Folder"}
						<OverflowMenuItem href={`${base}/uploads/${row.id}`} text="Download" />
					{/if}
					{#if row.id.endsWith(".zip")}
						<OverflowMenuItem danger text="Unzip" on:click={() => unzip(row.id)} />
					{/if}
					<OverflowMenuItem danger text="Delete" on:click={() => destroy(row.id)} />
				</OverflowMenu>
			{/if}
		{:else if cell.key == "time"}
			{formatTime(cell.value)}
		{:else if cell.key == "size"}
			{cell.value}
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
	<Toolbar>
		<ToolbarContent>
			{#if !loading}
				<FileUploaderButton disableLabelChanges kind="ghost" labelText="Add file" on:change={add} />
			{:else}
				<div style="width: 200px;">
					<div style="background: #e0e0e0; height: 8px; border-radius: 4px;">
						<div style="background: #0f62fe; height: 8px; border-radius: 4px; width: {progress}%"></div>
					</div>
					<span>{progress}%</span>
				</div>
			{/if}
		</ToolbarContent>
	</Toolbar>
</DataTable>
<Pagination pageSizeInputDisabled totalItems={data.result.length} />
