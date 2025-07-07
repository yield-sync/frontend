<template>
	<VRow>
		<VCol v-if="loading" cols="12">
			<h3 class="text-center text-primary">Loading..</h3>
		</VCol>

		<VCol v-if="!loading && appStore.sectors" cols="12">
			<VRow class="my-2 mx-auto border border-success rounded-xl">
				<VCol cols="12">
					<h3 class="text-center text-success">Add Sector Allocation</h3>
				</VCol>
				<VCol cols="4">
					<v-select
						v-model="selectedSector"
						label="Select Sector"
						density="compact"
						:items="appStore.sectors || []"
						></v-select>
				</VCol>
				<VCol cols="4">
					<VTextField
						v-model="addSectorAllocation"
						@blur="() => {
							if (addSectorAllocation < 0) addSectorAllocation = 0;
							if (addSectorAllocation > 100) addSectorAllocation = 100;
						}"
						rounded="xl"
						label="Target %"
						variant="outlined"
						color="light"
						class="text-light"
						type="number"
						density="compact"
					>
						<template #prepend-inner>
							%
						</template>
					</VTextField>
				</VCol>
				<VCol cols="4">
					<VBtn
						color="success"
						rounded="xl"
						variant="outlined"
						icon="mdi-plus"
						:loading="loading"
						:disabled="loading"
						@click="createPortfolioAllocationSector"
						class="w-100"
						style="height: 40px;"
					>
						Add Sector
					</VBtn>
				</VCol>
			</VRow>
		</VCol>

		<VCol v-if="requestError" cols="12">
			<h3 class="text-center text-error">{{ requestError }}</h3>
		</VCol>

		<VCol cols="12" lg="6">
			<VRow class="mx-auto">
				<VCol cols="4">
					<h3 class="text-uppercase">Sector</h3>
				</VCol>

				<VCol cols="2">
					<h3 class="text-uppercase">Target Pct.</h3>
				</VCol>

				<VCol cols="2">
					<h3 class="text-uppercase">Actual Pct.</h3>
				</VCol>

				<VCol cols="2">
					<h3 class="text-uppercase">Difference</h3>
				</VCol>
			</VRow>

			<VRow v-for="sector, i in sectors" class="mx-auto">
				<VCol cols="4">
					<h3 class="text-light text-uppercase">{{ sector.sector }}</h3>
				</VCol>

				<VCol cols="2">
					<VTextField
						v-model="sectors[i].percent_allocation"
						@blur="() => {
							if (sectors.percent_allocation < 0) sectors.percent_allocation = 0;
							if (sectors.percent_allocation > 100) sectors.percent_allocation = 100;
						}"
						rounded="xl"
						label="Target %"
						variant="outlined"
						color="light"
						class="text-light"
						type="number"
						density="compact"
					>
						<template #prepend-inner>
							%
						</template>
					</VTextField>
				</VCol>

				<VCol cols="2">
					<h2
						:class="
							difference(
								props.sectorAllocations[sector.sector],
								sectors[i].percent_allocation
							) == 0 ? 'text-light' : 'text-error'
						"
					>
						{{ Number(props.sectorAllocations[sector.sector]) }}%
					</h2>
				</VCol>

				<VCol cols="2">
					<h2
						:class="
							difference(
								props.sectorAllocations[sector.sector],
								sectors[i].percent_allocation
							) == 0 ? 'text-light' : 'text-error'
						"
					>
						{{ difference(props.sectorAllocations[sector.sector], sectors[i].percent_allocation) }}%
					</h2>
				</VCol>

				<VCol cols="2">
					<VBtn
						@click="updatePortfolioAllocationSector(sector)"
						variant=flat
						color=warning
						class="w-100 rounded-xl"
					>
						Update
					</VBtn>
				</VCol>
			</VRow>
		</VCol>

		<VCol cols="12" lg="6">
			<h3 class="text-center">pie chart goes here</h3>
		</VCol>
	</VRow>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";

	import useAppStore from "@/stores/App";


	const appStore = useAppStore();

	const props = defineProps({
		portfolio_id: [
			String,
			Number,
		],
		sectorAllocations: {}
	});

	// UI
	const loading = ref(false);
	const requestError = ref("");

	const sectors = ref([
	]);

	// Addition stuff
	const selectedSector = ref(null);
	const addSectorAllocation = ref(0);


	const createPortfolioAllocationSector = async () => {
		if (!appStore.loggedIn) return;

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api/portfolio-allocation-sector/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		try
		{
			await authAxios.post("/create", {
				load: {
					portfolio_id: props.portfolio_id,
					percent_allocation: addSectorAllocation.value,
					sector: selectedSector.value,
				}
			});

			await getPortfolioAllocationSectors();
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	};

	const difference = (actual, target) => {
		if (actual === undefined || target === undefined) return 0;
		return Math.round((target - actual) * 100) / 100;
	};

	const getPortfolioAllocationSectors = async () => {
		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api/portfolio-allocation-sector/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		const response = await authAxios.get(`/${props.portfolio_id}`);

		sectors.value = response.data.portfolio_allocation_sector;

		loading.value = false;
	};

	const updatePortfolioAllocationSector = async (sector) => {
		if (!appStore.loggedIn) return;

		requestError.value = "";

		const authAxios = axios.create({
			baseURL: `${appStore.baseAPIURL}/api/portfolio-allocation-sector/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		try
		{
			await authAxios.put(`/update/${sector.portfolio_id}`, {
				load: {
					percent_allocation: sector.percent_allocation
				}
			});

			await getPortfolioAllocationSectors();
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	};

	onMounted(async () =>
	{
		if (!appStore.loggedIn) return;

		try
		{
			await getPortfolioAllocationSectors();
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
