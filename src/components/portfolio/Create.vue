<template>
	<VSheet v-if="app.loggedIn" class="text-center" color="dark">
		<VForm @submit.prevent="createPortfolio" validate-on="submit lazy" ref="formRef">
			<VRow>
				<VCol cols="8">
					<VTextField
						v-model="portfolioName"
						:rules="rules"
						rounded="lg"
						variant="outlined"
						color="success"
						label="Portfolio Name"
					/>
				</VCol>

				<VCol cols="4">
					<VBtn
						:loading="loading"
						rounded="lg"
						color="success"
						variant="flat"
						type="submit"
						elevation="0"
						class="w-100"
						style="height: 56px;"
					>
						Create Portfolio
					</VBtn>
				</VCol>
			</VRow>
		</VForm>
	</VSheet>

	<h3 class="text-center text-error">{{ requestError }}</h3>

	<h3 class="text-center text-success" v-if="successMessage">{{ successMessage }}</h3>

</template>

<script setup>
	import { ref } from "vue";
	import axios from "axios";

	import useAppStore from "@/stores/App";

	const app = useAppStore();

	const portfolioName = ref("");
	const requestError = ref("");
	const successMessage = ref("");
	const loading = ref(false);
	const formRef = ref(null);

	const rules = [
		(value) =>
		{
			return !!value || "Portfolio name is required";
		},
		(value) =>
		{
			return value.length <= 100 || "Name must be under 100 characters";
		},
	];

	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

	const createPortfolio = async () =>
	{
		if (!app.loggedIn) return;

		requestError.value = "";
		successMessage.value = "";

		const form = formRef.value;
		const isValid = await form.validate();

		if (!isValid.valid) return;

		loading.value = true;

		const authAxios = axios.create({
			baseURL: `${URL}/api/portfolio`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`
			}
		});

		try
		{
			await authAxios.post("/create", {
				load: {
					name: portfolioName.value,
				}
			});

			await app.getPortfolios();

			successMessage.value = "Portfolio created successfully!";
			portfolioName.value = "";

			// TODO: Force the portfolio list to update in the portfolio "All" component. The data should be centralized
			// in a store.
		}
		catch (error)
		{
			requestError.value = error.response?.data?.message || "Failed to create portfolio.";
		}
		finally
		{
			loading.value = false;
		}
	};
</script>
