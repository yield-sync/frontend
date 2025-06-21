<template>
	<VContainer style="max-width: 600px;">
		<VCard v-if="!loading" color="dark-light" class="mx-auto" rounded="xl"
			elevation="0">
			<VCardText>
				<VRow v-if="stockProfile">
					<VCol cols="12">
						<TradingViewWidgetCharting :symbol="stockProfile.symbol" class="w-100"/>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">ISIN</h3>

						<h3 class="text-light">{{ stockProfile.isin }}</h3>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">Exchange</h3>

						<h3 class="text-light">{{ stockProfile.exchange.toUpperCase() }}</h3>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">Sector</h3>

						<h3 class="text-light">{{ stockProfile.sector }}</h3>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">Industry</h3>

						<h3 class="text-light">{{ stockProfile.industry }}</h3>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">CEO</h3>

						<p>{{ stockProfile.ceo }}</p>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">Full Tile Employee</h3>

						<p>{{ stockProfile.full_time_employees }}</p>
					</VCol>

					<VCol cols="6">
						<h3>Address</h3>

						<p>
							{{ stockProfile.address }}
							{{ stockProfile.city }},
							{{ stockProfile.state }}
							{{ stockProfile.zip }}
							{{ stockProfile.country }}
						</p>
					</VCol>

					<VCol cols="6">
						<h3>IPO Date</h3>

						<p>
							{{ stockProfile.ipo_date }}
						</p>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">Website</h3>

						<a :href="stockProfile.website" target="_blank" style="text-decoration: none;">
							<span class="text-light">
								{{ stockProfile.website }}
							</span>
						</a>
					</VCol>

					<VCol cols="12">
						<h3 class="text-Primary">Description</h3>

						<p>{{ stockProfile.description }}</p>
					</VCol>

					<VCol  cols="6">
						<h3 class="text-Primary">Refreshed</h3>

						<h3 v-if="stockProfile.refreshed" class="text-success">Refreshed</h3>

						<h3 v-else class="text-light">Not Refreshed</h3>
					</VCol>

					<VCol cols="6">
						<h3 class="text-Primary">Price On Refresh</h3>

						<h3 class="text-light">{{ Number(stockProfile.price_on_refresh) }}</h3>
					</VCol>
				</VRow>

				<div v-else>
					<h2 class="text-center text-danger">Something went wrong with viewing stock</h2>
				</div>
			</VCardText>
		</VCard>

		<div v-else>
			<h2 class="text-center text-warning">Loading..</h2>
		</div>

		<h2 class="text-center text-error">{{ requestError }}</h2>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted, watch } from "vue";
	import { useRoute } from "vue-router";
	import useAppStore from "@/stores/App";
	import TradingViewWidgetCharting from "../tradingview-widgets/TradingViewWidgetCharting.vue";

	const route = useRoute();
	const appStore = useAppStore();

	const props = defineProps({
		symbol: [
			String,
			Number,
		]
	});

	const symbol = ref(props.symbol);
	const stockProfile = ref();
	const requestError = ref("");
	const loading = ref(true);


	const search = async () =>
	{
		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			const response = await authAxios.get(`/stock/read/${symbol.value}`);

			console.log(response);

			stockProfile.value = response.data.stock;
			stockProfile.value.refreshed = response.data.refreshed;
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}

		loading.value = false;
	};

	onMounted(async () =>
	{
		requestError.value = null;
		stockProfile.value = null;

		await search();
	});

	// 🔁 Watch route change
	watch(
		() =>
		{
			return route.params.symbol;
		},
		async (newSymbol) =>
		{
			symbol.value = newSymbol;

			requestError.value = null;
			stockProfile.value = null;

			await search();
		}
	);
</script>

<style lang="css">
	.search-result-row {
		cursor: pointer;
		transition: background-color 0.2s ease;
		padding: 8px;
		border-radius: 8px;
	}

	.search-result-row:hover {
		background-color: rgba(255, 255, 255, 0.1); /* subtle hover effect */
	}
</style>
