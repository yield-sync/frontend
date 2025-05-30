<template>
	<VContainer>
		<VRow>
			<VCol cols="12" md="2">
				<RouterLink to="/" class="text-decoration-none">
					<h1 class="text-bold">
						<span>
							<img src="../../public/favicon.png" style="height: 22px; margin-right: 8px;"/>
						</span>YS
					</h1>
				</RouterLink>
			</VCol>

			<VCol cols="12" md="8">
				<div class="mx-auto" style="position: relative; max-width: 600px;">
					<SearchBars/>
				</div>
			</VCol>

			<VCol
				cols="12"
				md="2"
				class="text-center text-md-right"
			>
				<div class="mx-auto" style="max-width: 600px;">
					<RouterLink v-if="!app.loggedIn" to="/login">
						<VBtn color="primary" rounded elevation="0" class="w-100">Log In</VBtn>
					</RouterLink>

					<VBtn
						v-else
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
	import SearchBars from "./SearchBars.vue";


	const app = useAppStore();

	const router = useRouter();

	const logOut = async () =>
	{
		localStorage.removeItem("authToken");

		router.push("/login");

		app.setLoggedIn(false);
	};
</script>
