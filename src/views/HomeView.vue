<template>
	<VContainer style="max-width: 600px;">
		<VTabs
			v-model="tab"
			align-tabs="center"
			bg-color="dark-light"
			stacked
			class="rounded-xl"
		>
			<VTab v-if="app.loggedIn" value="tab-1" color="primary">
				<VIcon icon="mdi-chart-pie" class="mb-2"/>
				Portfolios
			</VTab>

			<VTab value="tab-2" color="primary">
				<VIcon icon="mdi-newspaper" class="mb-2"/>
				Trending
			</VTab>

			<VTab value="tab-3" color="primary">
				<VIcon icon="mdi-grid-large" class="mb-2"/>
				Heatmap
			</VTab>
		</VTabs>

		<VTabsWindow v-model="tab" class="bg-dark elevation-0 mx-auto mt-5" style="max-width: 600px;">
			<VTabsWindowItem
				v-for="i in 3"
				:key="i"
				:value="'tab-' + i"
			>
				<PortfolioReadAll v-show="tab == 'tab-1'"/>

				<TradingViewWidgetNews v-show="tab == 'tab-2'"/>

				<TradingViewWidgetHeatMap v-show="tab == 'tab-3'"/>
			</VTabsWindowItem>
		</VTabsWindow>
	</VContainer>
</template>

<script setup>
	import PortfolioReadAll from "@/components/portfolio/PortfolioReadAll.vue";
	import TradingViewWidgetHeatMap from "@/components/tradingview-widgets/TradingViewWidgetHeatMap.vue";
	import TradingViewWidgetNews from "@/components/tradingview-widgets/TradingViewWidgetNews.vue";
	import useAppStore from "@/stores/App";

	import { ref } from "vue";

	const app = useAppStore();

	const tab = ref("tab-2");
</script>
