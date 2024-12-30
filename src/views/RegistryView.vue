<template>
	<MainContainer title="Registry">
		<RegistryWrite />
		<RegistryRead />
		<RegistryWriteAdmin />
	</MainContainer>
</template>

<script setup>
	import MainContainer from "@/components/MainContainer.vue";
	import RegistryRead from "@/components/RegistryRead.vue";
	import RegistryWrite from "@/components/RegistryWrite.vue";
	import RegistryWriteAdmin from "@/components/RegistryWriteAdmin.vue";
</script>
