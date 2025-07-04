<template>
	<VContainer style="max-width: 600px;">
		<h6>URL: {{ appStore.baseAPIURL }}</h6>
	</VContainer>
</template>

<script setup>
	import useAppStore from "@/stores/App";
	const appStore = useAppStore();
</script>
