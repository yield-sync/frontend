<template>
	<VContainer>
		<div class="mx-auto" style="max-width: 600px;">
			<h2 class="text-center">{{ portfolio.name }}</h2>

			<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>
		</div>
	</VContainer>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import axios from "axios";

	import useAppStore from "@/stores/App";

	const props = defineProps({
		id: [String, Number]
	});

	const app = useAppStore();
	const portfolio = ref([
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
				baseURL: `${URL}/api/portfolio/`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`
				}
			});

			const response = await authAxios.get(`/${props.id}`);

			portfolio.value = response.data.portfolio;
			requestError.value = "";
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
