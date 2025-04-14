<template>
	<VContainer>
		<div v-if="app.loggedIn">
			<h2 class="mb-6 text-center">Your Portfolios</h2>

			<VRow v-if="!requestError">
				<VCol v-if="portfolios.length > 0" v-for="p in portfolios" :key="p.id" cols="12">
					<VCard @click="router.push(`/portfolio/${p.id}`)" color="secondary" elevation="0">
						<VCardTitle class="py-6 text-center">
							<h4 class="text-center text-uppercase text-light">{{ p.name }}</h4>
						</VCardTitle>
					</VCard>
				</VCol>

				<VCol v-else cols="12">
					<h3 class="text-center text-light">You do not have any portfolios</h3>
				</VCol>

				<VCol cols="12">
					<hr class="border border-secondary">
				</VCol>

				<VCol cols="12">
					<PortfolioCreate />
				</VCol>
			</VRow>

			<div v-else>
				<h3 class="text-center text-error">{{ requestError }}</h3>
			</div>
		</div>

		<div v-else>
			<h3 class="text-center">Log in to view your portfolios</h3>
		</div>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import PortfolioCreate from "./Create.vue";
	import useAppStore from "@/stores/App";

	const app = useAppStore();
	const router = useRouter();
	const portfolios = ref([
	]);
	const requestError = ref("");

	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

	onMounted(async () =>
	{
		try
		{
			if (!app.loggedIn)
			{
				return;
			}

			const authAxios = axios.create({
				baseURL: `${URL}/api/portfolio`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`
				}
			});

			const response = await authAxios.get("/");

			portfolios.value = response.data.portfolios;
			requestError.value = "";
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
