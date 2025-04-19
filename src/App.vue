<template>
	<div>
		<NavigationBar/>

		<RouterView/>

		<FooterBar/>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import { RouterView } from "vue-router";

	import NavigationBar from "@/components/NavigationBar.vue";
	import FooterBar from "@/components/FooterBar.vue";
</script>

<style lang="scss">
	@import 'vuetify/_styles.scss';

	@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');


	.ubuntu-mono-regular {
		font-family: "Ubuntu Mono", monospace;
		font-weight: 400;
		font-style: normal;
	}

	.ubuntu-mono-bold {
		font-family: "Ubuntu Mono", monospace;
		font-weight: 700;
		font-style: normal;
	}

	.ubuntu-mono-regular-italic {
		font-family: "Ubuntu Mono", monospace;
		font-weight: 400;
		font-style: italic;
	}

	.ubuntu-mono-bold-italic {
		font-family: "Ubuntu Mono", monospace;
		font-weight: 700;
		font-style: italic;
	}

	* {
		font-family: "Ubuntu Mono", monospace;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
	}

	html {
		background-color: $dark;
	}

	p {
		color: $light;
	}

	h1, h2, h3, h4, h5, h6 {
		color: $primary;
	}

	.word-wrap {
		word-wrap: break-word;
	}

	.text-decoration-none {
		text-decoration: none !important;
	}

	.text-bold {
		font-weight: bold;
	}
</style>
