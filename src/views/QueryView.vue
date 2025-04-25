<template>
	<VContainer>
		<Query :query="query"/>
	</VContainer>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";
	import Query from "@/components/Query.vue";

	const route = useRoute();

	const query = route.params.query;
</script>
