<template>
	<VRow class="dev-section">
		<VCol v-if="app.advancedMode" cols="12">
			<h6 class="text-center">Block Explorer: {{ getBlockExplorer() }}</h6>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12">
			<a
				:href="getBlockExplorer() + contracts.v1EMPRegistry.options.address"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="flat" color="primary" class="w-100 rounded-xl">Registry</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12">
			<a
				:href="getBlockExplorer() + contracts.v1EMPStrategyDeployer"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="flat" color="primary" class="w-100 rounded-xl">Array Utility</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPDeployer"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="flat" color="primary" class="w-100 rounded-xl">EMP Deployer</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPUtility"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="flat" color="primary" class="w-100 rounded-xl">EMP Utility</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPStrategyDeployer"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="flat" color="primary" class="w-100 rounded-xl">Strategy Deployer</VBtn>
			</a>
		</VCol>

		<VCol v-if="app.advancedMode" cols="12" md="6">
			<a
				:href="getBlockExplorer() + contracts.v1EMPStrategyDeployer"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn variant="flat" color="primary" class="w-100 rounded-xl">Strategy Utility</VBtn>
			</a>
		</VCol>
	</VRow>
</template>

<script setup>
	import useAppStore from "@/stores/App";
	import useContractsStore from "@/stores/Contracts";
	import useWeb3WalletStore from "@/stores/Web3Wallet";
	import config from "@/config";

	const app = useAppStore();
	const contracts = useContractsStore();
	const web3Wallet = useWeb3WalletStore();

	const getBlockExplorer = () => {
		return config.networkChain[web3Wallet.networkId].blockExplorerUrls[0] + '/address/';
	};
</script>
