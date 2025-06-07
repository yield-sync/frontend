<template>
	<PortfolioRead :id="id"/>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";
	import PortfolioRead from "@/components/portfolio/PortfolioRead.vue";

	const route = useRoute();

	const id = route.params.id;
</script>
