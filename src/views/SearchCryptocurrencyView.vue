<template>
	<SearchCryptocurrency :query="query"/>
</template>

<script lang="ts" setup>
	import { computed } from "vue";
	import { useRoute } from "vue-router";
	import SearchCryptocurrency from "@/components/cryptocurrency/SearchCryptocurrency.vue";


	const route = useRoute();


	const query = computed(() =>
	{
		return route.params.query;
	});
</script>
