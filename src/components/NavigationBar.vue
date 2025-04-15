<template>
	<VContainer>
		<VRow>
			<VCol cols="12" sm="10">
				<RouterLink to="/" class="text-decoration-none">
					<h1>Yield Sync</h1>
				</RouterLink>
			</VCol>

			<VCol cols="12" sm="2">
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


<script lang="ts" setup>
	import { useRouter } from "vue-router";
	import useAppStore from "@/stores/App";

	const app = useAppStore();

	const router = useRouter();

	const logOut = async () =>
	{
		localStorage.removeItem("authToken");

		router.push("/login");

		app.setLoggedIn(false);
	};
</script>
