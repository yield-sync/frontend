<template>
	<VContainer>
		<VRow>
			<VCol cols="12" md="2" lg="2">
				<RouterLink to="/" class="text-decoration-none">
					<h1 class="text-bold">Yield Sync</h1>
				</RouterLink>
			</VCol>

			<VCol cols="12" md="8" lg="8">
				<div style="position: relative; max-width: 600px;" class="mx-auto">
					<SearchBar/>
				</div>
			</VCol>

			<VCol cols="12" md="2" lg="2" class="text-center">
				<div v-if="!app.loggedIn" class="mx-auto">
					<RouterLink to="/login">
						<VBtn color="primary" rounded elevation="0" class="w-100">Log In</VBtn>
					</RouterLink>
				</div>

				<div v-else class="w-100 mx-auto-md">
					<VBtn
						@click="logOut"
						rounded
						color="secondary"
						elevation="0"
						class="w-100"
					>
						Log out
					</VBtn>
				</div>
			</VCol>
		</VRow>
	</VContainer>
</template>

<script setup>
	import { useRouter } from "vue-router";

	import useAppStore from "@/stores/App";
	import SearchBar from "./SearchBar.vue";


	const app = useAppStore();

	const router = useRouter();

	const logOut = async () =>
	{
		localStorage.removeItem("authToken");

		router.push("/login");

		app.setLoggedIn(false);
	};
</script>
