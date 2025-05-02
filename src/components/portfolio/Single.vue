<template>
	<VContainer>
		<div v-if="portfolio">
			<VCardTitle v-if="!updatePortfolioToggle">
				<VRow>
					<VCol cols="10">
						<h2 class="text-light">{{ portfolio.name }}</h2>
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
			</VCardTitle>

			<VCardText>
				<UpdateName
					v-if="updatePortfolioToggle"
					:id="id"
					:name="portfolio.name"
					:rules="[]"
					:loading="loading"
					@submit="onPortfolioNameUpdate"
					@cancel="updatePortfolioToggle = false"
				/>

				<VRow class="mt-4 mb-8">
					<VCol cols="12" md="3">
						<v-btn-toggle
							v-model="addAssetType"
							color="primary"
							variant="outlined"
							divided
							mandatory
							rounded="lg"
							class="w-100 text-light"
							border="light"
						>
							<v-btn class="w-50">Stock</v-btn>
							<v-btn class="w-50">Crypto</v-btn>
						</v-btn-toggle>
					</VCol>

					<VCol cols="12" sm="6" md="3">
						<VTextField
							v-model="symbol"
							color="primary"
							density="compact"
							rounded="lg"
							:label="addAssetType == 0 ? 'Stock Symbol' : 'Crypto Symbol'"
							variant="outlined"
							class="text-light"
						/>
					</VCol>

					<VCol cols="12" sm="6" md="3">
						<VTextField
							v-model="percentAllocation"
							density="compact"
							label="Target Pct. (0.01 - 100.00%)"
							variant="outlined"
							class="text-light"
							rounded="lg"
							type="number"
							:min=".01"
							:max="10000"
							@input="validateAllocation"
						/>
					</VCol>

					<VCol cols="12" md="3">
						<VBtn
							rounded="lg"
							variant="flat"
							color="success"
							class="w-100"
							@click="addPortfolioAsset"
						>
							+ Add Stock
						</VBtn>
					</VCol>
				</VRow>

				<div v-if="portfolioAssets.length > 0" v-for="(a, i) in portfolioAssets" :key="a.portfolio_asset_id">
					<VRow class="rounded-xl my-1 px-1 py-1" :class="i % 2 === 0 ? 'bg-dark-light' : ''">
						<VCol cols="12" xl="6">
							<VRow>
								<VCol cols="3" sm="2" lg="2" xl="2">
									<h4 class="mb-1 text-light">Symbol</h4>
									<h2 class="text-primary">{{ a.stock_symbol }}{{ a.cryptocurrency_symbol }}</h2>
								</VCol>

								<VCol cols="9" sm="5" lg="3" xl="4">
									<h4 class="mb-1 text-light">Company</h4>
									<h4 class="text-primary">{{ a.stock_name }}{{ a.cryptocurrency_name }}</h4>
								</VCol>

								<VCol cols="12" sm="4" lg="4" xl="4">
									<h4 class="mb-1 text-light">Sector - Industry</h4>
									<h4 class="text-primary">{{ a.sector }} - {{ a.industry }}</h4>
								</VCol>

								<VCol cols="12" lg="3" xl="2">
									<h4 class="mb-1 text-light">Portfolio Pct.</h4>
									<VSheet color="secondary" rounded="lg" class="px-2 py-2 text-dark">
										<h3 class="text-light">% {{ 0.00 }}</h3>
									</VSheet>
								</VCol>
							</VRow>
						</VCol>
						<VCol cols="12" sm="6" md="3" xl="2">
							<h4 class="mb-1 text-light">Target Pct. (100 = 1%)</h4>
							<VTextField
								v-model="a.percent_allocation"
								rounded="lg"
								variant="outlined"
								color="light"
								class="text-light"
								type="number"
								density="compact"
							></VTextField>
						</VCol>

						<VCol cols="12" sm="6" md="3" xl="2">
							<h4 class="mb-1 text-light">Balance</h4>
							<VTextField
								v-model="a.balance"
								rounded="lg"
								variant="outlined"
								color="light"
								class="text-light"
								type="number"
								density="compact"
							></VTextField>
						</VCol>

						<VCol cols="6" md="3" xl="1">
							<VBtn
								variant="flat"
								rounded="lg"
								color="warning"
								class="w-100 mt-6"
							>
								Update
							</VBtn>
						</VCol>

						<VCol cols="6" md="3" xl="1">
							<VBtn
								@click="() => {
									confirmDeletePortfolioAsset = true;
									assetToDeleteId = a.portfolio_asset_id
								}"
								variant="flat"
								rounded="lg"
								color="danger"
								class="w-100 mt-6"
							>
								✖
							</VBtn>
						</VCol>
					</VRow>
				</div>

				<div v-else class="py-8">
					<h3 class="text-center text-light">No portfolio assets</h3>
				</div>
			</VCardText>
		</div>

		<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>

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

	const percentAllocation = ref(10);

	const loading = ref(false);

	const confirmDeletePortfolioAsset = ref(false);
	const assetToDeleteId = ref(null);

	const updatePortfolioToggle = ref(false);
	const confirmDeletePortfolio = ref(false);
	const addAssetType = ref(0);
	const portfolio = ref();
	const portfolioAssets = ref([
		]);
	const symbol = ref("");
	const requestError = ref("");


	const router = useRouter();
	const app = useAppStore();


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const validateAllocation = () =>
	{
		if (percentAllocation.value < .01) percentAllocation.value = 0.01;
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
		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		const response = await authAxios.get(`/${props.id}`);

		portfolio.value = response.data.portfolio;

		portfolioAssets.value = response.data.portfolioAssets;
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

		requestError.value = "";

		let stockIsin = null;

		const authAxios = axios.create({
			baseURL: `${URL}/api`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			const response = await authAxios.get(`/stock/profile/${symbol.value}`);

			stockIsin = response.data.stock.isin;
		}
		catch (error)
		{
			requestError.value = error;
		}

		try
		{
			await authAxios.post("/portfolio-asset/create", {
				load: {
					portfolio_id: props.id,
					stock_isin: stockIsin,
					percent_allocation: percentAllocation.value * 100,
				}
			});
		}
		catch (error)
		{
			requestError.value = error.response.data;
		}

		symbol.value = "";

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
			requestError.value = error.response.data.message;
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
</style>
