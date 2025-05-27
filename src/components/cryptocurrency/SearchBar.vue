<template>
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
		label="Crypto Symbol"
		append-inner-icon="mdi-magnify"
		ref="inputRef"
		class="text-light"
	/>

	<h6 class="text-center text-danger">{{ searchError }}</h6>

	<div
		v-if="suggestions.length > 0 && isListVisible"
		class="position-absolute w-100 px-3 py-3 text-light border border-light bg-dark-light rounded"
		style="z-index: 10; max-height: 200px; overflow-y: auto;"
	>
		<VRow
			v-for="(a, i) in suggestions"
			:key="a.isin"
			:class="{
				'bg-secondary text-light': i === selectedIndex || i === hoveredIndex
			}"
			@mouseenter="hoveredIndex = i"
			@mouseleave="hoveredIndex = null"
			@mousedown.prevent="router.push(`/cryptocurrency/${a.id}`)"
		>
			<VCol sm="4" md="3" lg="2"><span class="text-primary">{{ a.symbol }}</span></VCol>

			<VCol sm="8" md="9" lg="10">{{ a.name }}</VCol>
		</VRow>
	</div>
</template>

<script setup>
	import axios from "axios";
	import { ref, watch, onMounted, onBeforeUnmount } from "vue";
	import { useRouter } from "vue-router";

	const router = useRouter();

	const isListVisible = ref(true);
	const inputRef = ref(null);
	const hoveredIndex = ref(null);
	const selectedIndex = ref(-1);
	const query = ref("");
	const searchError = ref("");

	const suggestions = ref([
	]);

	const apiUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";
	const authAxios = axios.create({
		baseURL: `${apiUrl}/api/cryptocurrency`,
		headers: {
			authorization: `Bearer ${localStorage.getItem("authToken")}`,
		},
	});


	const fetchSuggestions = async () =>
	{
		searchError.value = "";

		if (!query.value || query.value < 1)
		{
			suggestions.value = [
			];
			return;
		}

		isListVisible.value = true;

		try
		{
			const res = await authAxios.get(`/search/${query.value}`);

			suggestions.value = res.data.cryptocurrencies;
		}
		catch (err)
		{
			console.error("Error fetching suggestions:", err);
			searchError.value = error.response.data.message;

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

	const clearSearch = () =>
	{
		query.value = "";

		suggestions.value = [
		];

		selectedIndex.value = -1;

		isListVisible.value = false;
	};

	const handleEnter = async () =>
	{
		console.log(`SelectionIndex is ${selectedIndex.value}`);

		if (selectedIndex.value === -1)
		{
			console.log("Crypo selected so not going to search suggestion list for match to query");

			try
			{
				console.log(`Search cryptocurrency redirect for query ${query.value}..`);

				router.push(`/search-cryptocurrency/${query.value}`);

				clearSearch();
			}
			catch (error)
			{
				searchError.value = error.response.data.message;
			}
		}
		else if (query.value)
		{
			const selected = suggestions.value[selectedIndex.value];

			console.log(`Selection is ${selected.id} searching for query ${query.value}`);

			router.push(`/cryptocurrency/${selected.id}`);

			clearSearch();
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

	watch(query, (newVal, oldVal) =>
	{
		if (newVal && suggestions.value.includes(newVal))
		{
			router.push(`/cryptocurrency/${newVal}`);

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
