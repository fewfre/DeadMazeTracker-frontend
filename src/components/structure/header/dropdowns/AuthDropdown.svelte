<script>
    import { getI18n } from "../../../../i18n/i18n";
    import { isAuthenticated, isLoginModalOpen, logout, user } from "../../auth/auth0-helpers";
    import LoginModal from "../../auth/LoginModal.svelte";
    import NavDropdown from "./common/NavDropdown.svelte";
    import NavMenuListItem from "./common/NavMenuListItem.svelte";
	
</script>
{#if !$isAuthenticated || !$user}
	<button id="login-btn" onclick={() => $isLoginModalOpen = true}>{$getI18n("user.login", "Log in")}</button>
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
			<NavMenuListItem><button id="btn-logout" onclick={()=>{ logout() }}>{$getI18n("user.logout", "Log out")}</button></NavMenuListItem>
		</ul>
	</NavDropdown>
{/if}

<style>
#login-btn {
	all: unset;
	box-sizing: border-box;
	height: 34px;
	padding: 5px;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	
	color: #005500;
	background: #FFFFFFDD;
	border: 2px solid green;
	border-radius: 5px;
	
	&:hover {
		transform: scale(1.05);
	}
	
	&:active {
		box-shadow: inset 3px 3px 3px 0px rgba(0, 0, 0, 0.2);
	}
}
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