<template>
	<VContainer style="max-width: 800px;">
		<div v-if="portfolio">
			<VCard
				width="100%"
				elevation="0"
				color="secondary"
			>
				<VCardTitle v-if="!updatePortfolioToggle">
					<VRow>
						<VCol cols="10">
							<h2 class="text-light">{{ portfolio.name }}</h2>
						</VCol>

						<VCol cols="2" class="d-flex justify-end">
							<VMenu location="bottom right">
								<template #activator="{ props }">
									<VBtn icon="mdi-dots-vertical" v-bind="props" variant="text" color="light" />
								</template>

								<VList bg-color="dark">
									<VListItem @click="updatePortfolioToggle = true">
										<VListItemTitle>Update Name</VListItemTitle>
									</VListItem>

									<VListItem @click="confirmDelete = true">
										<VListItemTitle class="text-error">Delete</VListItemTitle>
									</VListItem>
								</VList>
							</VMenu>
						</VCol>
					</VRow>
				</VCardTitle>

				<VCardText>
					<UpdateName
						v-if="updatePortfolioToggle"
						:id="id"
						:name="portfolio.name"
						:rules="[]"
						:loading="loading"
						@submit="onPortfolioNameUpdate"
						@cancel="updatePortfolioToggle = false"
					/>

					<hr class="border border-dark my-3">

					<VRow v-if="portfolioAssets.length > 0">
						<VCol v-for="a in portfolioAssets" :key="a.id" cols="12">
							<VRow>
								<VCol cols="6" lg="6">
									<h3 class="text-light">{{ a.stock_symbol }}{{ a.cryptocurrency_symbol }}</h3>
									<h5 class="text-light">{{ a.stock_name }}{{ a.cryptocurrency_name }}</h5>
								</VCol>

								<VCol cols="6" lg="6">
									<h3 class="text-right text-light">% {{ a.percent_allocation / 100 }}</h3>
								</VCol>
							</VRow>
						</VCol>
					</VRow>

					<div v-else>
						<h3 class="text-center text-light">No portfolio assets</h3>
					</div>
				</VCardText>
			</VCard>
		</div>

		<h3 v-if="requestError" class="text-center text-error">{{ requestError }}</h3>

		<VDialog v-model="confirmDelete" max-width="400">
			<VCard color="dark" border="warning">
				<VCardTitle class="text-center">
					Are you sure?
				</VCardTitle>

				<VCardText class="text-center">
					<p>This action cannot be undone.</p>
				</VCardText>

				<VCardActions class="justify-center">
					<VBtn color="light" variant="outlined" @click="confirmDelete = false">
						Cancel
					</VBtn>
					<VBtn color="danger" variant="flat" @click="onConfirmDelete">
						Yes, Delete
					</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";
	import UpdateName from "./UpdateName.vue";

	const props = defineProps({
		id: [String, Number]
	});

	const id = ref(props.id);
	const loading = ref(false);
	const updatePortfolioToggle = ref(false);
	const confirmDelete = ref(false);
	const portfolio = ref();
	const portfolioAssets = ref([]);
	const requestError = ref("");


	const router = useRouter();
	const app = useAppStore();


	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";


	const onConfirmDelete = async () => {
		confirmDelete.value = false;
		await deletePortfolio();
	};

	const getPortfolio = async () => {
		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio/`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		const response = await authAxios.get(`/${props.id}`);

		portfolio.value = response.data.portfolio;

		portfolioAssets.value = response.data.portfolioAssets;

		requestError.value = "";
	};

	const onPortfolioNameUpdate = async (newName) => {
		loading.value = true;

		try
		{
			const authAxios = axios.create({
				baseURL: `${URL}/api/portfolio/`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`
				}
			});

			await authAxios.post("/update", {
				load: {
					id: props.id,
					name: newName,
				}
			});

			requestError.value = "";

			await getPortfolio();

			updatePortfolioToggle.value = false;
		}
		catch (e)
		{
			console.error(e);
		}
		finally
		{
			loading.value = false;
		}
	};

	const deletePortfolio = async () => {
		try
		{
			if (!app.loggedIn)
			{
				return;
			}

			const authAxios = axios.create({
				baseURL: `${URL}/api/portfolio/`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`
				}
			});

			const response = await authAxios.delete(`/delete/${props.id}`);

			portfolio.value = response.data.portfolio;
			portfolioAssets.value = response.data.portfolioAssets;
			requestError.value = "";

			router.push("/");
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	};

	onMounted(async () =>
	{
		try
		{
			if (!app.loggedIn)
			{
				return;
			}

			await getPortfolio();
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
