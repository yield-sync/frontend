<template>
	<h1>Search results for: {{ query }}</h1>

	<hr class="my-3 border border-light">

	<div v-if="queryResult">
		<VRow>
			<VCol cols="2">
				<h3 class="text-primary">Symbol</h3>
			</VCol>

			<VCol cols="6">
				<h3 class="text-primary">Company Name</h3>
			</VCol>

			<VCol cols="2">
				<h3 class="text-primary">Exchange</h3>
			</VCol>

			<VCol cols="2">

			</VCol>
		</VRow>

		<div
			v-for="q in queryResult"
			:key="q.symbol"
			class="search-result-row"
			@click="handleSelect(q)"
		>
			<VRow>
				<VCol cols="2">
					<h3 class="text-light">{{ q.symbol }}</h3>
				</VCol>
				<VCol cols="6">
					<h3 class="text-light">{{ q.name }}</h3>
				</VCol>
				<VCol cols="2">
					<h3 class="text-light">{{ q.exchange }}</h3>
				</VCol>
				<VCol cols="2">
					<VBtn color="primary" variant="outlined" rounded class="w-100" @click=handleSelect(q)>View</VBtn>
				</VCol>
			</VRow>
		</div>
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

	const query = ref(route.params.query);
	const queryResult = ref();
	const requestError = ref("");
	const loading = ref(false);

	const URL = import.meta.env.MODE === "development"
		? import.meta.env.VITE_DEV_SERVER_URL
		: "";

	const search = async () => {
		try
		{
			const authAxios = axios.create({
				baseURL: `${URL}/api`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});

			const response = await authAxios.get(`/stock/search-external/${query.value}`);
			queryResult.value = response.data.stocks;
		}
		catch (error)
		{
			requestError.value = error.response.data;
		}
	};

	const handleSelect = (q) => {
		console.log("Selected stock:", q);
		// router.push(`/stock/${q.symbol}`);
	};

	onMounted(async () => {
		if (!app.loggedIn) return;

		requestError.value = null;
		queryResult.value = null;

		await search();
	});

	// 🔁 Watch route change
	watch(
		() => route.params.query,
		async (newQuery) => {
			query.value = newQuery;

			requestError.value = null;
			queryResult.value = null;

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
