<script lang="ts">
	import { Form, TextInput, Button, Tile, Checkbox, TextArea } from "carbon-components-svelte";
	import type { ClientDto, PostClientDto } from "$lib/server";
	import { afterNavigate, goto } from "$app/navigation";
	import { base } from "$app/paths";
	export let data: ClientDto;
	if (!Object.keys(data).length)
		data = {
			id: 0,
			active: true,
			username: "",
			phone: "",
			name: "",
			description: "",
			address: "",
			devices: [],
			hashJwt: "",
			createdDate: "",
			onlineDate: "",
		};
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		const body: PostClientDto = {
			id: data.id,
			active: data.active,
			username: data.name,
			phone: data.phone,
			name: data.name,
			description: data.description,
			address: data.address,
			hashJwt: data.hashJwt
		};

		const formData = new FormData();
		formData.append("data", JSON.stringify(body));
		const response = await fetch(`${base}/oper/clients`, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
			body: formData,
		});
		if (response.ok) {
			await goto(previousPage, { replaceState: true });
		} else alert("Error " + response.status);
	};
	let previousPage: string = `${base}/oper/clients`;
	afterNavigate((navigaton) => {
		previousPage += navigaton.from?.url.search || "";
	});
</script>

<Tile>
	<Form on:submit={submit}>
		<TextInput labelText="Имя" bind:value={data.username} required />
		<TextInput labelText="Телефон" bind:value={data.phone} required />
		<TextInput labelText="Полное имя" bind:value={data.name} required />
		<TextInput labelText="Адрес" bind:value={data.address} />
		<TextArea labelText="Описание" bind:value={data.description} maxCount={128} />
		<TextInput labelText="Hash JWT" bind:value={data.hashJwt} required />
		<Checkbox bind:checked={data.active} labelText="Актив" />
		<Button type="submit">Submit</Button>
	</Form>
</Tile>
