<script lang="ts">
	import { Form, TextInput, Button, Tile, PasswordInput } from "carbon-components-svelte";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		const response = await fetch(`${base}/oper/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({username, password}),
		})
		if (response.ok) await goto(`${base}/oper`, { replaceState: true });
		else if (response.status == 401) {
			status = "Invalid credentials"
			username = ""
			password = ""
		}
	}
	let status = " ";
	let username = "";
	let password = "";
</script>

<Tile style="width: 300px; margin: 2rem auto">
	<Form on:submit={submit}>
		<TextInput style="margin-bottom: 1rem" labelText="User" bind:value={username} required />
		<PasswordInput style="margin-bottom: 1rem" labelText="Password" bind:value={password} required />
		<Button type="submit">Login</Button>
	</Form>
</Tile>
<h4>{status}</h4>

<style>
	h4 {
		text-align: center;
	}
</style>