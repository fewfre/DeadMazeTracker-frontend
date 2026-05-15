<script>
    import { isAuthenticated, isLoginModalOpen, logout, user } from "../../auth/auth0-helpers";
    import LoginModal from "../../auth/LoginModal.svelte";
    import NavDropdown from "./common/NavDropdown.svelte";
    import NavMenuListItem from "./common/NavMenuListItem.svelte";
	
</script>
{#if !$isAuthenticated || !$user}
	<button id="login-btn" onclick={() => $isLoginModalOpen = true}>Log in</button>
	<LoginModal />
{:else}
	<NavDropdown contId='user-dropdown' contentId='user-dropdown-content'>
		{#snippet button()}
			<button id="auth-dropdown-trigger" aria-controls="user-dropdown-content">
				{#if $user.picture} <img class="avatar" height="25" alt="" src={$user.picture} /> {/if}
				<strong class="name">{$user.nickname || $user.name || "Nickname"}</strong>
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
	gap: 4px;
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