<script lang="ts">
    import type { Snippet } from "svelte";

	export type AlertType = 'success'|'warning'|'danger'|'info'|'primary';
	interface Props { type:AlertType, children:Snippet, onClose?:() => void; }
	let { type, children, onClose } : Props = $props();
</script>

<div class={['alert', 'alert-'+type]}>
	{@render children()}
	{#if onClose}
		<button type="button" class="alert-close" onclick={onClose} aria-label="Dismiss alert">&times;</button>
	{/if}
</div>

<style>
/* Alert box - https://codepen.io/uiswarup/pen/RwNraeW */
.alert {
	position: relative;
	padding: .75rem 1.25rem;
	margin-bottom: 1rem;
	border: 1px solid transparent;
	border-radius: .25rem;
	
	text-shadow: 2px 1px #00040a;
	transition: 0.5s;
	cursor: pointer;
	
	&.alert-success {
		border: 1px solid rgba(36, 241, 6, 0.46);
		background-color: rgba(7, 149, 66, 0.12156862745098039);
		box-shadow: 0px 0px 2px #259c08;
		color: #0ad406;
		
		&.clickable:hover { background-color: rgba(7, 149, 66, 0.35); }
	}
	&.alert-warning {
		border: 1px solid rgba(241, 142, 6, 0.81);
		background-color: rgba(220, 128, 1, 0.16);
		box-shadow: 0px 0px 2px #ffb103;
		color: #ffb103;
		
		&.clickable:hover { background-color: rgba(220, 128, 1, 0.33); }
	}
	&.alert-danger {
		border: 1px solid rgba(241, 6, 6, 0.81);
		background-color: rgba(220, 17, 1, 0.16);
		box-shadow: 0px 0px 2px #ff0303;
		color: #ff0303;
		
		&.clickable:hover { background-color: rgba(220, 17, 1, 0.33); }
	}
	&.alert-info {
		border: 1px solid rgba(6, 44, 241, 0.46);
		background-color: rgba(7, 73, 149, 0.12156862745098039);
		box-shadow: 0px 0px 2px #0396ff;
		color: #0396ff;
		
		&.clickable:hover { background-color: rgba(7, 73, 149, 0.35); }
	}
	&.alert-primary {
		border: 1px solid rgba(6, 241, 226, 0.81);
		background-color: rgba(1, 204, 220, 0.16);
		box-shadow: 0px 0px 2px #03fff5;
		color: #03d0ff;
		
		&.clickable:hover { background-color: rgba(1, 204, 220, 0.33); }
	}
}

.alert-close {
	position: absolute;
	top: 0.25rem;
	right: 0.5rem;
	border: none;
	background: transparent;
	color: inherit;
	font-size: 1.2rem;
	line-height: 1;
	cursor: pointer;
	padding: 0;
}

.alert-close:hover {
	opacity: 0.75;
}
</style>