import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import RegistryView from "@/views/RegistryView.vue";


export default createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView
		},
		{
			path: "/registry",
			name: "registry",
			component: RegistryView
		},
		{
			path: "/governance",

			name: "governance",

			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
			{
				return import("../views/GovernanceView.vue");
			}
		},
	]
});