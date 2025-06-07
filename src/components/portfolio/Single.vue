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

				<AddAssetForm :id="id" @asset-added="getPortfolio" />

				<h3 v-if="portfolioAssets.length == 0" class="py-12 text-center text-light">No assets in portfolio</h3>

				<div
					v-if="portfolioAssets.length > 0"
					v-for="(a, i) in portfolioAssets"
					:key="a.portfolio_asset_id"
					id="asset-row"
					class="px-3 py-3 rounded-xl"
					:class="i % 2 === 0 ? 'bg-dark' : ''"
				>
					<div id="asset-info">
						<h3 id="symbol-name-sector-industry"  class="mb-3 text-secondary">
							<span v-if="a.isin" class="text-primary">
								[{{ a.stock_symbol }}]
								{{ a.stock_name.length > 10 ? a.stock_name.slice(0, 10) + ".." : a.stock_name }}
							</span>
							<span v-else class="text-primary">
								{{ a.cryptocurrency_symbol }} -
								{{ a.cryptocurrency_name.length > 10 ? a.cryptocurrency_name.slice(0, 10) + ".." : a.cryptocurrency_name }}
							</span> |
							<span class="text-light">{{ a.sector }} - {{ a.industry }}</span>
						</h3>

						<VRow id="percent-&-value">
							<VCol id="asset-percent" cols="4">
								<h3 class="text-center text-light">
									Target Percent
								</h3>
								<VSheet color="secondary" rounded="xl" class="mb-5 text-dark">
									<h3 class="text-center text-light">
										% {{ a.percent_allocation }}
									</h3>
								</VSheet>
							</VCol>
							<VCol id="asset-percent" cols="4">
								<h3 class="text-center text-light">
									Actual Percent
								</h3>
								<VSheet color="secondary" rounded="xl" class="mb-5 text-dark">
									<h3 class="text-center text-light">
										% {{ 0.00 }}
									</h3>
								</VSheet>
							</VCol>
							<VCol id="asset-price" cols="4">
								<h3 class="text-center text-light">
									Total Value
								</h3>
								<VSheet color="secondary" rounded="xl" class="mb-5 text-dark">
									<h3 class="text-center text-light">$ {{ a.balance * a.stock_price }}</h3>
								</VSheet>
							</VCol>
						</VRow>
					</div>

					<VBtn
						color="warning"
						variant="outlined"
						class="w-100"
						@click="() => {
							if (visibleAssetSettings.has(a.portfolio_asset_id)) {
							visibleAssetSettings.delete(a.portfolio_asset_id)
							} else {
							visibleAssetSettings.add(a.portfolio_asset_id)
							}
						}"
						size="small"
						rounded
					>
						{{ visibleAssetSettings.has(a.portfolio_asset_id) ? 'Hide' : 'Show' }} Asset Settings
					</VBtn>

					<VRow
						v-show="visibleAssetSettings.has(a.portfolio_asset_id)"
						id="asset-target-&-ownership-delete"
						class="mt-5"
					>
						<VCol cols="12" sm="4">
							<VTextField
								v-model="a.percent_allocation"
								@blur="() => {
									if (a.percent_allocation < 0) a.percent_allocation = 0;
									if (a.percent_allocation > 100) a.percent_allocation = 100;
								}"
								rounded="xl"
								label="Target %"
								variant="outlined"
								color="light"
								class="text-light"
								type="number"
								density="compact"
							>
								<template #prepend-inner>
									%
								</template>
							</VTextField>
						</VCol>

						<VCol cols="12" sm="4">
							<VTextField
								v-model="a.balance"
								rounded="xl"
								variant="outlined"
								label="Balance"
								color="light"
								class="text-light"
								type="number"
								density="compact"
							/>
						</VCol>

						<VCol cols="12" sm="4">
							<VBtn
								@click="updatePorfolioAsset(i)"
								variant="flat"
								rounded="xl"
								color="warning"
								class="w-100"
							>
								Update
							</VBtn>
						</VCol>

						<VCol cols="12">
							<VBtn
								@click="() => {
									confirmDeletePortfolioAsset = true;
									assetToDeleteId = a.portfolio_asset_id
								}"
								variant="flat"
								rounded="xl"
								color="danger"
								class="w-100"
								size="small"
							>
								✖ Delete
							</VBtn>
						</VCol>
					</VRow>
				</div>
			</VCardText>
		</VCard>

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

		<ConfirmDialog
			v-model="confirmDeletePortfolioAsset"
			title="Delete Asset?"
			message="This asset will be removed from the portfolio."
			confirm-text="Yes, Delete"
			max-width="400"
			color="dark"
			@confirm="onConfirmDeletePortfolioAsset"
			@cancel="confirmDeletePortfolioAsset = false"
		/>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";
	import PortfolioHeader from "./PortfolioHeader.vue";
	import AddAssetForm from "./AddAssetForm.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

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
	const updatePortfolioToggle = ref(false);
	const visibleAssetSettings = ref(new Set())

	// Portfolio
	const portfolio = ref();
	const portfolioAssets = ref([
	]);

	// Deleetion stuff
	const assetToDeleteId = ref(null);
	const confirmDeletePortfolioAsset = ref(false);
	const confirmDeletePortfolio = ref(false);

	const router = useRouter();
	const app = useAppStore();


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const onConfirmDeletePortfolio = async () =>
	{
		confirmDeletePortfolio.value = false;
		await deletePortfolio();
	};

	const onConfirmDeletePortfolioAsset = async () =>
	{
		if (!assetToDeleteId.value) return;

		await deletePortfolioAsset(assetToDeleteId.value);

		confirmDeletePortfolioAsset.value = false;
		assetToDeleteId.value = null;
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

			updatePortfolioToggle.value = false;
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

	const deletePortfolioAsset = async (portfolio_asset_id) =>
	{
		if (!app.loggedIn) return;

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio-asset`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			await authAxios.delete(`/${portfolio_asset_id}`);
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}

		await getPortfolio();
	};

	const updatePorfolioAsset = async (portfolioAssetsIndex) =>
	{
		if (!app.loggedIn) return;

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio-asset`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			await authAxios.put(
				`/update/${portfolioAssets.value[portfolioAssetsIndex].portfolio_asset_id}`,
				{
					load: {
						balance: portfolioAssets.value[portfolioAssetsIndex].balance,
						percent_allocation: portfolioAssets.value[portfolioAssetsIndex].percent_allocation,
					}
				}
			);
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}

		await getPortfolio();
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

<style scoped>
.switch-danger .v-selection-control__track {
	background-color: #dc3545 !important; /* Bootstrap 'danger' red */
	border-color: #dc3545 !important;
}

.switch-danger .v-selection-control__thumb {
	background-color: white !important;
}

.asset-list-wrapper {
	height: 115px; /* You can adjust this height */
	overflow-y: scroll;
}

.custom-scrollbar {
	max-height: 300px;
	overflow-y: auto;
}

/* Scrollbar styles for WebKit browsers */
.custom-scrollbar::-webkit-scrollbar {
width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: #2a2a2a;
	border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: #888;
	border-radius: 8px;
	border: 2px solid #2a2a2a;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background-color: #aaa;
}

/* Firefox scrollbar */
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: #888 #2a2a2a;
}
</style>
