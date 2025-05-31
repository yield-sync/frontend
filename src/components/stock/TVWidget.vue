<template>
  <div
    class="tradingview-widget-container"
    ref="container"
    style="width: 100%;"
  >
    <div class="tradingview-widget-container__widget"></div>

    <div class="tradingview-widget-copyright">
      <a
        href="https://www.tradingview.com/"
        rel="noopener nofollow"
        target="_blank"
      >
        <span class="blue-text">Track all markets on TradingView</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"

// Accept symbol prop (e.g., "AAPL", "GOOGL", "BTCUSD")
const props = defineProps({
  symbol: {
    type: String,
    required: true,
  }
})

const container = ref(null)

onMounted(() => {
  const script = document.createElement("script")
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
  script.type = "text/javascript"
  script.async = true

  const config = {
    symbols: [
      [props.symbol, `${props.symbol}|1D`],
    ],
    chartOnly: false,
    width: "100%",
    height: "400",
    locale: "en",
    colorTheme: "dark",
    autosize: true,
    showVolume: false,
    showMA: false,
    hideDateRanges: false,
    hideMarketStatus: false,
    hideSymbolLogo: false,
    scalePosition: "right",
    scaleMode: "Normal",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
    fontSize: "10",
    noTimeScale: false,
    valuesTracking: "1",
    changeMode: "price-and-percent",
    chartType: "area",
    maLineColor: "#2962FF",
    maLineWidth: 1,
    maLength: 9,
    headerFontSize: "medium",
    lineWidth: 2,
    lineType: 0,
    dateRanges: [
      "1d|1",
      "1m|30",
      "3m|60",
      "12m|1D",
      "60m|1W",
      "all|1M",
    ]
  }

  script.innerHTML = JSON.stringify(config)

  container.value
    .querySelector(".tradingview-widget-container__widget")
    ?.appendChild(script)
})
</script>
