<template>
	<VContainer style="max-width: 600px;">
		<h3 v-if="loading" class="text-center text-primary">Loading..</h3>

		<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>

		<VCard v-if="portfolio && !loading" color="dark-light" elevation="0" rounded="xl">
			<VCardText>
				<PortfolioHeader
					:id="id"
					:portfolio="portfolio"
					:loading="loading"
					@confirm-delete="confirmDeletePortfolio = true"
					@update-name="onPortfolioNameUpdate"
				/>

				<PortfolioAssetAddForm :id="id" @asset-added="getPortfolio" />

				<PortfolioAssetsRead :portfolioAssets="portfolioAssets" @assets-changed="getPortfolio" />
			</VCardText>
		</VCard>
	</VContainer>

	<!-- Confirm delete portfolio -->
	<ConfirmDialog
		v-model="confirmDeletePortfolio"
		title="Delete Portfolio?"
		message="This action cannot be undone."
		confirm-text="Yes, Delete"
		max-width="400"
		color="dark"
		@confirm="onConfirmDeletePortfolio"
		@cancel="confirmDeletePortfolio = false"
	/>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";
	import PortfolioHeader from "./PortfolioHeader.vue";
	import PortfolioAssetAddForm from "./PortfolioAssetAddForm.vue";
	import ConfirmDialog from "./ConfirmDialog.vue";
	import PortfolioAssetsRead from "./PortfolioAssetsRead.vue";

	const props = defineProps({
		id: [
			String,
			Number,
		]
	});

	const id = ref(props.id);

	// UI
	const loading = ref(false);
	const requestError = ref("");

	// Portfolio
	const portfolio = ref();
	const portfolioAssets = ref([
	]);

	// Deleetion stuff
	const confirmDeletePortfolio = ref(false);

	const router = useRouter();
	const app = useAppStore();


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const onConfirmDeletePortfolio = async () =>
	{
		confirmDeletePortfolio.value = false;
		await deletePortfolio();
	};

	const getPortfolio = async () =>
	{
		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		const response = await authAxios.get(`/${props.id}`);

		portfolio.value = response.data.portfolio;

		portfolioAssets.value = response.data.portfolioAssets;

		loading.value = false;
	};

	const onPortfolioNameUpdate = async (newName) =>
	{
		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		try
		{
			await authAxios.post("/update", {
				load: {
					id: props.id,
					name: newName,
				}
			});

			requestError.value = "";

			await getPortfolio();
		}
		catch (e)
		{
			console.error(e);
		}
		finally
		{
			loading.value = false;
		}
	};

	const deletePortfolio = async () =>
	{
		if (!app.loggedIn) return;

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		try
		{
			const response = await authAxios.delete(`/delete/${props.id}`);

			portfolio.value = response.data.portfolio;
			portfolioAssets.value = response.data.portfolioAssets;
			requestError.value = "";

			router.push("/");
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	};

	onMounted(async () =>
	{
		if (!app.loggedIn) return;

		try
		{
			await getPortfolio();
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
