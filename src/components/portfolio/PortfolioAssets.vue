<template>
	<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>

	<h3 v-if="portfolioAssets.length == 0" class="py-12 text-center text-light">No assets in portfolio</h3>

	<div
		v-if="portfolioAssets.length > 0"
		v-for="(a, i) in portfolioAssets"
		:key="a.portfolio_asset_id"
		id="asset-row"
		class="px-3 py-3 mb-3 rounded-xl border bg-dark"
	>
		<VRow id="asset-info">
			<VCol id="symbol-name-secotor-industry" cols="10">
				<h3 id="symbol-name-sector-industry"  class="text-secondary">
					<span v-if="a.isin" class="text-primary">
						[{{ a.stock_symbol }}] {{ stringShortener(a.stock_name, 35) }}
					</span>
					<span v-else class="text-primary">
						[{{ a.cryptocurrency_symbol }}] {{ stringShortener(a.cryptocurrency_name, 35) }}
					</span>
				</h3>
				<h6 id="symbol-name-sector-industry"  class="text-light">
					{{ stringShortener(`${a.sector} - ${a.industry}`, 100) }}
				</h6>
			</VCol>
			<VCol id="asset-percent" cols="2">
				<VBtn
					v-show="visibleAssetSettings.has(a.portfolio_asset_id)"
					@click="() => {
						confirmDeletePortfolioAsset = true;
						assetToDeleteId = a.portfolio_asset_id
					}"
					variant="outlined"
					color="danger"
					rounded="xl"
					density="compact"
					class="w-100"
				>
					✖
				</VBtn>
			</VCol>
			<VCol id="asset-percent" cols="3">
				<h3 class="text-center text-light">
					Target %
				</h3>
				<VSheet color="dark-light" rounded="xl" class="mt-1">
					<h3 class="text-center text-primary">
						% {{ a.percent_allocation }}
					</h3>
				</VSheet>
			</VCol>
			<VCol id="asset-price" cols="3">
				<h3 class="text-center text-light">
					Balance
				</h3>
				<VSheet color="dark-light" rounded="xl" class="mt-1">
					<h3 class="text-center text-primary">{{ a.balance }}</h3>
				</VSheet>
			</VCol>

			<VCol id="asset-price" cols="3">
				<h3 class="text-center text-light">
					Total Value
				</h3>
				<VSheet color="dark-light" rounded="xl" class="mt-1">
					<h3 class="text-center text-primary">$ {{ a.balance * a.stock_price }}</h3>
				</VSheet>
			</VCol>

			<VCol id="asset-percent" cols="3">
				<h3 class="text-center text-light">
					Actual %
				</h3>
				<VSheet color="dark-light" rounded="xl" class="mt-1">
					<h3 class="text-center text-primary">
						% {{ 0.00 }}
					</h3>
				</VSheet>
			</VCol>
		</VRow>

		<VRow>
			<VCol id="assets-settings-toggle" cols="12" class="text-center">
				<VBtn
					color="primary"
					:variant="visibleAssetSettings.has(a.portfolio_asset_id) ? 'flat': 'outlined'"
					@click="() => {
						if (visibleAssetSettings.has(a.portfolio_asset_id)) {
							visibleAssetSettings.delete(a.portfolio_asset_id)
						} else {
							visibleAssetSettings.add(a.portfolio_asset_id)
						}
					}"
					size="small"
					rounded
					class="w-100"
				>
					{{ visibleAssetSettings.has(a.portfolio_asset_id) ? 'Hide' : 'Show' }} Asset Settings
				</VBtn>
			</VCol>
			<VCol v-if="visibleAssetSettings.has(a.portfolio_asset_id)" id="assets-settings" cols="12">
				<VRow id="asset-target-&-ownership-delete">
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
							@click="updatePorfolioAsset(i) && visibleAssetSettings.delete(a.portfolio_asset_id)"
							variant="flat"
							rounded="xl"
							color="warning"
							class="w-100"
						>
							Update
						</VBtn>
					</VCol>
				</VRow>
			</VCol>
		</VRow>
	</div>

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
</template>

<script setup>
	import axios from "axios";
	import { ref } from "vue";

	import useAppStore from "@/stores/App";
	import ConfirmDialog from "./ConfirmDialog.vue";

	const props = defineProps({
		portfolioAssets: [
			Object,
		]
	});

	const emit = defineEmits(['assets-changed']);

	// UI
	const requestError = ref("");
	const visibleAssetSettings = ref(new Set())

	// Portfolio

	// Deleetion stuff
	const assetToDeleteId = ref(null);
	const confirmDeletePortfolioAsset = ref(false);

	const app = useAppStore();


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const stringShortener = (string, max = 10) => {
		return string.length > max ? string.slice(0, max) + ".." : string
	};

	const onConfirmDeletePortfolioAsset = async () =>
	{
		if (!assetToDeleteId.value) return;

		await deletePortfolioAsset(assetToDeleteId.value);

		confirmDeletePortfolioAsset.value = false;
		assetToDeleteId.value = null;

		emit('assets-changed');
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

		emit('assets-changed');
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
				`/update/${props.portfolioAssets.value[portfolioAssetsIndex].portfolio_asset_id}`,
				{
					load: {
						balance: props.portfolioAssets.value[portfolioAssetsIndex].balance,
						percent_allocation: props.portfolioAssets.value[portfolioAssetsIndex].percent_allocation,
					}
				}
			);
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}

		emit('assets-changed');
	};
</script>
