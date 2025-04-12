<template>
	<VContainer>
		<div v-if="app.loggedIn" class="mx-auto" style="max-width: 600px;">
			<h2 class="text-center">Your Portfolios</h2>

			<br/>

			<VRow v-if="!requestError">
				<VCol v-for="p in portfolios" :key="p.id" cols="12">
					<VCard @click="router.push('/portfolio')" color="secondary" elevation="0" class="">
						<VCardTitle class="py-6 text-center">
							<h4 class="text-center text-uppercase text-light">{{ p.name }}</h4>
						</VCardTitle>
					</VCard>
				</VCol>
			</VRow>

			<h3 v-else class="text-error">{{ requestError }}</h3>
		</div>

		<div v-else>
			<p class="text-center">Log in to view your portfolios</p>
		</div>
	</VContainer>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import axios from "axios";

	import useAppStore from "@/stores/App";
	import { useRouter } from "vue-router";

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
