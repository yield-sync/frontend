<template>
	<VContainer style="max-width: 600px;">
		<h2 v-if="loading" class="text-center text-primary">Loading..</h2>

		<div v-if="queryResult" class="mx-auto" >
			<h1 class="text-light">Search results for: {{ props.query }}</h1>

			<hr class="my-3 border border-light"/>

			<div
				v-for="q in queryResult"
				:key="q.symbol"
				class="search-result-row"
				@click="handleSelect(q)"
			>
				<VRow>
					<VCol cols="7">
						<h3 class="text-primary">{{ q.symbol }}</h3>

						<h5 class="text-light">{{ q.name }}</h5>
					</VCol>

					<VCol cols="3">
						<h3 class="text-light">{{ q.exchange }}</h3>
					</VCol>

					<VCol cols="2">
						<VBtn color="secondary" rounded class="w-100" @click="handleSelect(q)">View</VBtn>
					</VCol>
				</VRow>
			</div>
		</div>

		<h2 class="text-center text-error">{{ requestError }}</h2>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted, watch } from "vue";
	import { useRouter } from "vue-router";


	const router = useRouter();

	const props = defineProps({
		query: [
			String,
			Number,
		]
	});

	const queryResult = ref();
	const requestError = ref("");
	const loading = ref(false);

	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

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
			const response = await authAxios.post(
				"/cryptocurrency/search",
				{
					load: {
						query: props.query
					}
				}
			);

			queryResult.value = response.data.cryptocurrencies;
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}

		loading.value = false;
	};

	const handleSelect = (q) =>
	{
		router.push(`/cryptocurrency/${q.id}`);
	};

	onMounted(async () =>
	{
		requestError.value = null;
		queryResult.value = null;

		await search();
	});

	// 🔁 Watch props.query change
	watch(
		() =>
		{
			return props.query;
		},
		async () =>
		{
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
