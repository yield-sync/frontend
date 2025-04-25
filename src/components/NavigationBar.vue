<template>
	<VContainer>
		<VRow>
			<VCol cols="12" sm="3">
				<RouterLink to="/" class="text-decoration-none">
					<h1>Yield Sync</h1>
				</RouterLink>
			</VCol>

			<VCol cols="12" sm="6">
				<VForm @submit.prevent="search" validate-on="submit lazy" ref="formRef">
					<VTextField
						v-model="query"
						:rules="rules"
						variant="outlined"
						color="light"
						density="compact"
						label="Ticker, Crypto, etc.."
						append-inner-icon="mdi-magnify"
						@click:append-inner="search"
						class="text-light mx-auto"
						style="max-width: 600px;"
					/>
				</VForm>
			</VCol>

			<VCol cols="12" sm="3">
				<RouterLink v-if="!app.loggedIn" to="/login">
					<VBtn color="primary" rounded elevation="0" class="w-100">Log In</VBtn>
				</RouterLink>

				<VBtn v-else @click="logOut"rounded color="secondary"
					elevation="0" class="w-100">
					Log out
				</VBtn>
			</VCol>
		</VRow>
	</VContainer>
</template>


<script setup>
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import useAppStore from "@/stores/App";

	const app = useAppStore();

	const router = useRouter();

	const query = ref("");


	const rules = [
		(value) =>
		{
			return !!value || "Query name is required";
		},
	];

	const search = async () =>
	{
		router.push(`/query/${query.value}`);
	};

	const logOut = async () =>
	{
		localStorage.removeItem("authToken");

		router.push("/login");

		app.setLoggedIn(false);
	};
</script>
