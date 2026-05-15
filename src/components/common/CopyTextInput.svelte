<script lang="ts">
	import { copyToClipboard } from "../../utils/helpers";

	interface Props {
		label: string;
		value: string;
		width?: string;
	}
	const { label, value, width }: Props = $props();

	let copied = $state(false);

	const handleCopyClick = () => {
		copyToClipboard(value)
			.then(() => {
				copied = true;

				// Revert after 2 seconds
				setTimeout(() => {
					copied = false;
				}, 2000);
			})
			.catch((err) => console.error("Failed to copy:", err));
	};
</script>

<div class="container" style:width>
	{#if label}
		<span class="label">{label}</span>
	{/if}
	<input {value} readonly type="text" onclick={(e) => e.currentTarget.select()} />
	<button onclick={handleCopyClick} class="copy-button" class:copied aria-label="Copy to clipboard">
		{#if !copied}
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<rect x="4" y="8" width="12" height="12" rx="1" stroke-linecap="round" stroke-linejoin="round"></rect>
				<path
					d="M8 6V5C8 4.44772 8.44772 4 9 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H18"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-dasharray="2 2"
				></path>
			</svg>
		{:else}
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M5 12L9 16L19 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		{/if}
	</button>
</div>

<style>
	.container {
		display: flex;
		align-items: stretch;
		box-shadow: 0 1px 2px 0 rgb(0, 0, 0, 0.05);
		height: 32px;
		--border-radius: 8px;
		--border-color: #ccc;
		color: #ccc;
		border-radius: var(--border-radius);
	}
	.container:has(input:focus) {
		box-shadow: 0 0 3px 2px var(--border-color);
	}
	input {
		flex: 1;
		padding: 0.25rem 0;
		text-indent: 0.5rem;

		color: inherit;
		background-color: #ffffff22;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
	}
	input:focus {
		outline: none;
	}
	.label + input {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: none;
	}
	.label {
		flex-grow: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 10px;

		background-color: #ffffff44;
		border: 1px solid var(--border-color);
		border-right: none;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
	}
	.copy-button {
		all: unset;
		display: flex;
		align-items: center;
		padding: 10px;
		cursor: pointer;
		transition: all 200ms ease-in-out;

		color: white;
		background-color: #686f7a;
		border: 1px solid var(--border-color);
		border-left: none;
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
	}
	.copy-button:hover {
		background-color: #40444b;
		border-color: #b0b0b0;
	}
	.copy-button:active {
		transform: scale(0.98);
	}
	.copy-button.copied {
		background-color: #a0d1ab;
		border-color: #83a18a;
		color: #155724;
	}
	svg {
		pointer-events: none;
	}
	.icon {
		width: 16px;
		height: 16px;
		stroke-width: 2;
	}
</style>
