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

				<hr class="border border-light my-8"/>

				<VRow>
					<VCol cols="12" sm="6" md="4" lg="4">
						<VTextField
							v-model="symbol"
							density="compact"
							label="Stock Symbol"
							variant="outlined"
							class="text-light"
						/>
					</VCol>

					<VCol cols="12" sm="6" md="4" lg="4">
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

					<VCol cols="12" sm="6" md="4" lg="4">
						<VBtn variant="outlined" rounded color="success" class="w-100"
							@click="addPortfolioAsset">
							+ Add Stock
						</VBtn>
					</VCol>
				</VRow>

				<VRow>
					<VCol cols="6" sm="6" md="4" lg="2">
						<h3 class="text-primary">Stock</h3>
					</VCol>

					<VCol cols="6" sm="6" md="4" lg="2">
						<h3 class="text-primary">Sector - Industry</h3>
					</VCol>

					<VCol cols="6" sm="6" md="4" lg="2">
						<h3 class="text-primary">Target Allocation</h3>
					</VCol>

					<VCol cols="6" sm="6" md="4" lg="2">
						<h3 class="text-primary">Allocation</h3>
					</VCol>

					<VCol cols="6" sm="6" md="4" lg="2">
						<h3 class="text-primary">Balance</h3>
					</VCol>

					<VCol cols="6" sm="6" md="4" lg="2"/>
				</VRow>

				<div v-if="portfolioAssets.length > 0" v-for="a in portfolioAssets" :key="a.portfolio_asset_id">
					<VRow>
						<VCol cols="6" sm="6" md="4" lg="2">
							<h3 class="text-light">{{ a.stock_symbol }}{{ a.cryptocurrency_symbol }}</h3>

							<h5 class="text-light">{{ a.stock_name }}{{ a.cryptocurrency_name }}</h5>
						</VCol>

						<VCol cols="6" sm="6" md="4" lg="2">
							<h5 class="text-light">{{ a.sector }} - {{ a.industry }}</h5>
						</VCol>

						<VCol cols="6" sm="6" md="4" lg="2">
							<VSheet color="secondary" rounded class="px-2 py-2 text-white">
								% {{ a.percent_allocation / 100 }}
							</VSheet>
						</VCol>

						<VCol cols="6" sm="6" md="4" lg="2">
							<VSheet color="secondary" rounded class="px-2 py-2 text-white">
								% {{ 0.00 }}
							</VSheet>
						</VCol>

						<VCol cols="6" sm="6" md="4" lg="2">
							<VSheet color="secondary" rounded class="px-2 py-2 text-white">
								0.00
							</VSheet>
						</VCol>

						<VCol cols="6" sm="6" md="4" lg="2">
							<VBtn
								@click="removePortfolioAsset(a.portfolio_asset_id)"
								variant="flat"
								rounded color="danger"
								class="w-100"
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
