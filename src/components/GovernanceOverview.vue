<template>
	<MainContainer title="YS Govnernance">
		<h4 class="text-center text-light">{{ governance }}</h4>

		<br/>

		<h4>Pay To:</h4>

		<h5>{{ defaultAdminRole }}</h5>

		<br>

		<h4>Default Admin Role:</h4>

		<h5>{{ defaultAdminRole }}</h5>
	</MainContainer>
</template>

<script setup>
	import { ref, watch } from "vue";

	import MainContainer from "@/components/MainContainer.vue";
	import { useYSContractsStore } from "@/stores/YSContracts";


	const ySContracts = useYSContractsStore();

	const governance = ref("?");
	const payTo = ref("?");
	const defaultAdminRole = ref("?");


	const getGovernance = () =>
	{
		return ySContracts.yieldSyncGovernance.options.address ? ySContracts.yieldSyncGovernance.options.address : "?";
	};


	const getPayTo = () =>
	{
		if (ySContracts.yieldSyncGovernance)
		{
			return ySContracts.yieldSyncGovernance.methods.payTo().call().then((result) =>
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
		if (ySContracts.yieldSyncGovernance)
		{
			return ySContracts.yieldSyncGovernance.methods.DEFAULT_ADMIN_ROLE().call().then((result) =>
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
			return ySContracts.yieldSyncGovernance;
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
