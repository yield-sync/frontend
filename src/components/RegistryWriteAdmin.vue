<template>
	<VRow v-if="app.advancedMode">
		<VCol cols="12">
			<h3 class="text-center text-primary text-uppercase">Admin Functions</h3>
		</VCol>

		<VCol cols="12" class="text-center">
			<h4 class="text-primary m-0">V1 EMP ERC20 ETH Value Feed Update</h4>
		</VCol>

		<VCol cols="12" class="text-center">
			<VTextField
				v-model="eRC20"
				density="compact"
				label="ERC20 Address"
				variant="outlined"
				color="primary"
				class="mb-1"
			></VTextField>

			<VTextField
				v-model="v1EMPERC20ETHValueFeed"
				density="compact"
				label="ETH Value Feed"
				variant="outlined"
				color="primary"
				class="mb-1"
			></VTextField>

			<VBtn variant="flat" color="primary" class="w-100" @click="eRC20_v1EMPERC20ETHValueFeedUpdate">Submit</VBtn>

			<h6 v-if="errorERC20_v1EMPERC20ETHValueFeedUpdate" class="text-danger">
				{{ errorERC20_v1EMPERC20ETHValueFeedUpdate }}
			</h6>
			<h6 v-if="resultERC20_v1EMPERC20ETHValueFeedUpdate" class="text-success">
				{{ resultERC20_v1EMPERC20ETHValueFeedUpdate }}
			</h6>
		</VCol>
	</VRow>
</template>

<script setup>
	import { ref } from "vue";
	import { isAddress } from "web3-validator";
	import useAppStore from "@/stores/App";
	import useContractsStore from "@/stores/Contracts";
	import useWeb3WalletStore from "@/stores/Web3Wallet";


	const app = useAppStore();
	const contracts = useContractsStore();
	const web3wallet = useWeb3WalletStore();

	const eRC20 = ref();
	const v1EMPERC20ETHValueFeed = ref();
	const errorERC20_v1EMPERC20ETHValueFeedUpdate = ref();
	const resultERC20_v1EMPERC20ETHValueFeedUpdate = ref();

	const eRC20_v1EMPERC20ETHValueFeedUpdate = async () => {
		if (!isAddress(eRC20.value))
		{
			errorERC20_v1EMPERC20ETHValueFeedUpdate.value = "eRC20_v1EMPERC20ETHValueFeedUpdate: Invalid ERC20 Address";
			return;
		}

		if (!isAddress(v1EMPERC20ETHValueFeed.value))
		{
			errorERC20_v1EMPERC20ETHValueFeedUpdate.value = "eRC20_v1EMPERC20ETHValueFeedUpdate: Invalid ETHValueFeed Address";
			return;
		}

		resultERC20_v1EMPERC20ETHValueFeedUpdate.value = "";
		errorERC20_v1EMPERC20ETHValueFeedUpdate.value = "";

		try
		{
			const result = await contracts.v1EMPRegistry.methods.eRC20_v1EMPERC20ETHValueFeedUpdate(
				eRC20.value,
				v1EMPERC20ETHValueFeed.value
			).send({
				from: web3wallet.accounts[0]
			});

			resultERC20_v1EMPERC20ETHValueFeedUpdate.value = "Success!";

			console.log(result);
		}
		catch (error)
		{
			console.error(error);

			if (error?.message)
			{
				errorERC20_v1EMPERC20ETHValueFeedUpdate.value = error.message;
			}
			else if (error?.data)
			{
				errorERC20_v1EMPERC20ETHValueFeedUpdate.value = JSON.stringify(error.data);
			}
			else
			{
				errorERC20_v1EMPERC20ETHValueFeedUpdate.value = "An unknown error occurred.";
			}
		}
	};
</script>
