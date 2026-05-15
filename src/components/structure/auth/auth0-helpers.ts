import { createAuth0Client, type Auth0Client, type User } from '@auth0/auth0-spa-js';
import { envVars } from '../../../utils/env-vars';
import { get, writable } from "svelte/store";

// Code based on https://auth0.com/docs/quickstart/spa/svelte (added 2026, but also some code from old js cdn version carried over)

const redirect_uri = envVars.AUTH0_REDIRECT_URI;

export const auth0Client = writable<Auth0Client | null>(null);
export const isAuthenticated = writable(false);
export const user = writable<User|null>(null);
export const isLoginModalOpen = writable(false);

initializeAuth();

export async function initializeAuth() {
	try {
		const auth0 = await createAuth0Client({
			domain: envVars.AUTH0_DOMAIN,
			clientId: envVars.AUTH0_CLIENT_ID,
			useRefreshTokens: true,
			cacheLocation: 'localstorage',
		});
		auth0Client.set(auth0);
		
		const query = window.location.search;
		if ( query.includes("code=") && query.includes("state=") ) {
			await auth0.handleRedirectCallback();
			window.history.replaceState({}, document.title, window.location.pathname);
		} else {
			// TODO 2026
			// if(Cookies.get("auth0.is.authenticated")=="true") {
			// 	Cookies.remove("auth0.is.authenticated")
			// 	// `await` removed since async giving some people issues (and not actually needed here anyways since nothing waits for this method)
			// 	refreshLoginSilently();
			// }
		}
		
		const authenticated = await auth0.isAuthenticated();
		isAuthenticated.set(authenticated);

		if (authenticated) {
			console.log("> User is authenticated");
			const userData = await auth0.getUser();
			user.set(userData ? { ...userData, picture: userData?.picture && userData.picture.indexOf("pbs.twimg.com") == -1 ? userData.picture : undefined } : null);
		}
	} catch (err) {
		console.error('Auth initialization error:', err);
		// error.set(err instanceof Error ? err.message : 'Authentication initialization failed'); // TODO 2026
	}
}

/**
 * Starts the authentication flow
 */
export async function login(targetUrl?:string) {
	try {
		console.log("Logging in", targetUrl);
		await get(auth0Client)?.loginWithRedirect({
			authorizationParams:{
				redirect_uri,
				// appState: { targetUrl:targetUrl || redirectUri },
				appState: { targetUrl:redirect_uri },
				audience: envVars.AUTH0_AUDIENCE,
			}
		});
	} catch (err) {
		console.log("Log in failed", err);
	}
};

/**
 * Starts the authentication flow
 */
export async function refreshLoginSilently() {
  try {
    await get(auth0Client)?.loginWithRedirect({
		authorizationParams:{
			redirect_uri,
			appState: { targetUrl:redirect_uri },
			audience: envVars.AUTH0_AUDIENCE,
			prompt: "none",
		}
	});
  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
export async function logout() {
  try {
    console.log("Logging out");
    await get(auth0Client)?.logout({ logoutParams:{ returnTo:redirect_uri } });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

export async function getToken(): Promise<string | null> {
	const client = get(auth0Client);
	if (!client) return null;

	try {
		return await client.getTokenSilently({ authorizationParams:{ audience: envVars.AUTH0_AUDIENCE } });
	} catch (err: any) {
		if (err.error === 'login_required') {
			isLoginModalOpen.set(true);
		}
		console.error(err)
		return null;
	}
}

export async function cancelEarlyIfNotAuthenticated() {
	const authenticated = get(isAuthenticated);
	if(authenticated) {
		return false;
	} else {
		isLoginModalOpen.set(true);
		return true;
	}
}