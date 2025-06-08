<template>
	<div class="tradingview-widget-container" ref="container">
		<div class="tradingview-widget-container__widget"></div>

		<div class="tradingview-widget-copyright">
			<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
				<span class="blue-text">Track all markets on TradingView</span>
			</a>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from "vue";

	const container = ref(null);

	onMounted(() => 
	{
		const script = document.createElement("script");
		script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = `
    {
      "feedMode": "all_symbols",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "500",
      "colorTheme": "dark",
      "locale": "en"
    }`;
		container.value.appendChild(script);
	});
</script>
