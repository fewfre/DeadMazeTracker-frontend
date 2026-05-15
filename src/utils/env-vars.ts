export namespace envVars {
	export const API_BASE = import.meta.env.VITE_API_BASE || "";
	export const API_AUTH_HEADER = import.meta.env.VITE_API_AUTH_HEADER || "Authorization";
	export const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
	export const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
	export const AUTH0_REDIRECT_URI = import.meta.env.VITE_AUTH0_REDIRECT_URI;
	export const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
	export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

	export const CBOX_BOXID = import.meta.env.VITE_CBOX_BOXID;
	export const PROJECTS_JSON_URL = import.meta.env.VITE_PROJECTS_JSON_URL;
}