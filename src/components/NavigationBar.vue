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
				<div style="position: relative; max-width: 600px;" class="mx-auto">
					<SearchBars/>
				</div>
			</VCol>

			<VCol cols="12" md="2" class="logout-col">
				<div v-if="!app.loggedIn" class="logout-container">
					<RouterLink to="/login">
						<VBtn color="primary" rounded elevation="0" class="w-100">Log In</VBtn>
					</RouterLink>
				</div>

				<div v-else class="logout-container">
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

<style scoped>
	.logout-col {
		text-align: right;
	}

	.logout-container {
		display: inline-block;
		width: 100%;
		max-width: 600px;
	}

	/* Center when column is full width (mobile) */
	@media (max-width: 959px) {
		.logout-col {
			text-align: center;
		}
	}
</style>
