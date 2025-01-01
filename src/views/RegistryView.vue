<template>
	<MainContainer title="Registry">
		<RegistryWrite />
		<RegistryRead />
	</MainContainer>

	<MainContainer v-if="app.adminMode" title="Admin Registry Functions">
		<RegistryWriteAdmin />
	</MainContainer>
</template>

<script setup>
	import MainContainer from "@/components/MainContainer.vue";
	import RegistryRead from "@/components/RegistryRead.vue";
	import RegistryWrite from "@/components/RegistryWrite.vue";
	import RegistryWriteAdmin from "@/components/RegistryWriteAdmin.vue";
	import useAppStore from "@/stores/App";

	const app = useAppStore();
</script>
