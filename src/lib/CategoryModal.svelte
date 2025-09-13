<script lang="ts">
	import { Button } from "carbon-components-svelte";

	export let showModal: boolean;
	export let categories: any[];
	let dialog: any;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	$: if (dialog && showModal) dialog.showModal();

	let categoryCode = "";

	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (categoryCode == "") return;
		dispatch("select", { categoryCode: categories.find((el) => el.code == categoryCode).parentCode });
		dispatch("select", { categoryCode });
		dialog.close();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => {showModal = false; categoryCode = ""}}>
	<form on:click|stopPropagation on:submit={submit}>
		<h3>Выберите категорию:</h3>
		{#each categories as category}
			<label>
				<input bind:group={categoryCode} type="radio" value={category.code} />
				{category.names[1]} <span>[{category.code}]</span>
			</label>
		{/each}
		<div class="bottom">
			<Button kind="ghost" on:click={() => dialog.close()}>Отменить</Button>
			<Button type="submit">Выбрать</Button>
		</div>
	</form>
</dialog>

<style lang="scss">
	dialog {
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > form {
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		> h3 {
			margin-bottom: 1.5rem;
		}
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.bottom {
		margin-top: 2rem;
		align-self: center;
	}

	label {
		font-size: 1.2rem;
	}
	label > span {
		color: #bbb;
	}
</style>
