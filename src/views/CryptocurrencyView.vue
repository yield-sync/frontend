<template>
	<VContainer>
		<Cryptocurrency :symbol="symbol"/>
	</VContainer>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";
	import Cryptocurrency from "@/components/cryptocurrency/Cryptocurrency.vue";

	const route = useRoute();

	const symbol = route.params.symbol;
</script>
