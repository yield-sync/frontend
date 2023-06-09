import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export default createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "dashboard",
			component: () =>
			{
				return import("../views/RVDashboard.vue");
			}
		},
		{
			path: "/governance",
			name: "governance",
			component: () =>
			{
				return import("../views/RVGovernance.vue");
			}
		},
		{
			path: "/transfer-request-edit/:vaultaddress/:transferrequestid",
			name: "transfer-request-edit",
			component: () =>
			{
				return import("../views/RVTransferRequestEdit.vue");
			}
		},
		{
			path: "/v1-vault/:address",
			name: "v1-vault",
			component: () =>
			{
				return import("../views/RVV1Vault.vue");
			}
		},
		{
			path: "/:pathMatch(.*)*",
			name: "not-found",
			component: () =>
			{
				return import("../views/RVNotFound.vue");
			}
		},
	] as Array<RouteRecordRaw>
});
