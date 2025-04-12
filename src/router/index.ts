import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import PortfolioView from "@/views/PortfolioView.vue";


export default createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView
		},
		{
			path: "/login",
			name: "login",
			component: LoginView
		},
		{
			path: "/portfolio/:id",
			name: "portfolio",
			component: PortfolioView
		},
	]
});
