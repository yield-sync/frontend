<template>
	<div v-if="!loading">
		<VRow v-if="cryptocurrencyProfileResult" class="mx-auto" style="max-width: 600px;">
			<VCol cols="6">
				<h1>{{ cryptocurrencyProfileResult.symbol }}</h1>

				<h2 class="text-light">{{ cryptocurrencyProfileResult.name }}</h2>
			</VCol>

			<VCol cols="6">
				<h3 class="text-Primary">ID</h3>

				<h3 class="text-light">{{ cryptocurrencyProfileResult.id }}</h3>
			</VCol>
		</VRow>

		<div v-else>
			<h2 class="text-center text-danger">Something went wrong with viewing cryptocurrency</h2>
		</div>
	</div>

	<div v-else>
		<h2 class="text-center text-warning">Loading..</h2>
	</div>

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
	const cryptocurrencyProfileResult = ref();
	const requestError = ref("");
	const loading = ref(true);

	const URL = import.meta.env.MODE === "development"
		? import.meta.env.VITE_DEV_SERVER_URL
		: "";

	const search = async () =>
	{
		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${URL}/api`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		try
		{
			const response = await authAxios.get(`/cryptocurrency/read/${symbol.value}`);

			console.log(response);

			cryptocurrencyProfileResult.value = response.data.cryptocurrency;
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
		cryptocurrencyProfileResult.value = null;

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
			cryptocurrencyProfileResult.value = null;

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
