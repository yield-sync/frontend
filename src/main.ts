import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

import App from "./App.vue";
import "./assets/styles/variables.scss";
import router from "./router";
import store from "./store";


const vuetify = createVuetify({
	components: {
		...components
	},
	directives,
	theme: {
		defaultTheme: "myCustomLightTheme",
		themes: {
			myCustomLightTheme: {
				dark: false,
				colors: {
					admin: "#ffe596",
					dark: "#1c261e",
					info: "#2196F3",
					light: "#e6e6e6",
					primary: "#7fad6f",
					"primary-light": "#6e964e",
					secondary: "#03DAC6",
					success: "#00FF1D",
					warning: "#ffd712",
					danger: "#f0483a",
					white: "#FFFFFF",
					clear: "#ffffff00",
				},
			}
		}
	}
});


createApp(App).provide("$store", store).use(store).use(router).use(vuetify).mount("#app");
