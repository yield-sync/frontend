<template>
	<Stock :symbol="symbol"/>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";
	import Stock from "@/components/stock/Stock.vue";

	const route = useRoute();

	const symbol = route.params.symbol;
</script>
