<template>
	<VContainer>
		<div v-if="app.loggedIn">
			<h2>Your Portfolios</h2>
			<br>
			<p v-if="!requestError">{{ portfolios }}</p>
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

	const app = useAppStore();
	const portfolios = ref([]);
	const requestError = ref("");

	const URL = import.meta.env.MODE === 'development' ? import.meta.env.VITE_DEV_SERVER_URL : "";

	onMounted(async () => {
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
