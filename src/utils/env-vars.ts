export namespace envVars {
	export const API_BASE = import.meta.env.VITE_API_BASE || "";
	export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";
}