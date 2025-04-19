<template>
	<VContainer>
		<VRow v-if="portfolio">
			<VCol cols="12">
				<h2 class="text-center">{{ portfolio.name }}</h2>
			</VCol>

			<VCol cols="12">
				<VRow v-if="portfolioAssets.length > 0">
					<VCol cols="12">
						<VRow>
							<VCol cols="6" lg="6">
								<h4 class="text-bold text-primary">Symbol</h4>
							</VCol>

							<VCol cols="6" lg="6">
								<h4 class="text-bold text-primary">% Allocation</h4>
							</VCol>
						</VRow>
					</VCol>

					<VCol v-for="a in portfolioAssets" :key="a.id" cols="12">
						<VRow>
							<VCol cols="6" lg="6">
								<h2 class="text-light">{{ a.stock_symbol }}{{ a.cryptocurrency_symbol }}</h2>
								<h5 class="text-light">{{ a.stock_name }}{{ a.cryptocurrency_name }}</h5>
							</VCol>

							<VCol cols="6" lg="6">
								<h2 class="text-light">% {{ a.percent_allocation / 100 }}</h2>
							</VCol>
						</VRow>
					</VCol>
				</VRow>

				<div v-else>
					<h3 class="text-center text-warning">No portfolio assets</h3>
				</div>
			</VCol>

			<VCol cols="12">
				<div class="text-center">
					<VBtn @click="deletePortfolio()" variant="outlined" color="danger">Delete</VBtn>
				</div>
			</VCol>
		</VRow>

		<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>
	</VContainer>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import axios from "axios";

	import useAppStore from "@/stores/App";
	import { useRouter } from "vue-router";

	const router = useRouter();

	const props = defineProps({
		id: [String, Number]
	});

	const app = useAppStore();

	const portfolio = ref();
	const portfolioAssets = ref([]);

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
			portfolioAssets.value = response.data.portfolioAssets;
			requestError.value = "";
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});

	const deletePortfolio = async () => {
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

			const response = await authAxios.delete(`/delete/${props.id}`);

			portfolio.value = response.data.portfolio;
			portfolioAssets.value = response.data.portfolioAssets;
			requestError.value = "";

			router.push("/");
		}
		catch (error)
		{
			console.log(error);

			requestError.value = error.response?.data.message || error.message;
		}
	};
</script>
