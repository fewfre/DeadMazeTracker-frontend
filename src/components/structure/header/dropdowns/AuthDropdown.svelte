<script>
    import { getUserAvatar, isAuthenticated, logout, user } from "../../../../utils/auth0-helpers";
    import LoginModal from "../../../features/login/LoginModal.svelte";
    import NavDropdown from "./common/NavDropdown.svelte";
    import NavMenuListItem from "./common/NavMenuListItem.svelte";
	
	let showLoginModal = false;
</script>
{#if !$isAuthenticated}
	<button id="login-btn" onclick={() => showLoginModal = true}>Log in</button>
	<LoginModal bind:showModal={showLoginModal} />
{:else}
	<NavDropdown contId='user-dropdown' contentId='user-dropdown-content'>
		{#snippet button()}
			<button id="auth-dropdown-trigger" aria-controls="user-dropdown-content">
				<img class="avatar" height="25" alt="" src={getUserAvatar($user)} /> <strong class="name">{$user.nickname}</strong>
			</button>
		{/snippet}
		<ul>
			<NavMenuListItem><button id="btn-logout" onclick={()=>{ logout() }}>Log out</button></NavMenuListItem>
		</ul>
	</NavDropdown>
{/if}

<style>
#auth-dropdown-trigger {
	all: unset;
	display: flex;
	align-items: center;
	padding: 5px;
	cursor: pointer;
}

ul {
	all: unset;
	white-space: nowrap;
}
.avatar {
	border-radius: 10px;
	vertical-align: middle;
}
.name {
	line-height: 25px;
	vertical-align: middle;
}
</style>