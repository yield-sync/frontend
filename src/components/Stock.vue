<template>
	<VRow v-if="stockProfileResult" class="mx-auto" style="max-width: 600px;">
		<VCol cols="12">
			<h1>{{ stockProfileResult.symbol }}</h1>

			<h2 class="text-light">{{ stockProfileResult.name }}</h2>
		</VCol>

		<VCol cols="6">
			<h3 class="text-Primary">Exchange</h3>

			<h3 class="text-light">{{ stockProfileResult.exchange }}</h3>
		</VCol>

		<VCol cols="6">
			<h3 class="text-Primary">ISIN</h3>

			<h3 class="text-light">{{ stockProfileResult.isin }}</h3>
		</VCol>

		<VCol cols="6">
			<h3 class="text-Primary">Sector</h3>

			<h3 class="text-light">{{ stockProfileResult.sector }}</h3>
		</VCol>

		<VCol cols="6">
			<h3 class="text-Primary">Industry</h3>

			<h3 class="text-light">{{ stockProfileResult.industry }}</h3>
		</VCol>
	</VRow>

	<h2 class="text-center text-error">{{ requestError }}</h2>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted, watch } from "vue";
	import { useRoute } from "vue-router";
	import useAppStore from "@/stores/App";

	const route = useRoute();
	const app = useAppStore();

	const props = defineProps({
		symbol: [
			String,
			Number,
		]
	});

	const symbol = ref(props.symbol);
	const stockProfileResult = ref();
	const requestError = ref("");
	const loading = ref(false);

	const URL = import.meta.env.MODE === "development"
		? import.meta.env.VITE_DEV_SERVER_URL
		: "";

	const search = async () =>
	{
		const authAxios = axios.create({
			baseURL: `${URL}/api`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			const response = await authAxios.get(`/stock/profile/${symbol.value}`);

			stockProfileResult.value = response.data.stock;
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	};

	onMounted(async () =>
	{
		requestError.value = null;
		stockProfileResult.value = null;

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
			stockProfileResult.value = null;

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
