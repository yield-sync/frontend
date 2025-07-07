<template>
	<VContainer>
		<VRow>
			<VCol
				order="1"
				order-sm="1"
				order-lg="1"
				cols="6"
				sm="6"
				lg="4"
			>
				<RouterLink to="/" class="text-decoration-none">
					<h2 class="text-bold">
						<span>
							<img src="../../public/favicon.png" style="height: 16px; margin-right: 8px;"/>
						</span>Yield Sync
					</h2>
				</RouterLink>
			</VCol>

			<VCol
				order="3"
				order-sm="3"
				order-lg="2"
				cols="12"
				sm="12"
				lg="4"
			>
				<SearchBars class="mx-auto" style="position: relative;"/>
			</VCol>

			<VCol
				order="2"
				order-sm="2"
				order-lg="3"
				cols="6"
				sm="6"
				lg="4"
				class="text-center text-md-right"
			>
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
					class="w-100 w-lg-auto"
					density="compact"
				>
					Log out
				</VBtn>
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
