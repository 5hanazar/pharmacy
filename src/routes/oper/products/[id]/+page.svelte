<script lang="ts">
	import { Form, TextInput, Button, Tile, Checkbox, NumberInput, TextArea } from "carbon-components-svelte";
	import { getFileFromUrl, readURL } from "$lib";
	import { afterNavigate, goto } from "$app/navigation";
	import { onMount } from "svelte";
	import type { CategoryDto, PostProductDto, ProductDto } from "$lib/server";
	import CategoryModal from "$lib/CategoryModal.svelte";
	export let data: {result: ProductDto, groups: CategoryDto[]};
	if (!Object.keys(data.result).length)
		data.result = {
			id: 0,
			active: true,
			barcode: "",
			names: [],
			descriptions: [],
			keywords: "",
			sortIndex: 0,
			images: [],
			createdDate: "",
			modifiedDate: ""
		};
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		const body: PostProductDto = {
			id: data.result.id,
			active: data.result.active,
			barcode: data.result.barcode,
			names: data.result.names,
			descriptions: data.result.descriptions,
			keywords: data.result.keywords.trim(),
			sortIndex: data.result.sortIndex
		};

		const formData = new FormData();
		formData.append("data", JSON.stringify(body));
		formData.append("newImg", newImg ? "1" : "0");
		for (let [index, val] of files.entries()) {
			formData.append("image" + index, val);
		}
		const response = await fetch("/oper/products", {
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
	let previousPage: string = "/oper/products";
	afterNavigate((navigaton) => {
		previousPage += navigaton.from?.url.search || "";
	});

	///
	let newImg = false
	let files: File[] = [];
	onMount(async () => {
		if (data.result.images.length == 0) return;
		const buf: File[] = [];
		const a = data.result.images;
		for (let i = 0; i < a.length; i++) {
			const f = await getFileFromUrl(a[i], `/${a[i]}`);
			if (f != undefined) buf.push(f);
		}
		files = buf;
	});
	const onImg = (event: Event, i: number) => {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			files[i] = input.files[0];
			newImg = true
		}
	};
	const onRem = (i: number) => {
		files.splice(i, 1);
		files = files;
		newImg = true
	};
	let showModal = false;
</script>

<Tile>
	<Form on:submit={submit}>
		<div class="cont">
			{#each files as e, i}
				<div class="el">
					{#await readURL(e)}
						<p>...waiting</p>
					{:then src}
						<img {src} alt="" />
						<input type="file" id={`file${i}`} on:change={(event) => onImg(event, i)} hidden />
						<label for={`file${i}`}>Изменить</label>
						<button type="button" class="rem" on:click={() => onRem(i)}>X</button>
					{:catch error}
						<p style="color: red">failed</p>
					{/await}
				</div>
			{/each}
			<div class="el">
				<input type="file" id={`file${files.length}`} on:change={(event) => onImg(event, files.length)} hidden />
				<label for={`file${files.length}`}>Добавить</label>
			</div>
		</div>
		<TextInput labelText="Штрих-код" bind:value={data.result.barcode} inline={true} required />
		<TextInput labelText="Название (English)" bind:value={data.result.names[0]} inline={true} />
		<TextInput labelText="Название (Русский)" bind:value={data.result.names[1]} inline={true} />
		<TextInput labelText="Назв. (Türkmençe)" bind:value={data.result.names[2]} inline={true} />
		<TextArea labelText="Описание (English)" bind:value={data.result.descriptions[0]} maxCount={590} />
		<TextArea labelText="Описание (Русский)" bind:value={data.result.descriptions[1]} maxCount={590} />
		<TextArea labelText="Описание (Türkmençe)" bind:value={data.result.descriptions[2]} maxCount={590} />
		<div class="keywords">
			<TextInput labelText="Keywords" bind:value={data.result.keywords} inline={true} />
			<Button type="button" kind="secondary" on:click={() => (showModal = true)}>
				Выбрать категорию
			</Button>
		</div>
		<NumberInput label="Номер сортировки" bind:value={data.result.sortIndex} required />
		<Checkbox bind:checked={data.result.active} labelText="Актив" />
		<Button type="submit">Сохранить</Button>
	</Form>
</Tile>

<CategoryModal bind:showModal bind:categories={data.groups} on:select={(e) => {
	data.result.keywords += e.detail.categoryCode + "; ";
}}/>

<style lang="scss">
	.el {
		position: relative;
		width: 200px;
		height: 200px;
	}
	.el > label {
		background-color: #00000033;
		color: white;
		padding: 0.5rem 0;
		cursor: pointer;
		position: absolute;
		text-align: center;
		left: 0;
		bottom: 0;
		width: 100%;
	}
	.el:last-child > label {
		height: 100%;
	}
	.el > img {
		width: 100%;
		height: 100%;
	}
	.rem {
		background-color: #00000033;
		color: white;
		border: none;
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		position: absolute;
		top: 0;
		right: 0;
	}
	.cont {
		display: flex;
		flex-wrap: wrap;
	}
	:global(form > .bx--form-item) {
		margin-top: 1.5rem;
	}
	:global(.bx--list-box__wrapper) {
		margin: 1rem 0;
	}
	:global(.bx--text-input__label-helper-wrapper) {
		text-align: end;
	}
	.keywords {
		display: flex;
		align-items: center;
	}
</style>