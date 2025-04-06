<template>
	<VContainer>

		<VCard color="" elevation="0" class="mx-auto p-5" style="max-width: 360px;">
			<VCardTitle class="py-6 text-center">
				<h2 class="text-center text-uppercase text-dark">
					Login
				</h2>
			</VCardTitle>

			<VCardText>
				<VRow>
					<VCol cols="12">
						<VTextField
							v-model="email"
							label="Email"
							variant="outlined"
							hint="user@example.com"
							class=""
						></VTextField>
					</VCol>
					<VCol cols="12">
						<VTextField
							v-model="password"
							:type="'password'"
							label="Password"
							variant="outlined"
							hint="*****"
						></VTextField>
					</VCol>

					<VCol cols="12">
						<VBtn size="large" color="primary" class="w-100" rounded elevation="0">Login</VBtn>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<script setup>
	import { ref } from "vue";
	const email = ref();
	const password = ref();
</script>
