<template>
	<div class="mx-auto" style="max-width: 600px;">
		<div class="tradingview-widget-container" ref="container">
			<div class="tradingview-widget-container__widget"></div>

			<div class="tradingview-widget-copyright">
				<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
					<span class="blue-text">Track all markets on TradingView</span>
				</a>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from "vue";

	const container = ref(null);

	onMounted(() =>
	{
		const script = document.createElement("script");
		script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = `
    {
      "exchanges": [],
      "dataSource": "SPX500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isTransparent": true,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": false,
      "width": "100%",
      "height": "500"
    }`;
		container.value.appendChild(script);
	});
</script>
