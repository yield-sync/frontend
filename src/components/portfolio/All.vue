<template>
	<VContainer v-if="app.loggedIn" style="max-width: 600px;">
		<VRow v-if="!requestError">
			<VCol cols="12">
				<h4 class="text-center text-light">Portfolios</h4>
			</VCol>

			<VCol v-if="app.portfolios.length > 0" v-for="p in app.portfolios" :key="p.id" cols="12">
				<VCard @click="router.push(`/portfolio/${p.id}`)" color="dark-light" elevation="0" class="rounded-xl">
					<VCardTitle class="py-6 text-center">
						<h3 class="text-center text-uppercase text-primary">{{ p.name }}</h3>
					</VCardTitle>
				</VCard>
			</VCol>

			<VCol v-else cols="12">
				<h4 class="text-center text-secondary">You do not have any portfolios</h4>
			</VCol>

			<VCol cols="12" class="mt-6">
				<PortfolioCreate/>
			</VCol>
		</VRow>

		<div v-else>
			<h3 class="text-center text-error">{{ requestError }}</h3>
		</div>
	</VContainer>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	import PortfolioCreate from "./PortfolioCreate.vue";
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
