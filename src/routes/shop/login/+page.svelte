<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";

	let phone = "";
	let password = "";

	const onSubmit = async () => {
		const response = await fetch(`${base}/shop/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: document.cookie,
			},
			body: JSON.stringify({ phone: phone, password: password }),
		});
		if (response.ok) await goto(`${base}/shop`, { replaceState: true });
		else if (response.status == 401) {
			password = ""
		}
	};
</script>

<form on:submit|preventDefault={onSubmit}>
	<input bind:value={phone} required />
	<input bind:value={password} required />
	<button type="submit">Login</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 4rem auto;
		width: 200px;
	}
	input {
		padding: 6px;
		border: 2px solid #ddd;
		resize: vertical;
		outline: none;
		font-family: inherit;
	}
	input:focus {
		border-color: var(--mainColor);
	}
</style>
