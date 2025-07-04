<template>
	{{ appStore.baseURL }}
</template>

<script setup>
	import useAppStore from "@/stores/App";
	const appStore = useAppStore();
</script>
