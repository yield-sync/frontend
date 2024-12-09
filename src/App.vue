<template>
	<div class="app-container">
		<NavigationBar/>

		<RouterView/>

		<FooterBar/>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import { RouterView } from "vue-router";

	import FooterBar from "@/components/FooterBar.vue";
	import NavigationBar from "@/components/NavigationBar.vue";
	import { useYSContractsStore } from "@/stores/YSContracts";
	import { useWeb3WalletStore } from "@/stores/Web3Wallet";


	const ySContractsStore = useYSContractsStore();
	const web3Wallet = useWeb3WalletStore();


	onMounted(async () =>
	{
		const initializeStores = async () => {
			await web3Wallet.initialize();
			await ySContractsStore.initialize();
		}

		await initializeStores();
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
