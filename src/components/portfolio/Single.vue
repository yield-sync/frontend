<template>
	<VContainer style="max-width: 600px;">
		<h3 v-if="loading" class="text-center text-primary">Loading..</h3>

		<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>

		<VCard v-if="portfolio && !loading" color="dark-light" elevation="0" rounded="xl">
			<VCardText>
				<VRow v-if="!updatePortfolioToggle">
					<VCol cols="10">
						<h1 class="text-primary">{{ portfolio.name }}</h1>
					</VCol>

					<VCol cols="2" class="d-flex justify-end">
						<VMenu location="bottom right">
							<template #activator="{ props }">
								<VBtn icon="mdi-dots-vertical" v-bind="props" variant="text" color="light"/>
							</template>

							<VList bg-color="dark">
								<VListItem @click="updatePortfolioToggle = true">
									<VListItemTitle>Update Name</VListItemTitle>
								</VListItem>

								<VListItem @click="confirmDeletePortfolio = true">
									<VListItemTitle class="text-error">Delete</VListItemTitle>
								</VListItem>
							</VList>
						</VMenu>
					</VCol>
				</VRow>

				<UpdateName
					v-if="updatePortfolioToggle"
					:id="id"
					:name="portfolio.name"
					:rules="[]"
					:loading="loading"
					@submit="onPortfolioNameUpdate"
					@cancel="updatePortfolioToggle = false"
					class="mb-3"
				/>

				<VBtn
					@click="showAddAsset = !showAddAsset"
					color="success"
					variant="outlined"
					size=small
					class="w-100 my-3"
					rounded
				>Show Add Asset</VBtn>

				<div id="add-asset" :class="showAddAsset ? '' : 'd-none'" class="px-4 py-4 border border-success bg-dark rounded-xl">
					<h3 class="mt-0 mb-4 text-center text-light">Add Asset</h3>

					<VBtnToggle
						v-model="addAssetType"
						color="primary"
						variant="outlined"
						divided
						mandatory
						rounded="xl"
						class="w-100 mb-6 text-light"
						border="light"
					>
						<VBtn @click="fetchSuggestions" class="w-50">Stock</VBtn>

						<VBtn @click="fetchSuggestions" class="w-50">Crypto</VBtn>
					</VBtnToggle>

					<VTextField
						v-model="symbol"
						@input="fetchSuggestions"
						@update:modelValue="fetchSuggestions"
						color="primary"
						density="compact"
						rounded="xl"
						:label="addAssetType == 0 ? 'Stock Symbol' : 'Crypto Symbol'"
						variant="outlined"
						class="text-light"
					/>

					<div class="mb-5 asset-list-wrapper custom-scrollbar bg-dark-light">
						<VRow
							v-if="queryResult.length > 0"
							v-for="(a, i) in queryResult"
							:key="a.isin"
							class="w-100 cursor-pointer my-0"
							:class="selectedSuggestionIndex === i ? 'bg-primary text-dark' : 'text-light'"
							@click="selectedSuggestionIndex = i"
						>
							<VCol sm="3">
								<span
									class="h4 ml-2"
									:class="selectedSuggestionIndex === i ? 'text-dark' : 'text-primary'"
								>
									{{ a.symbol }}
								</span>
							</VCol>

							<VCol sm="9">
								<span class="h4">{{ a.name }}</span>
							</VCol>
						</VRow>

						<div v-else>
							<h3 class="my-7 text-center text-light">Selection List Empty</h3>
						</div>
					</div>

					<VRow>
						<VCol cols="12" md="6">
							<VTextField
								v-model="percentAllocation"
								density="compact"
								label="Target % (0.00 - 100)"
								variant="outlined"
								class="text-light"
								rounded="xl"
								type="number"
								:min="0"
								:max="100"
								@input="validateAllocation"
							/>
						</VCol>

						<VCol cols="12" md="6">
							<VTextField
								v-model="balance"
								density="compact"
								label="Balance"
								variant="outlined"
								class="text-light"
								type="number"
								rounded="xl"
								:min="0"
							/>
						</VCol>

						<VCol cols="12">
							<VBtn
								:disabled="selectedSuggestionIndex == -1"
								rounded="xl"
								variant="flat"
								:loading="loading"
								color="success"
								class="w-100"
								@click="addPortfolioAsset"
							>
								+ Add Asset
							</VBtn>
						</VCol>
					</VRow>
				</div>


				<h3 v-if="portfolioAssets.length == 0" class="py-12 text-center text-light">No assets in portfolio</h3>

				<div
					v-if="portfolioAssets.length > 0"
					v-for="(a, i) in portfolioAssets"
					:key="a.portfolio_asset_id"
					id="asset-row"
					class="mt-4 mb-8 px-3 rounded-xl"
					:class="i % 2 === 0 ? 'bg-dark' : ''"
				>
					<div id="asset-info">
						<VRow id="symbol-&-name">
							<VCol id="symbol" cols=12 sm="4">
								<h4 class="mb-1 text-light">Symbol</h4>

								<RouterLink v-if="a.isin" :to="`/stock/${a.isin}`">
									<h2 class="text-primary">{{ a.stock_symbol }}</h2>
								</RouterLink>

								<RouterLink v-else :to="`/cryptocurrency/${a.id}`">
									<h2 class="text-primary">{{ a.cryptocurrency_symbol }}</h2>
								</RouterLink>
							</VCol>

							<VCol id="name" cols=12 sm="8">
								<h4 class="mb-1 text-light">{{  a?.isin ? "Company" : "Crypto" }}</h4>

								<h4 v-if="a.isin" class="text-primary">{{ a.stock_name }}</h4>

								<h4 v-else class="text-primary">{{ a.cryptocurrency_name }}</h4>
							</VCol>
						</VRow>

						<VRow id="sector-&-industry">
							<VCol cols="6">
								<h4 class="mb-1 text-light">Sector</h4>

								<h4 class="text-primary">{{ a.sector }}</h4>
							</VCol>
							<VCol cols="6">
								<h4 class="mb-1 text-light">Industry</h4>

								<h4 class="text-primary">{{ a.industry }}</h4>
							</VCol>
						</VRow>

						<VRow id="sector-&-industry">
							<VCol id="asset-percent" cols="6">
								<h4 class="mb-1 text-light">Pct.</h4>

								<VSheet color="secondary" rounded="xl" class="px-2 py-2 text-dark">
									<h3 class="text-center text-light">% {{ 0.00 }}</h3>
								</VSheet>
							</VCol>
							<VCol id="asset-price" cols="6">
								<h4 class="mb-1 text-light">Price</h4>

								<VSheet color="secondary" rounded="xl" class="px-2 py-2 text-dark">
									<h3 class="text-center text-light">{{ a.stock_price }}</h3>
								</VSheet>
							</VCol>
						</VRow>
					</div>

					<div id="asset-target-&-ownership">
						<VRow id="asset-info">
							<VCol cols="12" sm="6">
								<VTextField
									v-model="a.percent_allocation"
									@blur="() => {
										if (a.percent_allocation < 0) a.percent_allocation = 0;
										if (a.percent_allocation > 100) a.percent_allocation = 100;
									}"
									rounded="xl"
									label="Target % (0.00 - 100)"
									variant="outlined"
									color="light"
									class="mt-6 text-light"
									type="number"
									density="compact"
								>
									<template #prepend-inner>
										%
									</template>
								</VTextField>
							</VCol>

							<VCol cols="12" sm="6">
								<VTextField
									v-model="a.balance"
									rounded="xl"
									variant="outlined"
									label="Balance"
									color="light"
									class="mt-6 text-light"
									type="number"
									density="compact"
								/>
							</VCol>

							<VCol cols="6">
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

							<VCol cols="6">
								<VBtn
									@click="() => {
										confirmDeletePortfolioAsset = true;
										assetToDeleteId = a.portfolio_asset_id
									}"
									variant="flat"
									rounded="xl"
									color="danger"
									class="w-100"
								>
									✖
								</VBtn>
							</VCol>
						</VRow>
					</div>
				</div>
			</VCardText>
		</VCard>

		<!-- Confirm delete portfolio -->
		<VDialog v-model="confirmDeletePortfolio" max-width="400">
			<VCard color="dark">
				<VCardTitle class="text-center">
					Are you sure?
				</VCardTitle>

				<VCardText class="text-center">
					<p>This action cannot be undone.</p>
				</VCardText>

				<VCardActions class="justify-center">
					<VBtn color="light" variant="outlined" @click="confirmDelete = false">
						Cancel
					</VBtn>

					<VBtn color="danger" variant="flat" @click="onConfirmDeletePortfolio">
						Yes, Delete
					</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>

		<!-- Confirm delete portfolio asset -->
		<VDialog v-model="confirmDeletePortfolioAsset" max-width="400">
			<VCard color="dark">
				<VCardTitle class="text-center">
					Delete Asset?
				</VCardTitle>

				<VCardText class="text-center">
					<p>This asset will be removed from the portfolio.</p>

					<p class="text-error">This action cannot be undone.</p>
				</VCardText>

				<VCardActions class="justify-center">
					<VBtn color="light" variant="outlined" @click="confirmDeletePortfolioAsset = false">
						Cancel
					</VBtn>

					<VBtn
						color="danger"
						variant="flat"
						@click="onConfirmDeletePortfolioAsset"
					>
						Yes, Delete
					</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";
	import UpdateName from "./UpdateName.vue";

	const props = defineProps({
		id: [
			String,
			Number,
		]
	});

	const id = ref(props.id);

	// UI
	const loading = ref(false);
	const showAddAsset = ref(false);
	const requestError = ref("");
	const updatePortfolioToggle = ref(false);

	// Portfolio
	const portfolio = ref();
	const portfolioAssets = ref([
	]);

	// Add Portfolio Asset
	const addAssetType = ref(0);
	const symbol = ref("");
	const percentAllocation = ref(10);
	const balance = ref(0);
	const queryResult = ref([
	]);
	const selectedSuggestionIndex = ref(-1);

	// Deleetion stuff
	const assetToDeleteId = ref(null);
	const confirmDeletePortfolioAsset = ref(false);
	const confirmDeletePortfolio = ref(false);

	const router = useRouter();
	const app = useAppStore();


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const clearSearch = () =>
	{
		symbol.value = "";

		selectedSuggestionIndex.value = -1;

		queryResult.value = [
		];

		balance.value = 0;
	};

	const validateAllocation = () =>
	{
		if (percentAllocation.value < .00) percentAllocation.value = 0.00;
		if (percentAllocation.value > 100) percentAllocation.value = 100;
	};

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

	const addPortfolioAsset = async () =>
	{
		if (!app.loggedIn) return;

		if (!selectedSuggestionIndex.value === -1)
		{
			requestError.value = "No selection made!";

			return;
		}

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio-asset`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			const portfolioAssetIdentifier = addAssetType.value == 0 ? {
				stock_isin: queryResult.value[selectedSuggestionIndex.value].isin,
			} : {
				cryptocurrency_id: queryResult.value[selectedSuggestionIndex.value].id,
			};

			await authAxios.post("/create", {
				load: {
					...portfolioAssetIdentifier,
					portfolio_id: props.id,
					percent_allocation: percentAllocation.value,
					balance: balance.value,
				}
			});

			clearSearch();

		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}

		await getPortfolio();
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

	const fetchSuggestions = async () =>
	{
		const authAxios = axios.create({
			baseURL: `${URL}/api`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		selectedSuggestionIndex.value = -1;

		if (!symbol.value || symbol.value < 1)
		{
			queryResult.value = [
			];
			return;
		}

		try
		{
			let res;

			switch (addAssetType.value)
			{
				case 0:
					res = await authAxios.get(`/stock/search/${symbol.value}`);

					queryResult.value = res.data.stocks;

					break;

				case 1:

					res = await authAxios.get(`/cryptocurrency/search/${symbol.value}`);

					queryResult.value = res.data.cryptocurrencies;

					break;

				default:

					break;
			}
		}
		catch (err)
		{
			console.error("Error fetching suggestions:", err);
			queryResult.value = [
			];
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
