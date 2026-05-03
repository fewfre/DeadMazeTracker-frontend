<script lang="ts">
    import type { Snippet } from "svelte";

	interface Props { type:'success'|'warning'|'danger'|'info'|'primary', onclick?:()=>void; children:Snippet }
	let { type, onclick, children } : Props = $props();
</script>

<button class={['alert', 'alert-'+type]} onclick={onclick}>
	{@render children()}
</button>

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
		
		&:hover { background-color: rgba(7, 149, 66, 0.35); }
	}
	&.alert-warning {
		border: 1px solid rgba(241, 142, 6, 0.81);
		background-color: rgba(220, 128, 1, 0.16);
		box-shadow: 0px 0px 2px #ffb103;
		color: #ffb103;
		
		&:hover { background-color: rgba(220, 128, 1, 0.33); }
	}
	&.alert-danger {
		border: 1px solid rgba(241, 6, 6, 0.81);
		background-color: rgba(220, 17, 1, 0.16);
		box-shadow: 0px 0px 2px #ff0303;
		color: #ff0303;
		
		&:hover { background-color: rgba(220, 17, 1, 0.33); }
	}
	&.alert-info {
		border: 1px solid rgba(6, 44, 241, 0.46);
		background-color: rgba(7, 73, 149, 0.12156862745098039);
		box-shadow: 0px 0px 2px #0396ff;
		color: #0396ff;
		
		&:hover { background-color: rgba(7, 73, 149, 0.35); }
	}
	&.alert-primary {
		border: 1px solid rgba(6, 241, 226, 0.81);
		background-color: rgba(1, 204, 220, 0.16);
		box-shadow: 0px 0px 2px #03fff5;
		color: #03d0ff;
		
		&:hover { background-color: rgba(1, 204, 220, 0.33); }
	}
}
</style>