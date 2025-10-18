<script lang="ts">
	import { base } from "$app/paths";
	export let data;
	import { Button } from "carbon-components-svelte";
	let loading = false;
	const action = async (type: number) => {
		loading = true;
		const response = await fetch(`${base}/oper`, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
			body: JSON.stringify({
				type,
			}),
		});
		if (!response.ok) {
			alert("Error: " + response.status);
		}
		loading = false;
	};
</script>

<h3>Вы вошли как <u>{data.user.username}</u></h3>
<Button kind="secondary" disabled={loading} on:click={() => action(0)}>Очистить клиенты</Button>

<style>
	h3 {
		margin-bottom: 1rem;
	}
</style>