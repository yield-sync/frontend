import "vuetify/styles";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVuetify } from "vuetify";


export default createVuetify({
	components,

	directives,

	theme: {
		defaultTheme: "myCustomTheme",
		themes: {
			myCustomTheme: {
				dark: false,
				colors: {
					background: "#FFFFFF",
					surface: "#FFFFFF",
					primary: "#62e0b0",
					secondary: "rgb(63, 87, 86)",
					error: "#FF5252",
					info: "#2196F3",
					success: "rgb(11, 175, 16)",
					warning: "#FB8C00",
					light: "rgb(200, 200, 200)",
					dark: "rgb(38, 43, 46)",
				}
			},
		},
	},

	icons: {
		defaultSet: "mdi",
		aliases,
		sets: { mdi }
	}
});
