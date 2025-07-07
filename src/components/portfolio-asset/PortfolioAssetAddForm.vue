<template>

	<div class="px-5 py-5 mb-3 rounded-xl bg-dark">
		<VBtn
			@click="showAddAsset = !showAddAsset"
			color="success"
			variant="outlined"
			size="small"
			rounded
		>
			Show Add Asset
		</VBtn>

		<VRow id="add-asset" class="mt-5" :class="showAddAsset ? '' : 'd-none'">
			<VCol cols="4">
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
			</VCol>

			<VCol cols="4">
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
			</VCol>

			<VCol cols="4">
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

				<h6 v-if="requestError" class="text-danger">{{ requestError }}</h6>
			</VCol>
		</VRow>
	</div>
</template>

<script setup>
	import axios from "axios";
	import { ref } from "vue";

	import useAppStore from "@/stores/App";

	const props = defineProps({
		id: [
			String,
			Number,
		]
	});

	const emit = defineEmits([
		"asset-added",
	]);

	const id = ref(props.id);

	// UI
	const loading = ref(false);
	const showAddAsset = ref(false);
	const requestError = ref("");

	// Add Portfolio Asset
	const addAssetType = ref(0);
	const symbol = ref("");
	const percentAllocation = ref(10);
	const balance = ref(0);
	const queryResult = ref([
	]);
	const selectedSuggestionIndex = ref(-1);

	const appStore = useAppStore();


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
		if (percentAllocation.value < 0) percentAllocation.value = 0.00;
		if (percentAllocation.value > 100) percentAllocation.value = 100;
	};

	const addPortfolioAsset = async () =>
	{
		if (!appStore.loggedIn) return;

		if (!selectedSuggestionIndex.value === -1)
		{
			requestError.value = "No selection made!";

			return;
		}

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api/portfolio-asset`,
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

			emit("asset-added");
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	};

	const fetchSuggestions = async () =>
	{
		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api`,
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
