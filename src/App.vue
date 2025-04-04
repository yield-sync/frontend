<template>
	<div class="app-container">
		<NavigationBar/>

		<RouterView />

		<FooterBar/>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import { RouterView } from "vue-router";

	onMounted(async () =>
	{

	});
</script>

<style lang="scss" scoped>
	@import "@/assets/styles/variables.scss";

	.app-container {
		background-attachment: fixed;
		background-size: cover;

		@extend .bg-gradient;
	}
</style>
