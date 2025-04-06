<template>
	<div>
		<NavigationBar/>

		<RouterView />

		<FooterBar/>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import { RouterView } from "vue-router";

	import NavigationBar from "@/components/NavigationBar.vue";
	import FooterBar from "@/components/FooterBar.vue";

	onMounted(async () =>
	{

	});
</script>

<style lang="scss" scoped>
	@import "@/assets/styles/variables.scss";
</style>
