<script lang="ts">
	interface Props {
		upVotes:number, upActive?:boolean, onUpVoteClicked:()=>void,
		downVotes:number, downActive?:boolean, onDownVoteClicked:()=>void
	}
	let {
		upVotes=0, upActive=false, onUpVoteClicked,
		downVotes=0, downActive=false, onDownVoteClicked
	} : Props = $props();
	
	const upClicked = () => {
		upVotes += (upActive ? -1 : 1);
		upActive = !upActive;
		onUpVoteClicked();
	}
	
	const downClicked = () => {
		downVotes += (downActive ? -1 : 1);
		downActive = !downActive;
		onDownVoteClicked();
	}
</script>


<div class='vote-buttons-group'>
	<button class={['vote-up', { active:upActive }]} onclick={upClicked}>✔ {upVotes}</button>
	<button class={['vote-down', { active:downActive }]} onclick={downClicked}>✘ {downVotes}</button>
</div>

<style>
.vote-buttons-group {
	display: flex;
	justify-content: center;
	margin:1px 0;
}
.vote-buttons-group button {
	border:solid 1px currentColor;
	margin:0;
	font-weight:bold;
}
.vote-buttons-group button:enabled:hover {
	cursor: pointer;
	box-shadow: 0 0 1px 0 currentColor;
	filter: brightness(90%);
}
.vote-buttons-group button.active {
	box-shadow: 0 0 1px 2px currentColor;
	filter: brightness(95%);
}
.vote-buttons-group button.active:enabled:hover {
	filter: brightness(90%);
	box-shadow: 0 0 1px 1.5px currentColor;
}
.vote-buttons-group button:disabled {
	filter: grayscale(80%);
}
.vote-buttons-group .vote-up { color:green; background:#eaffe4; border-radius:3px 0 0 3px; border-right:0; }
.vote-buttons-group .vote-down { color:darkred; background:#ffefea; border-radius:0 3px 3px 0; border-left-color:#333; }
</style>