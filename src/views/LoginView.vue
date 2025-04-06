<template>
	<VContainer>
		<VCard color="" elevation="0" class="mx-auto p-5" style="max-width: 360px;">
			<VCardTitle class="py-6 text-center">
				<h2 class="text-center text-uppercase text-dark">Login</h2>
			</VCardTitle>

			<VCardText>
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="email"
							label="Email"
							variant="outlined"
							hint="user@example.com"
						/>
					</VCol>

					<VCol cols="12">
						<VTextField
							v-model="password"
							type="password"
							label="Password"
							variant="outlined"
							hint="*****"
						/>
					</VCol>

					<VCol cols="12">
						<VBtn
							size="large"
							color="primary"
							class="w-100"
							rounded
							elevation="0"
							@click="handleLogin"
						>
							Login
						</VBtn>
					</VCol>

					<VCol v-if="loginError">
						<h3 class="text-center text-error">{{ loginError }}</h3>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<script setup>
	import { ref } from "vue";
	import axios from "axios";

	const email = ref("");
	const password = ref("");
	const loginError = ref("");

	const handleLogin = async () =>
	{
		try
		{
			let URL = "";

			if (import.meta.env.MODE === 'development') {
				URL = import.meta.env.VITE_DEV_SERVER_URL
			}

			const response = await axios.post(`${URL}/api/user/login`, {
				load: {
					email: email.value,
					password: password.value,
				}
			});

			loginError.value = "";
			console.log("Login successful:", response.data);
		}
		catch (error)
		{
			loginError.value = error.response?.data || error.message;
		}
	};
</script>
