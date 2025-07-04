<template>
	<div class="position-relative" ref="wrapperRef">
		<!-- Input field -->
		<VTextField
			v-model="query"
			@keydown.esc.prevent="hideSuggestions"
			@keydown.down.prevent="moveSelection(1)"
			@keydown.up.prevent="moveSelection(-1)"
			@keydown.enter.prevent="handleEnter"
			@input="fetchSuggestions"
			@update:modelValue="fetchSuggestions"
			variant="outlined"
			rounded="xl"
			label="Stock Symbol"
			append-inner-icon="mdi-magnify"
			ref="inputRef"
			hide-details
			density="compact"
			class="text-light"
		/>

		<h6 v-if="searchError" class="mt-5 text-center text-danger">{{ searchError }}</h6>

		<!-- Suggestions -->
		<div
			v-if="suggestions.length && isListVisible"
			class="position-absolute w-100 mt-3 bg-dark-light rounded text-light elevation-5"
			:style="{
				zIndex: 1000000,
				maxHeight: '200px',
				minHeight: '44px',
				overflowY: 'auto',
				top: `${inputHeight}px`
			}"
		>
			<VRow
				v-for="(a, i) in suggestions"
				:key="a.isin"
				class="w-100 m-0 px-2 py-2"
				no-gutters
				:class="{
					'bg-secondary text-light': i === selectedIndex || i === hoveredIndex
				}"
				@mouseenter="hoveredIndex = i"
				@mouseleave="hoveredIndex = null"
				@mousedown.prevent="navigateToStock(a.isin)"
			>
				<VCol cols="2" sm="2" md="3">
					<span class="text-primary">{{ a.symbol }}</span>
				</VCol>

				<VCol cols="10" sm="10" md="9">
					{{ a.name }}
				</VCol>
			</VRow>
		</div>
	</div>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted, onBeforeUnmount } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";

	const router = useRouter();
	const appStore = useAppStore();

	const query = ref("");
	const suggestions = ref([
	]);
	const searchError = ref("");

	const isListVisible = ref(true);
	const selectedIndex = ref(-1);
	const hoveredIndex = ref(null);
	const inputRef = ref(null);


	const authAxios = axios.create({
		baseURL: `${appStore.baseAPIURL}/api/stock`,
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

	function navigateToStock(isin)
	{
		router.push(`/stock/${isin}`);
		clearSearch();
	}

	async function fetchSuggestions()
	{
		searchError.value = "";

		if (!query.value || query.value.length < 1)
		{
			suggestions.value = [
			];
			return;
		}

		isListVisible.value = true;

		try
		{
			const res = await authAxios.get(`/search/${query.value}`);
			suggestions.value = res.data.stocks;
		}
		catch (error)
		{
			searchError.value = error?.response?.data?.message || "Failed to fetch suggestions.";
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

	async function handleEnter()
	{
		if (!query.value) return;

		if (selectedIndex.value === -1)
		{
			if (suggestions.value.length > 0 && suggestions.value[0].symbol.toUpperCase() == query.value.toUpperCase())
			{
				navigateToStock(suggestions.value[0].isin);
				return;
			}

			try
			{
				console.log(`Attempting to create stock with symbol "${query.value}" since nothing was found in DB..`);

				const res = await authAxios.post("/create-by-symbol", {
					load: {
						symbol: query.value
					},
				});

				if (res.status === 201)
				{
					navigateToStock(res.data.createdStock.isin);
				}
			}
			catch (error)
			{
				console.error("Error creating stock by symbol:", error);
				searchError.value = error?.response?.data?.message || "Creation failed.";
			}
		}
		else
		{
			const selected = suggestions.value[selectedIndex.value];
			if (selected) navigateToStock(selected.isin);
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
			hideSuggestions();
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
