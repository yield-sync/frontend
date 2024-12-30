<template>
	<div class="app-container">
		<NavigationBar/>

		<RouterView v-if="initialized" />

		<FooterBar/>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { RouterView } from "vue-router";

	import FooterBar from "@/components/FooterBar.vue";
	import NavigationBar from "@/components/NavigationBar.vue";
	import useContractsStore from "@/stores/Contracts";
	import useWeb3WalletStore from "@/stores/Web3Wallet";

	const initialized = ref(false);

	const contractsStore = useContractsStore();
	const web3Wallet = useWeb3WalletStore();

	onMounted(async () =>
	{
		await web3Wallet.initialize();
		await contractsStore.initialize();

		initialized.value = true;
	});
</script>

<style lang="scss" scoped>
	@import "@/assets/styles/variables.scss";

	.app-container {
		background-attachment: fixed;
		background-size: cover;

		@extend .bg-gradient;
	}
</style>
