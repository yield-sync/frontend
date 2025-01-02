<template>
	<VRow>
		<VCol cols="12">
			<h3 class="text-center text-primary">Retrieve Values</h3>
		</VCol>

		<VCol cols="12">
			<h4 class="text-primary m-0">V1 EMP</h4>
		</VCol>

		<VCol cols="12" lg="3" class="text-center">
			<VTextField
				v-model="inputV1EMPId"
				hide-details
				type="number"
				append-inner-icon="mdi-magnify"
				density="compact"
				label="ID"
				hint="Returns the V1 EMP ID"
				variant="outlined"
				color="primary"
				rounded
				class="mb-1"
				@click:append-inner="v1EMPId_v1EMP"
				@keyup.enter="v1EMPId_v1EMP"
			></VTextField>
		</VCol>

		<VCol cols="12" lg="9" class="text-center">
			<div class="p-0 w-100 h-100 border-md border-dashed rounded-xl">
				<p class="text-h6 my-0 mt-1 text-primary">{{ resultV1EMP }}</p>
			</div>
		</VCol>

		<VCol v-if="errorInputV1EMPId" cols="12" class="text-center">
			<p class="text-center text-error">{{ errorInputV1EMPId }}</p>
		</VCol>

		<VCol cols="12" lg="9" class="text-center">
			<VTextField
				v-model="inputV1EMP"
				hide-details
				append-inner-icon="mdi-magnify"
				density="compact"
				label="Address"
				hint="Returns the ID of V1EMP"
				variant="outlined"
				color="primary"
				rounded
				class="mb-1"
				@click:append-inner="v1EMP_v1EMPId"
				@keyup.enter="v1EMP_v1EMPId"
			></VTextField>
		</VCol>

		<VCol cols="12" lg="3" class="text-center">
			<div class="p-0 w-100 h-100 border-md border-dashed rounded-xl">
				<p class="text-h6 my-0 mt-1 text-primary">{{ resultV1EMPId }}</p>
			</div>
		</VCol>

		<VCol v-if="errorInputV1EMP" cols="12" class="text-center">
			<p class="text-center text-error">{{ errorInputV1EMP }}</p>
		</VCol>

		<VCol cols="12">
			<h4 class="text-primary m-0">V1 EMP Strategy</h4>
		</VCol>

		<VCol cols="12" lg="3" class="text-center">
			<VTextField
				v-model="inputV1EMPStrategyId"
				hide-details
				type="number"
				append-inner-icon="mdi-magnify"
				density="compact"
				label="ID"
				hint="Returns the V1 EMP Strategy ID"
				variant="outlined"
				color="primary"
				rounded
				class="mb-1"
				@click:append-inner="v1EMPStrategyId_v1EMPStrategy"
				@keyup.enter="v1EMPStrategyId_v1EMPStrategy"
			></VTextField>
		</VCol>

		<VCol cols="12" lg="9" class="text-center">
			<div class="p-0 w-100 h-100 border-md border-dashed rounded-xl">
				<p class="text-h6 my-0 mt-1 text-primary">{{ resultV1EMPStrategy }}</p>
			</div>
		</VCol>

		<VCol v-if="errorInputV1EMPStrategyId" cols="12" class="text-center">
			<p class="text-center text-error">{{ errorInputV1EMPStrategyId }}</p>
		</VCol>

		<VCol cols="12" lg="9" class="text-center">
			<VTextField
				v-model="inputV1EMPStrategy"
				hide-details
				append-inner-icon="mdi-magnify"
				density="compact"
				label="Address"
				hint="Returns the ID the V1EMP Strategy"
				variant="outlined"
				color="primary"
				rounded
				class="mb-1"
				@click:append-inner="v1EMPStrategy_v1EMPStrategyId"
				@keyup.enter="v1EMPStrategy_v1EMPStrategyId"
			></VTextField>
		</VCol>

		<VCol cols="12" lg="3" class="text-center">
			<div class="p-0 w-100 h-100 border-md border-dashed rounded-xl">
				<p class="text-h6 my-0 mt-1 text-primary">{{ resultV1EMPStrategyId }}</p>
			</div>
		</VCol>

		<VCol v-if="errorInputV1EMPStrategy" cols="12" class="text-center">
			<p class="text-center text-error">{{ errorInputV1EMPStrategy }}</p>
		</VCol>

		<VCol cols="12">
			<h4 class="text-primary mb-3">ERC20 Value Feed</h4>

			<VTextField
				v-model="inputERC20"
				append-inner-icon="mdi-magnify"
				density="compact"
				label="ERC20 Address"
				hint="Returns Value Feed Address"
				variant="outlined"
				color="primary"
				rounded
				class="mb-1"
				@click:append-inner="eRC20_v1EMPERC20ETHValueFeed"
				@keyup.enter="eRC20_v1EMPERC20ETHValueFeed"
			></VTextField>

			<h6 v-if="errorInputERC20" class="text-center text-error">{{ errorInputERC20 }}</h6>

			<a
				v-if="resultV1EMPERC20ETHValueFeed"
				:href="getBlockExplorer() + resultV1EMPERC20ETHValueFeed"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VBtn
					variant="flat"
					color="success"
					class="rounded-xl elevation-0 font-weight-bold"
				>
					🔗 {{ resultV1EMPERC20ETHValueFeed }}
				</VBtn>
			</a>
		</VCol>
	</VRow>
</template>

<script setup>
	import { ref } from "vue";
	import { isAddress } from "web3-validator";
	import useContractsStore from "@/stores/Contracts";
	import useWeb3WalletStore from "@/stores/Web3Wallet";
	import config from "@/config";

	const contracts = useContractsStore();
	const web3Wallet = useWeb3WalletStore();

	const getBlockExplorer = () => {
		return config.networkChain[web3Wallet.networkId].blockExplorerUrls[0] + '/address/';
	};

	const inputERC20 = ref();
	const resultV1EMPERC20ETHValueFeed = ref();
	const errorInputERC20 = ref();

	const eRC20_v1EMPERC20ETHValueFeed = () =>
	{
		if (!isAddress(inputERC20.value))
		{
			errorInputERC20.value = "eRC20_v1EMPERC20ETHValueFeed: Invalid ERC20 Address";
			resultV1EMPERC20ETHValueFeed.value = "";
			return;
		}

		errorInputERC20.value = "";

		contracts.v1EMPRegistry.methods.eRC20_v1EMPERC20ETHValueFeed(inputERC20.value).call().then(
		(result) =>
		{
			resultV1EMPERC20ETHValueFeed.value = String(result)
		});
	}

	const inputV1EMP = ref();
	const resultV1EMPId = ref();
	const errorInputV1EMP = ref();

	const v1EMP_v1EMPId = () =>
	{
		if (!isAddress(inputV1EMP.value))
		{
			errorInputV1EMP.value = "v1EMP_v1EMPId: Invalid ERC20 Address";
			resultV1EMPId.value = "";
			return;
		}

		errorInputV1EMP.value = "";

		contracts.v1EMPRegistry.methods.v1EMP_v1EMPId(inputV1EMP.value).call().then(
		(result) =>
		{
			resultV1EMPId.value = String(result)
		});
	};

	const inputV1EMPId = ref();
	const resultV1EMP = ref();
	const errorInputV1EMPId = ref();

	const v1EMPId_v1EMP = () =>
	{
		const value = Number(inputV1EMPId.value);

		if (typeof value !== 'number' || value < 0 || !Number.isFinite(value))
		{
			errorInputV1EMPId.value = "v1EMPId_v1EMP: Invalid ID";
			resultV1EMP.value = "";
			return;
		}

		errorInputV1EMPId.value = "";

		contracts.v1EMPRegistry.methods.v1EMPId_v1EMP(value).call().then(
		(result) =>
		{
			resultV1EMP.value = String(result)
		});
	};

	const inputV1EMPStrategy = ref();
	const resultV1EMPStrategyId = ref();
	const errorInputV1EMPStrategy = ref();

	const v1EMPStrategy_v1EMPStrategyId = () =>
	{
		if (!isAddress(inputV1EMPStrategy.value))
		{
			errorInputV1EMPStrategy.value = "v1EMP_v1EMPId: Invalid ERC20 Address";
			resultV1EMPStrategyId.value = "";
			return;
		}

		errorInputV1EMPStrategy.value = "";

		contracts.v1EMPRegistry.methods.v1EMPStrategy_v1EMPStrategyId(inputV1EMPStrategy.value).call().then(
		(result) => {
			resultV1EMPStrategyId.value = String(result)
		})
	};

	const inputV1EMPStrategyId = ref();
	const resultV1EMPStrategy = ref();
	const errorInputV1EMPStrategyId = ref();

	const v1EMPStrategyId_v1EMPStrategy = () =>
	{
		const value = Number(inputV1EMPStrategyId.value);

		if (typeof value !== 'number' || value < 0 || !Number.isFinite(value))
		{
			errorInputV1EMPStrategyId.value = "v1EMPId_v1EMP: Invalid ID";
			resultV1EMPStrategy.value = "";
			return;
		}

		errorInputV1EMPStrategyId.value = "";

		contracts.v1EMPRegistry.methods.v1EMPStrategyId_v1EMPStrategy(value).call().then((result) =>
		{
			resultV1EMPStrategy.value = String(result)
		})
	};
</script>

<style lang="scss">
.h-min {
	min-height: 40px;
}
</style>
