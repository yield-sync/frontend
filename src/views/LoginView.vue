<template>
	<VContainer>
		<VCard color="dark" elevation="0" class="mx-auto p-5" style="max-width: 360px;">
			<VCardTitle class="py-6 text-center">
				<h2 class="text-center text-uppercase">Login</h2>
			</VCardTitle>

			<VCardText>
				<form @submit.prevent="handleLogin">
					<VRow>
						<VCol cols="12">
							<VTextField
								v-model="email"
								label="Email"
								variant="outlined"
								color="primary"
								hint="user@example.com"
								:disabled="loading"
							/>
						</VCol>

						<VCol cols="12">
							<VTextField
								v-model="password"
								type="password"
								label="Password"
								variant="outlined"
								color="primary"
								hint="*****"
								:disabled="loading"
							/>
						</VCol>

						<VCol cols="12">
							<VBtn
								type="submit"
								color="primary"
								class="w-100"
								rounded
								elevation="0"
								:disabled="loading"
							>
								<span v-if="!loading">Login</span>

								<span v-else>Loading...</span>
							</VBtn>
						</VCol>

						<VCol v-if="loginMessage">
							<h3 class="text-center text-success">{{ loginMessage }}</h3>
						</VCol>

						<VCol v-if="loginError">
							<h3 class="text-center text-error">{{ loginError }}</h3>
						</VCol>
					</VRow>
				</form>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<script setup>
	import axios from "axios";
	import { ref } from "vue";
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";

	const app = useAppStore();
	const router = useRouter();

	const email = ref("");
	const password = ref("");
	const loginMessage = ref("");
	const loginError = ref("");
	const loading = ref(false);

	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

	const handleLogin = async () =>
	{
		if (loading.value) return;

		loading.value = true;

		try
		{
			const response = await axios.post(`${URL}/api/user/login`, {
				load: {
					email: email.value,
					password: password.value,
				}
			});

			loginError.value = "";

			loginMessage.value = "Success!";
			console.log(response.data.token);


			localStorage.setItem("authToken",  response.data.token);

			app.setLoggedIn(true);

			await new Promise((resolve) => 
			{
				return setTimeout(resolve, 2000);
			});

			router.push("/");
		}
		catch (error)
		{
			loginError.value = error.response?.data || error.message;
		}
		finally
		{
			loading.value = false;
		}
	};
</script>
