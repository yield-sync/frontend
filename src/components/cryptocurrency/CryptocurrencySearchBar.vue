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
		v-if="suggestions.length && isListVisible"
		class="position-absolute w-100 px-3 py-3 text-light border border-light bg-dark-light rounded"
		style="z-index: 10; max-height: 200px; overflow-y: auto;"
	>
		<VRow
			v-for="(item, index) in suggestions"
			:key="item.id"
			:class="{
				'bg-secondary text-light': index === selectedIndex || index === hoveredIndex
			}"
			@mouseenter="hoveredIndex = index"
			@mouseleave="hoveredIndex = null"
			@mousedown.prevent="navigateTo(`/cryptocurrency/${item.id}`)"
		>
			<VCol sm="4" md="3" lg="2">
				<span class="text-primary">{{ item.symbol }}</span>
			</VCol>

			<VCol sm="8" md="9" lg="10">{{ item.name }}</VCol>
		</VRow>
	</div>
</template>

<script setup>
	import { ref, watch, onMounted, onBeforeUnmount } from "vue";
	import { useRouter } from "vue-router";
	import axios from "axios";

	const router = useRouter();

	const query = ref("");
	const suggestions = ref([
	]);

	const searchError = ref("");
	const selectedIndex = ref(-1);
	const hoveredIndex = ref(null);
	const isListVisible = ref(true);
	const inputRef = ref(null);

	const apiUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

	const authAxios = axios.create({
		baseURL: `${apiUrl}/api/cryptocurrency`,
		headers: {
			authorization: `Bearer ${localStorage.getItem("authToken")}`,
		},
	});

	function hideSuggestions()
	{
		isListVisible.value = false;
	}

	function clearSearch()
	{
		query.value = "";
		suggestions.value = [
		];
		selectedIndex.value = -1;

		hideSuggestions();
	}

	async function fetchSuggestions()
	{
		searchError.value = "";

		if (!query.value?.length)
		{
			suggestions.value = [
			];
			return;
		}

		isListVisible.value = true;

		try
		{
			const { data } = await authAxios.get(`/search/${query.value}`);
			suggestions.value = data.cryptocurrencies;
		}
		catch (err)
		{
			console.error("Error fetching suggestions:", err);
			searchError.value = err?.response?.data?.message || "Something went wrong.";
			suggestions.value = [
			];
		}
	}

	function moveSelection(delta)
	{
		if (!suggestions.value.length) return;

		const nextIndex = selectedIndex.value + delta;

		if (nextIndex < 0)
		{
			selectedIndex.value = -1;
		}
		else
		{
			selectedIndex.value = nextIndex % suggestions.value.length;
		}
	}

	function navigateTo(path)
	{
		router.push(path);
		clearSearch();
	}

	async function handleEnter()
	{
		if (selectedIndex.value === -1)
		{
			// No selection; go to search page for raw query
			if (query.value.trim())
			{
				navigateTo(`/search-cryptocurrency/${query.value.trim()}`);
			}
		}
		else
		{
			// Navigate to selected cryptocurrency
			const selected = suggestions.value[selectedIndex.value];
			if (selected)
			{
				navigateTo(`/cryptocurrency/${selected.id}`);
			}
		}
	}

	function handleClickOutside(event)
	{
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
	}

	onMounted(() =>
	{
		document.addEventListener("click", handleClickOutside);
		inputRef.value?.$el?.addEventListener("focus", () =>
		{
			isListVisible.value = true;
		});
	});

	onBeforeUnmount(() =>
	{
		document.removeEventListener("click", handleClickOutside);
	});
</script>
