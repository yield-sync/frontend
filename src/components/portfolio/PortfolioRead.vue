<template>
	<VContainer>
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


				<VRow class="mb-5">
					<VCol cols="3">
						<div class="w-100 mb-5 px-3 py-1 text-center bg-green rounded-xl" style="display: inline-block;">
							<h3 class="mx-0 my-0 text-white">
								Total Value: $ {{ Number(totalPortfolioValue).toFixed(2) }}
							</h3>
						</div>
					</VCol>

					<VCol cols="6" class="text-center">
						<VTabs
							v-model="tab"
							align-tabs="center"
							bg-color="dark-light"
							stacked
							grow
							fixed-tabs
							class="mx-auto mb-5 rounded-xl border border-light"
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
					</VCol>

					<VCol cols="3" class="text-center"/>
				</VRow>

				<VTabsWindow v-model="tab" class="elevation-0 mx-auto">
					<VTabsWindowItem v-for="i in 3" :key="i" :value="'tab-' + i">
						<div v-show="tab == 'tab-1'">
							<h2 class="text-center text-light">Set Sector Allocation</h2>

							<PortfolioAllocationSectorReadAll
								:portfolio_id="id"
								:sectorAllocations="sectorAllocations"
							/>
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
							<!-- Placeholder for future chart implementation -->
							<h3 class="text-center text-light">Chart will be implemented soon.</h3>
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
	import PortfolioAllocationSectorReadAll from "../portfolio-allocation-sector/PortfolioAllocationSectorReadAll.vue";
	import PortfolioAssetsRead from "../portfolio-asset/PortfolioAssetsRead.vue";
	import PortfolioAssetAddForm from "../portfolio-asset/PortfolioAssetAddForm.vue";
	import PortfolioHeader from "./PortfolioHeader.vue";
	import ConfirmDialog from "./ConfirmDialog.vue";

	const router = useRouter();

	const appStore = useAppStore();

	const props = defineProps({
		id: [
			String,
			Number,
		]
	});

	const id = ref(props.id);

	// UI
	const tab = ref(appStore.loggedIn ? "tab-1" : "tab-2");
	const loading = ref(false);
	const requestError = ref("");

	// Portfolio
	const portfolio = ref();
	const portfolioAssets = ref([
	]);
	const sectorAllocations = ref();


	const totalPortfolioValue = ref(0);

	// Deletion stuff
	const confirmDeletePortfolio = ref(false);


	const computePortfolioBalance = (assets) =>
	{
		let totalValue = 0;

		for (let i = 0; i < assets.length; i++)
		{
			totalValue += assets[i].balance * assets[i].price;
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
			baseURL: `${appStore.baseAPIURL}/api/portfolio/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		const response = await authAxios.get(`/${props.id}`);

		portfolio.value = response.data.portfolio;

		portfolioAssets.value = response.data.portfolioAssets;
		sectorAllocations.value = response.data.sectorAllocations;

		totalPortfolioValue.value = computePortfolioBalance(portfolioAssets.value);

		loading.value = false;
	};

	const onPortfolioNameUpdate = async (newName) =>
	{
		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api/portfolio/`,
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
		if (!appStore.loggedIn) return;

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api/portfolio/`,
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
		if (!appStore.loggedIn) return;

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
