<template>
	<h4 class="text-center text-light">{{ governance }}</h4>

	<br/>

	<h4>Pay To:</h4>

	<h5>{{ defaultAdminRole }}</h5>

	<br>

	<h4>Default Admin Role:</h4>

	<h5>{{ defaultAdminRole }}</h5>
</template>

<script setup>
	import { ref, watch } from "vue";

	import useContractsStore from "@/stores/Contracts";


	const contracts = useContractsStore();

	const governance = ref("?");
	const payTo = ref("?");
	const defaultAdminRole = ref("?");


	const getGovernance = () =>
	{
		return contracts.yieldSyncGovernance.options.address ? contracts.yieldSyncGovernance.options.address : "?";
	};


	const getPayTo = () =>
	{
		if (contracts.yieldSyncGovernance)
		{
			return contracts.yieldSyncGovernance.methods.payTo().call().then((result) =>
			{
				return result;
			}).catch((error) =>
			{
				console.error("Error:", error);
			});
		}
	};


	const getDefaultAdminRole = () =>
	{
		if (contracts.yieldSyncGovernance)
		{
			return contracts.yieldSyncGovernance.methods.DEFAULT_ADMIN_ROLE().call().then((result) =>
			{
				return result;
			}).catch((error) =>
			{
				console.error("Error:", error);
			});
		}
	};


	watch(
		() =>
		{
			return contracts.yieldSyncGovernance;
		},
		async (newYieldSyncGovernance) =>
		{
			if (newYieldSyncGovernance)
			{
				governance.value = await getGovernance();
				payTo.value = await getPayTo();
				defaultAdminRole.value = await getDefaultAdminRole();
			}
		},
		{
			immediate: true
		}
	);
</script>
