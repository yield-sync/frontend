<template>
	<VContainer v-if="app.loggedIn">
		<h4 class="mb-6 text-center text-light">Your Portfolios</h4>

		<VRow v-if="!requestError">
			<VCol v-if="app.portfolios.length > 0" v-for="p in app.portfolios" :key="p.id" cols="12">
				<VCard @click="router.push(`/portfolio/${p.id}`)" color="dark-light" elevation="0">
					<VCardTitle class="py-6 text-center">
						<h3 class="text-center text-uppercase text-primary text-bold">{{ p.name }}</h3>
					</VCardTitle>
				</VCard>
			</VCol>

			<VCol v-else cols="12">
				<h3 class="text-center text-light">You do not have any portfolios</h3>
			</VCol>

			<VCol cols="12">
				<hr class="border border-secondary"/>
			</VCol>

			<VCol cols="12">
				<PortfolioCreate/>
			</VCol>
		</VRow>

		<div v-else>
			<h3 class="text-center text-error">{{ requestError }}</h3>
		</div>
	</VContainer>

	<VContainer v-else>
		<h3 class="text-center">Log in to view your portfolios</h3>
	</VContainer>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import PortfolioCreate from "./Create.vue";
	import useAppStore from "@/stores/App";

	const app = useAppStore();
	const router = useRouter();

	const requestError = ref("");

	onMounted(async () =>
	{
		if (!app.loggedIn) return;

		try
		{
			await app.getPortfolios();
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
