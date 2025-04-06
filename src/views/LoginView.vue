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

	const handleLogin = async () =>
	{
		try
		{
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/login`, {
				load: {
					email: email.value,
					password: password.value,
				}
			});

			console.log("Login successful:", response.data);
			// Handle successful login (e.g., store token, redirect, etc.)
		}
		catch (error)
		{
			console.error("Login failed:", error.response?.data || error.message);
			// Handle error (e.g., show message to user)
		}
	};
</script>
