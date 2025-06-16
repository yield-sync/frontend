<template>
	<VContainer style="">
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

				<h2 class="my-3 text-light">
					Total Value: <span class="text-primary">$ {{ Number(totalPortfolioValue).toFixed(2) }}</span>
				</h2>

				<VTabs
					v-model="tab"
					align-tabs="center"
					bg-color="dark-light"
					stacked
					grow
					fixed-tabs
				>
					<VTab value="tab-1" color="primary">
						<VIcon icon="mdi-chart-donut" class="mb-2"/>
						Sector
					</VTab>

					<VTab value="tab-2" color="primary">
						<VIcon icon="mdi-format-list-bulleted" class="mb-2"/>
						Assets
					</VTab>

					<VTab value="tab-3" color="primary">
						<VIcon icon="mdi-chart-pie" class="mb-2"/>
						Chart
					</VTab>
				</VTabs>

				<VTabsWindow v-model="tab" class="elevation-0 mx-auto mt-5">
					<VTabsWindowItem v-for="i in 3" :key="i" :value="'tab-' + i">
						<div v-show="tab == 'tab-1'">
						</div>

						<div v-show="tab == 'tab-2'">
							<PortfolioAssetAddForm :id="id" @asset-added="getPortfolio"/>
							<PortfolioAssetsRead
								:portfolioAssets="portfolioAssets"
								:totalPortfolioValue="totalPortfolioValue"
								@assets-changed="getPortfolio"
							/>
						</div>

						<div v-show="tab == 'tab-3'">
						</div>
					</VTabsWindowItem>
				</VTabsWindow>
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
	import PortfolioAssetsRead from "../portfolio-asset/PortfolioAssetsRead.vue";
	import PortfolioAssetAddForm from "../portfolio-asset/PortfolioAssetAddForm.vue";
	import PortfolioHeader from "./PortfolioHeader.vue";
	import ConfirmDialog from "./ConfirmDialog.vue";

	const router = useRouter();

	const app = useAppStore();
	const props = defineProps({
		id: [
			String,
			Number,
		]
	});

	const id = ref(props.id);

	// UI
	const tab = ref(app.loggedIn ? "tab-1" : "tab-2");
	const loading = ref(false);
	const requestError = ref("");

	// Portfolio
	const portfolio = ref();
	const portfolioAssets = ref([
	]);

	const totalPortfolioValue = ref(0);

	// Deleetion stuff
	const confirmDeletePortfolio = ref(false);


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const computePortfolioBalance = (assets) =>
	{
		let totalValue = 0;

		for (let i = 0; i < assets.length; i++)
		{
			totalValue += assets[i].balance * assets[i].stock_price
		}

		return totalValue;
	};

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

		totalPortfolioValue.value = computePortfolioBalance(portfolioAssets.value);

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

			totalPortfolioValue.value = computePortfolioBalance(portfolioAssets.value);

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
