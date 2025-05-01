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

								<VListItem @click="confirmDelete = true">
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

				<hr class="border border-secondary my-8"/>

				<VRow>
					<VCol cols="12" md="3">
						<v-btn-toggle
							v-model="addAssetType"
							color="primary"
							variant="outlined"
							divided
							mandatory
							class="w-100 text-light"
						>
							<v-btn class="w-50">
							Stock
							</v-btn>

							<v-btn class="w-50">
							Crypto
							</v-btn>
						</v-btn-toggle>
					</VCol>

					<VCol cols="12" sm="6" md="3">
						<VTextField
							v-model="symbol"
							color="primary"
							density="compact"
							label="Symbol"
							variant="outlined"
							class="text-light"
						/>
					</VCol>

					<VCol cols="12" sm="6" md="3">
						<VTextField
							v-model="percentAllocation"
							density="compact"
							label="Target Allocation (0.01 - 100.00%)"
							variant="outlined"
							class="text-light"
							type="number"
							:min=".01"
							:max="10000"
							@input="validateAllocation"
						/>
					</VCol>

					<VCol cols="12" md="3">
						<VBtn variant="outlined" rounded color="success" class="w-100"
							@click="addPortfolioAsset">
							+ Add Stock
						</VBtn>
					</VCol>
				</VRow>

				<hr class="border border-secondary my-8"/>

				<div v-if="portfolioAssets.length > 0" v-for="a in portfolioAssets" :key="a.portfolio_asset_id">
					<VRow>
						<VCol cols="2" sm="2" md="2" lg="1">
							<h4 class="mb-1 text-light">Symbol</h4>
							<h2 class="text-primary">{{ a.stock_symbol }}{{ a.cryptocurrency_symbol }}</h2>
						</VCol>

						<VCol cols="4" sm="4" md="4" lg="2">
							<h4 class="mb-1 text-light">Company</h4>
							<h3 class="text-primary">{{ a.stock_name }}{{ a.cryptocurrency_name }}</h3>
						</VCol>

						<VCol cols="6" sm="6" md="6" lg="3">
							<h4 class="mb-1 text-light">Sector - Industry</h4>
							<h3 class="text-primary">{{ a.sector }} - {{ a.industry }}</h3>
						</VCol>

						<VCol cols="12" lg="1">
							<h4 class="mb-1 text-light">Target Pct.</h4>
							<VSheet color="light" rounded class="px-2 py-2">
								<h3 class="text-dark">% {{ a.percent_allocation / 100 }}</h3>
							</VSheet>
						</VCol>

						<VCol cols="12" lg="1">
							<h4 class="mb-1 text-light">Pct.</h4>
							<VSheet color="light" rounded class="px-2 py-2 text-dark">
								<h3 class="text-dark">% {{ 0.00 }}</h3>
							</VSheet>
						</VCol>

						<VCol cols="12" lg="2">
							<h4 class="mb-1 text-light">Balance</h4>
							<VSheet color="secondary" rounded class="px-2 py-2 text-light">
								0.00
							</VSheet>
						</VCol>

						<VCol cols="6" sm="6" lg="1">
							<VBtn
								variant="outlined"
								color="warning"
								rounded
								class="w-100 mt-6"
							>
								Update
							</VBtn>
						</VCol>

						<VCol cols="6" sm="6" lg="1">
							<VBtn
								@click="removePortfolioAsset(a.portfolio_asset_id)"
								variant="outlined"
								color="danger"
								rounded
								class="w-100 mt-6"
							>
								✖
							</VBtn>
						</VCol>
					</VRow>

					<hr class="border border-secondary my-5"/>
				</div>

				<div v-else class="py-8">
					<h3 class="text-center text-light">No portfolio assets</h3>
				</div>
			</VCardText>
		</div>

		<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>

		<VDialog v-model="confirmDelete" max-width="400">
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

					<VBtn color="danger" variant="flat" @click="onConfirmDelete">
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
	const updatePortfolioToggle = ref(false);
	const confirmDelete = ref(false);
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

	const onConfirmDelete = async () =>
	{
		confirmDelete.value = false;
		await deletePortfolio();
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

	const removePortfolioAsset = async (portfolio_asset_id) =>
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
