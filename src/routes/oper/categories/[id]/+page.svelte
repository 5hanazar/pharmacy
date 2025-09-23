<script lang="ts">
	import { Form, TextInput, Button, Tile, Checkbox, TextArea } from "carbon-components-svelte";
	import { afterNavigate, goto } from "$app/navigation";
	export let data: CategoryDto;
	if (!Object.keys(data).length)
		data = {
			id: 0,
			active: true,
			code: "",
			names: [],
			descriptions: [],
			parentCode: "",
			createdDate: "",
			modifiedDate: ""
		};
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		const body: PostCategoryDto = {
			id: data.id,
			active: data.active,
			code: data.code,
			names: data.names,
			descriptions: data.descriptions,
			parentCode: data.parentCode
		};

        const formData = new FormData();
		formData.append("data", JSON.stringify(body));
		const response = await fetch("/oper/categories", {
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
	let previousPage: string = "/oper/categories";
	afterNavigate((navigaton) => {
		previousPage += navigaton.from?.url.search || "";
	});
</script>

<Tile>
	<Form on:submit={submit}>
		<TextInput labelText="Код" bind:value={data.code} inline={true} required />
		<TextInput labelText="Название (English)" bind:value={data.names[0]} inline={true} required />
		<TextInput labelText="Название (Русский)" bind:value={data.names[1]} inline={true} required />
		<TextInput labelText="Название (Türkmençe)" bind:value={data.names[2]} inline={true} required />
		<TextArea labelText="Описание (English)" bind:value={data.descriptions[0]} maxCount={590} />
		<TextArea labelText="Описание (Русский)" bind:value={data.descriptions[1]} maxCount={590} />
		<TextArea labelText="Описание (Türkmençe)" bind:value={data.descriptions[2]} maxCount={590} />
		<TextInput labelText="Код родительской группы:" bind:value={data.parentCode} inline={true} />
		<Checkbox bind:checked={data.active} labelText="Active" />
		<Button type="submit">Submit</Button>
	</Form>
</Tile>
