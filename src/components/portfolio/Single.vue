<template>
	<VContainer style="max-width: 800px;">
		<VRow v-if="portfolio">
			<VCol cols="12">
				<VCard
					v-if="!updatePortfolioToggle"
					class="mx-auto my-6 pa-6"
					width="100%"
					max-width="600"
					elevation="0"
					color="dark"
				>
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
				</VCard>

				<UpdateName
					v-else
					:id="id"
					:name="portfolio.name"
					:rules="[]"
					:loading="loading"
					@submit="onPortfolioNameUpdate"
					@cancel="updatePortfolioToggle = false"
				/>
			</VCol>

			<VCol cols="12">
				<VRow v-if="portfolioAssets.length > 0">
					<VCol cols="12">
						<VRow>
							<VCol cols="6" lg="6">
								<h4 class="text-bold text-primary">Symbol</h4>
							</VCol>

							<VCol cols="6" lg="6">
								<h4 class="text-bold text-primary">% Allocation</h4>
							</VCol>
						</VRow>
					</VCol>

					<VCol v-for="a in portfolioAssets" :key="a.id" cols="12">
						<VRow>
							<VCol cols="6" lg="6">
								<h2 class="text-light">{{ a.stock_symbol }}{{ a.cryptocurrency_symbol }}</h2>
								<h5 class="text-light">{{ a.stock_name }}{{ a.cryptocurrency_name }}</h5>
							</VCol>

							<VCol cols="6" lg="6">
								<h2 class="text-light">% {{ a.percent_allocation / 100 }}</h2>
							</VCol>
						</VRow>
					</VCol>
				</VRow>

				<div v-else>
					<h3 class="text-center text-light">No portfolio assets</h3>
				</div>
			</VCol>
		</VRow>

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
