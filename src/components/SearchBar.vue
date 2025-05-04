<template>
	<VTextField
		v-model="query"
		variant="outlined"
		rounded="xl"
		label="Stock or Crypto Symbol"
		append-inner-icon="mdi-magnify"
		@keydown.esc.prevent="isListVisible = false"
		@keydown.down.prevent="moveSelection(1)"
		@keydown.up.prevent="moveSelection(-1)"
		@keydown.enter.prevent="handleEnter"
		@input="fetchSuggestions"
		@update:modelValue="fetchSuggestions"
		ref="inputRef"
		class="text-light"
	/>

	<VList
		v-if="suggestions.length > 0 && isListVisible"
		class="position-absolute w-100 text-light border border-dark"
		bgColor="dark-light"
		rounded
		style="z-index: 10; max-height: 200px; overflow-y: auto;"
	>
		<VListItem
			v-for="(stock, i) in suggestions"
			:key="stock.symbol"
			:class="{
				'bg-secondary text-light': i === selectedIndex || i === hoveredIndex
			}"
			@mouseenter="hoveredIndex = i"
			@mouseleave="hoveredIndex = null"
			@mousedown.prevent="viewStockProfile(stock.symbol)"
		>
			<VListItemTitle>{{ stock.symbol }} - {{ stock.name }}</VListItemTitle>
		</VListItem>
	</VList>
</template>

<script setup>
	import axios from "axios";
	import { ref, watch, onMounted, onBeforeUnmount } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";


	const app = useAppStore();

	const router = useRouter();

	const loading = ref(false);
	const isListVisible = ref(true);
	const inputRef = ref(null);
	const hoveredIndex = ref(null);

	const selectedIndex = ref(-1);

	const query = ref("");

	const suggestions = ref([
	]);

	const apiUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const fetchSuggestions = async () =>
	{
		if (!query.value || query.value < 1)
		{
			suggestions.value = [
			];
			return;
		}

		isListVisible.value = true;

		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${apiUrl}/api`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

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

		loading.value = false;
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

	const handleEnter = () =>
	{
		if (selectedIndex.value !== -1)
		{
			const selected = suggestions.value[selectedIndex.value];

			viewStockProfile(selected.symbol);

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

			router.push("/");

			router.push(`/query/${query.value}`);

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

	const viewStockProfile = (symbol) =>
	{
		router.push(`/stock/${symbol}`);

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
