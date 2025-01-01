<template>
	<div v-if="error != ''" class="text-center">
		<h6 class="my-3 text-error">{{ error }}</h6>
	</div>

	<VRow v-else class="dev-section">
		<VCol cols="12">
			<h3 class="text-center text-primary text-uppercase">Values</h3>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12">
			<h6 class="text-center">Block Explorer: {{ getBlockExplorer() }}</h6>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12">
			<a
				:href="getBlockExplorer() + contracts.v1EMPRegistry.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="tonal" color="white" class="w-100 rounded-xl">🔗 Registry</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12">
			<a
				:href="getBlockExplorer() + contracts.v1EMPArrayUtility.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="tonal" color="white" class="w-100 rounded-xl">🔗 Array Utility</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPDeployer.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="tonal" color="white" class="w-100 rounded-xl">🔗 EMP Deployer</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPUtility.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="tonal" color="white" class="w-100 rounded-xl">🔗 EMP Utility</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPStrategyDeployer.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="tonal" color="white" class="w-100 rounded-xl">🔗 Strategy Deployer</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPStrategyDeployer.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="tonal" color="white" class="w-100 rounded-xl">🔗 Strategy Utility</VBtn>
			</a>
		</VCol>
	</VRow>
</template>

<script setup>
	import { ref, watch } from "vue";
	import useAppStore from "@/stores/App";
	import useContractsStore from "@/stores/Contracts";
	import useWeb3WalletStore from "@/stores/Web3Wallet";
	import config from "@/config";

	const app = useAppStore();
	const contracts = useContractsStore();
	const web3Wallet = useWeb3WalletStore();

	let error = ref(contracts.error);

	const getBlockExplorer = () => {
		return config.networkChain[web3Wallet.networkId].blockExplorerUrls[0] + '/address/';
	};

	watch(
		() => contracts.error,
		async (errorNew, errorOld) =>
		{
			if (errorNew != "")
			{
				error.value = errorNew;
			}
		}
	);
</script>
