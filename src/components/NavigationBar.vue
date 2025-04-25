<template>
	<VContainer>
		<VRow>
			<VCol cols="12" sm="3">
				<RouterLink to="/" class="text-decoration-none">
					<h1>Yield Sync</h1>
				</RouterLink>
			</VCol>

			<VCol cols="12" sm="6">
				<VForm @submit.prevent="search" validate-on="submit lazy" ref="formRef">
					<VAutocomplete
						v-model="query"
						:items="suggestions"
						:loading="loading"
						:rules="rules"
						variant="outlined"
						color="light"
						density="compact"
						label="Ticker, Crypto, etc.."
						append-inner-icon="mdi-magnify"
						@click:append-inner="search"
						@update:search="fetchSuggestions"
						class="text-light mx-auto"
						style="max-width: 600px;"
						hide-no-data
						hide-details
						no-filter
					/>
				</VForm>
			</VCol>

			<VCol cols="12" sm="3">
				<RouterLink v-if="!app.loggedIn" to="/login">
					<VBtn color="primary" rounded elevation="0" class="w-100">Log In</VBtn>
				</RouterLink>

				<VBtn v-else @click="logOut" rounded color="secondary" elevation="0" class="w-100">
					Log out
				</VBtn>
			</VCol>
		</VRow>
	</VContainer>
</template>

<script setup>
	import { ref, watch } from "vue";
	import axios from "axios";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";

	const app = useAppStore();

	const router = useRouter();

	const query = ref("");
	const suggestions = ref([]);
	const loading = ref(false);

	const rules = [(value) => !!value || "Query name is required"];

	const URL = import.meta.env.MODE === "development"
		? import.meta.env.VITE_DEV_SERVER_URL
		: "";

	const fetchSuggestions = async (input) => {
		if (!input || input.length < 1) {
			suggestions.value = [];
			return;
		}

		loading.value = true;

		try {

			const authAxios = axios.create({
				baseURL: `${URL}/api`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});

			const res = await authAxios.get(`/stock/search/${input}`);

			console.log(res);

			suggestions.value = res.data?.stocks?.map((item) => item.symbol) ?? [];


		}
		catch (err)
		{
			console.error("Error fetching suggestions:", err);
			suggestions.value = [];
		}

		loading.value = false;
	};

	const search = async () => {
		if (!query.value) return;

		router.push(`/query/${query.value}`);

		query.value = "";
	};

	const logOut = async () =>
	{
		localStorage.removeItem("authToken");

		router.push("/login");

		app.setLoggedIn(false);
	};

	watch(query, (newVal, oldVal) =>
	{
		if (newVal && suggestions.value.includes(newVal))
		{
			router.push(`/stock/${newVal}`);
			query.value = "";
		}
	});
</script>
