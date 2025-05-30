<template>
	<Cryptocurrency :symbol="symbol"/>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";
	import Cryptocurrency from "@/components/cryptocurrency/Cryptocurrency.vue";

	const route = useRoute();

	const symbol = route.params.symbol;
</script>
