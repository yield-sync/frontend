<template>
	<VBtnToggle
		v-model="searchAssetType"
		color="light"
		variant="outlined"
		divided
		mandatory
		rounded="xl"
		class="w-100 mb-6 text-light"
		density="compact"
		border="light"
	>
		<VBtn class="w-50">Stock</VBtn>

		<VBtn class="w-50">Crypto</VBtn>
	</VBtnToggle>

	<StockSearchBar v-if="searchAssetType === 0"/>

	<CryptoSearchBar v-if="searchAssetType === 1"/>
</template>

<script setup>
	import { ref } from "vue";

	import CryptoSearchBar from "@/components/cryptocurrency/CryptocurrencySearchBar.vue";
	import StockSearchBar from "@/components/stock/StockSearchBar.vue";

	const searchAssetType = ref(0);
</script>
