<template>
	<h6>URL: {{ appStore.baseURL }}</h6>
</template>

<script setup>
	import useAppStore from "@/stores/App";
	const appStore = useAppStore();
</script>
