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
	]
});
