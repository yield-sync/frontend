<template>
	<VContainer>
		<Portfolio :id="id"/>
	</VContainer>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";
	import Portfolio from "@/components/portfolio/Single.vue";

	const route = useRoute();

	const id = route.params.id;
</script>
