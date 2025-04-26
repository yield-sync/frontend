<template>
	<VContainer>
		<VRow>
			<VCol cols="12" md="3">
				<RouterLink to="/" class="text-decoration-none">
					<h1>Yield Sync</h1>
				</RouterLink>
			</VCol>

			<VCol cols="12" md="7" />

			<VCol cols="12" md="2">
				<RouterLink v-if="!app.loggedIn" to="/login">
					<VBtn color="primary" rounded elevation="0" class="w-100">Log In</VBtn>
				</RouterLink>

				<VBtn v-else @click="logOut" rounded color="secondary" elevation="0" class="w-100">
					Log out
				</VBtn>
			</VCol>

			<VCol cols="12">
				<div style="position: relative; max-width: 600px;" class="mx-auto">
					<VTextField
						v-model="query"
						variant="outlined"
						density="compact"
						label="Ticker, Crypto, etc.."
						append-inner-icon="mdi-magnify"
						@keydown.down.prevent="moveSelection(1)"
						@keydown.up.prevent="moveSelection(-1)"
						@keydown.enter.prevent="handleEnter"
						@keydown.esc.prevent="isListVisible = false"
						@input="fetchSuggestions"
						@update:modelValue="fetchSuggestions"
						ref="inputRef"
						class="text-light"
					/>

					<VList
						v-if="suggestions.length > 0 && isListVisible"
						class="position-absolute w-100 text-light"
						variant="dark"
						bgColor="secondary"
						rounded
						style="z-index: 10; max-height: 200px; overflow-y: auto; color: black;"
					>
						<VListItem
							v-for="(stock, i) in suggestions"
							:key="stock.symbol"
							:class="{ 'bg-light text-secondary': i === selectedIndex }"
							@mousedown.prevent="viewStockProfile(stock.symbol)"
						>
							<VListItemTitle>{{ stock.symbol }} - {{ stock.name }}</VListItemTitle>
						</VListItem>
					</VList>
				</div>
			</VCol>
		</VRow>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, watch, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";


	const app = useAppStore();

	const router = useRouter();

	const loading = ref(false);
	const isListVisible = ref(true);
	const inputRef = ref(null);

	const selectedIndex = ref(-1);

	const query = ref("");

	const suggestions = ref([]);

	const apiUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const fetchSuggestions = async () => {
		if (!query.value || query.value < 1)
		{
			suggestions.value = [];
			return;
		}

		isListVisible.value = true;

		loading.value = true;

		try {

			const authAxios = axios.create({
				baseURL: `${apiUrl}/api`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});

			const res = await authAxios.get(`/stock/search/${query.value}`);

			suggestions.value = res.data.stocks;
		}
		catch (err)
		{
			console.error("Error fetching suggestions:", err);
			suggestions.value = [];
		}

		loading.value = false;
	};

	const moveSelection = (delta) => {
		if (!suggestions.value.length) return;

		const next = selectedIndex.value + delta;

		if (next < 0) {
			// Deselect list when moving up from first item
			selectedIndex.value = -1;
		}
		else if (next >= suggestions.value.length)
		{
			selectedIndex.value = 0;
		}
		else
		{
			selectedIndex.value = next;
		}
	};

	const handleEnter = () => {
		if (selectedIndex.value !== -1)
		{
			const selected = suggestions.value[selectedIndex.value];

			viewStockProfile(selected.symbol)
			return;
		}
		else if (query.value)
		{
			for (let i = 0; i < suggestions.value.length; i++)
			{
				if (suggestions.value[i].symbol.toLowerCase() === query.value.toLowerCase())
				{
					viewStockProfile(suggestions.value[i].symbol);
					return;
				}
			}

			router.push(`/query/${query.value}`);

			query.value = "";
			suggestions.value = [];
			selectedIndex.value = -1;
		}
	};

	const viewStockProfile = (symbol) => {
		router.push(`/stock/${symbol}`);

		query.value = "";

		suggestions.value = [];

		selectedIndex.value = -1;
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

	onMounted(() => {
		inputRef.value?.$el?.addEventListener("focus", () => {
			isListVisible.value = true;
		});
	});
</script>
