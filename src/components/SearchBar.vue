<template>
	<VBtnToggle
		v-model="searchAssetType"
		color="primary"
		variant="outlined"
		divided
		mandatory
		rounded="lg"
		class="w-100 mb-6 text-light"
		border="light"
	>
		<VBtn class="w-50">Stock</VBtn>

		<VBtn class="w-50">Crypto</VBtn>
	</VBtnToggle>

	<VTextField
		v-model="query"
		@keydown.esc.prevent="isListVisible = false"
		@keydown.down.prevent="moveSelection(1)"
		@keydown.up.prevent="moveSelection(-1)"
		@keydown.enter.prevent="handleEnter"
		@input="fetchSuggestions"
		@update:modelValue="fetchSuggestions"
		variant="outlined"
		rounded="xl"
		label="Stock or Crypto Symbol"
		append-inner-icon="mdi-magnify"
		ref="inputRef"
		class="text-light"
	/>

	<div
		v-if="suggestions.length > 0 && isListVisible"
		class="position-absolute w-100 px-3 py-3 text-light border border-light bg-dark-light rounded"
		style="z-index: 10; max-height: 200px; overflow-y: auto;"
	>
		<VRow
			v-for="(stock, i) in suggestions"
			:key="stock.isin"
			:class="{
				'bg-secondary text-light': i === selectedIndex || i === hoveredIndex
			}"
			@mouseenter="hoveredIndex = i"
			@mouseleave="hoveredIndex = null"
			@mousedown.prevent="viewStockProfile(stock.isin)"
		>
			<VCol sm="4" md="3" lg="2"><span class="text-primary">{{ stock.symbol }}</span></VCol>
			<VCol sm="8" md="9" lg="10">{{ stock.name }}</VCol>
		</VRow>
	</div>
</template>

<script setup>
	import axios from "axios";
	import { ref, watch, onMounted, onBeforeUnmount } from "vue";
	import { useRouter } from "vue-router";

	const router = useRouter();

	const searchAssetType = ref(0);
	const isListVisible = ref(true);
	const inputRef = ref(null);
	const hoveredIndex = ref(null);
	const selectedIndex = ref(-1);
	const query = ref("");
	const suggestions = ref([
	]);

	const apiUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";
	const authAxios = axios.create({
		baseURL: `${apiUrl}/api`,
		headers: {
			authorization: `Bearer ${localStorage.getItem("authToken")}`,
		},
	});


	const fetchSuggestions = async () =>
	{
		if (!query.value || query.value < 1)
		{
			suggestions.value = [
			];
			return;
		}

		isListVisible.value = true;

		try
		{
			const res = await authAxios.get(`/stock/search/${query.value}`);

			suggestions.value = res.data.stocks;
		}
		catch (err)
		{
			console.error("Error fetching suggestions:", err);
			suggestions.value = [
			];
		}
	};

	const moveSelection = (delta) =>
	{
		if (!suggestions.value.length) return;

		const next = selectedIndex.value + delta;

		if (next < 0)
		{
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

	const handleEnter = async () =>
	{
		if (selectedIndex.value !== -1)
		{
			const selected = suggestions.value[selectedIndex.value];

			viewStockProfile(selected.isin);

			return;
		}
		else if (query.value)
		{
			for (let i = 0; i < suggestions.value.length; i++)
			{
				if (suggestions.value[i].symbol.toLowerCase() === query.value.toLowerCase())
				{
					viewStockProfile(suggestions.value[i].isin);
					return;
				}
			}

			try
			{
				const response = await authAxios.post("/stock/create-by-symbol", {
					load: {
						symbol: query.value
					}
				});

				if (response.status == 201)
				{
					viewStockProfile(response.data.createdStock.isin);
				}

			}
			catch (error)
			{
				console.error("Error creating stock by symbol:", error);
			}

			query.value = "";

			suggestions.value = [
			];

			selectedIndex.value = -1;
		}
	};

	const handleClickOutside = (event) =>
	{
		if (!inputRef.value) return;

		// Check if the click was inside the input or the list
		const inputEl = inputRef.value?.$el || inputRef.value;
		const listEl = inputEl?.nextElementSibling;

		if (
			inputEl &&
			!inputEl.contains(event.target) &&
			listEl &&
			!listEl.contains(event.target)
		)
		{
			isListVisible.value = false;
		}
	};

	const viewStockProfile = (isin) =>
	{
		router.push(`/stock/${isin}`);

		query.value = "";

		suggestions.value = [
		];

		selectedIndex.value = -1;
	};


	watch(query, (newVal, oldVal) =>
	{
		if (newVal && suggestions.value.includes(newVal))
		{
			router.push(`/stock/${newVal}`);
			query.value = "";
		}
	});

	onBeforeUnmount(() =>
	{
		document.removeEventListener("click", handleClickOutside);
	});

	onMounted(() =>
	{
		document.addEventListener("click", handleClickOutside);

		inputRef.value?.$el?.addEventListener("focus", () =>
		{
			isListVisible.value = true;
		});
	});
</script>
