<template>
	<VContainer style="max-width: 600px;">
		<VRow>
			<VCol cols="8">
				<RouterLink to="/" class="text-decoration-none">
					<h2 class="text-bold">
						<span>
							<img src="../../public/favicon.png" style="height: 16px; margin-right: 8px;"/>
						</span>Yield Sync
					</h2>
				</RouterLink>
			</VCol>

			<VCol cols="4" class="text-center text-md-right">
				<RouterLink v-if="!app.loggedIn" to="/login">
					<VBtn
						color="secondary"
						rounded elevation="0"
						class="w-100"
						density="compact"
					>
						Log In
					</VBtn>
				</RouterLink>

				<VBtn
					v-else
					@click="logOut"
					rounded
					variant="flat"
					color="dark-light"
					elevation="0"
					class="w-100"
					density="compact"
				>
					Log out
				</VBtn>
			</VCol>

			<VCol cols="12">
				<SearchBars class="mx-auto" style="position: relative;"/>
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
