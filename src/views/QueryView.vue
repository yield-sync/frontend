<template>
	<VContainer>
		<Query :query="query"/>
	</VContainer>
</template>

<script lang="ts" setup>
	import { computed } from "vue";
	import { useRoute } from "vue-router";
	import Query from "@/components/Query.vue";


	const route = useRoute();


	const query = computed(() => route.params.query);
</script>
