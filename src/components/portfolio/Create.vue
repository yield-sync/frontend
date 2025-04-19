<template>
	<VRow v-if="app.loggedIn">
		<VCol cols="12">
			<h2 class="text-center">Create Portfolio</h2>
		</VCol>

		<VCol cols="12">
			<VSheet class="text-center" color="dark">
				<VForm @submit.prevent="createPortfolio" validate-on="submit lazy" ref="formRef">
					<VRow>
						<VCol cols="9">
							<VTextField
								v-model="portfolioName"
								:rules="rules"
								variant="outlined"
								color="success"
								label="Portfolio Name"
							/>
						</VCol>
						<VCol cols="3">
							<VBtn
								:loading="loading"
								color="success"
								variant="outlined"
								type="submit"
								class="w-100"
								style="height: 56px;"
							>
								+ Create
							</VBtn>
						</VCol>
					</VRow>
				</VForm>
			</VSheet>
		</VCol>

		<VCol cols="12">
			<h3 class="text-center text-error">{{ requestError }}</h3>
			<h3 class="text-center text-success" v-if="successMessage">{{ successMessage }}</h3>
		</VCol>
	</VRow>
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
		value => !!value || "Portfolio name is required",
		value => value.length <= 100 || "Name must be under 100 characters",
	];

	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

	const createPortfolio = async () => {
		requestError.value = "";
		successMessage.value = "";

		const form = formRef.value;
		const isValid = await form.validate();

		if (!isValid.valid) return;

		loading.value = true;

		try
		{
			const authAxios = axios.create({
				baseURL: `${URL}/api/portfolio`,
				headers: {
					authorization: `Bearer ${localStorage.getItem("authToken")}`
				}
			});

			await authAxios.post("/create", {
				load: {
					name: portfolioName.value,
				}
			});

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
