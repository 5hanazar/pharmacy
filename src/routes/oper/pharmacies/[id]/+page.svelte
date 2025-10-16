<script lang="ts">
	import { Form, TextInput, Button, Tile, Checkbox, TextArea } from "carbon-components-svelte";
	import { afterNavigate, goto } from "$app/navigation";
	import { base } from "$app/paths";
	export let data: PharmacyDto;
	if (!Object.keys(data).length)
		data = {
			id: 0,
			active: true,
			name: "",
			phone: "",
			phones: [],
			address: "",
			description: "",
			password: "",
			createdDate: "",
			modifiedDate: ""
		};
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		const body: PostPharmacyDto = {
			id: data.id,
			active: data.active,
			name: data.name,
			phone: data.phone,
			phones: data.phones,
			address: data.address,
			description: data.description,
			password: data.password
		};

		const formData = new FormData();
		formData.append("data", JSON.stringify(body));
		const response = await fetch(`${base}/oper/pharmacies`, {
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
	let previousPage: string = `${base}/oper/pharmacies`;
	afterNavigate((navigaton) => {
		previousPage += navigaton.from?.url.search || "";
	});
</script>

<Tile>
	<Form on:submit={submit}>
		<TextInput labelText="Имя" bind:value={data.name} required />
		<TextInput labelText="Телефон" bind:value={data.phone} required />
		<TextInput labelText="Адрес" bind:value={data.address} required />
		<TextArea labelText="Описание" bind:value={data.description} maxCount={128} />
		<TextInput labelText="Пароль" bind:value={data.password} required />
		<Checkbox bind:checked={data.active} labelText="Актив" />
		<Button type="submit">Submit</Button>
	</Form>
</Tile>
