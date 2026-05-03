import { writable } from "svelte/store";

interface User {
	sub: string;
	nickname?: string;
	picture?: string;
}

export const isAuthenticated = writable(false);
export const user = writable<User|null>(null);

export const getUserAvatar = (u:User|null) => u?.picture && u.picture.indexOf("pbs.twimg.com") == -1 ? u.picture : '';

// const updateUI = function() {
// 	// Promises used since async was giving some people issues.
// 	Promise.all([
// 		auth0.isAuthenticated().then(function(result){ isAuthenticated.set(result) }),
// 		auth0.getUser().then(function(result){ user.set(result) }),
// 	]).then(function(){
		
// 		let isAuthenticated, user;
		
// 		$("#btn-logout").toggle(isAuthenticated);
// 		$("#navprofile").toggle(isAuthenticated);
// 		$("#btn-login").toggle(!isAuthenticated);
		
// 		if(isAuthenticated) {
// 			$("#navprofile .name").text(user.nickname);
// 			if(user.picture.indexOf("pbs.twimg.com") == -1) {
// 				$("#navprofile .avatar").attr("src", user.picture);
// 			}
// 			Cookies.set("auth0.sub", user.sub);
// 		} else {
// 			Cookies.remove("auth0.sub");
// 		}
// 		// document.getElementById("btn-logout").disabled = !isAuthenticated;
// 		// document.getElementById("btn-login").disabled = isAuthenticated;
// 	});
// };
		
// user.subscribe(user=>{
// 	if(user && $isAuthenticated) {
// 		Cookies.set("auth0.sub", user.sub);
// 	} else {
// 		Cookies.remove("auth0.sub");
// 	}
// })

export const login = () => {} // TODO
export const logout = () => {} // TODO