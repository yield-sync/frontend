import "vuetify/styles";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVuetify } from "vuetify";


// This changes the colors of the components
export const colors = {
	background: "rgb(255, 255, 255)",
	surface: "rgb(255, 255, 255)",
	primary: "rgb(98, 224, 176)",
	secondary: "rgb(63, 87, 86)",
	error: "rgb(255, 82, 82)",
	info: "rgb(33, 150, 243)",
	success: "rgb(11, 175, 16)",
	warning: "rgb(251, 140, 0)0",
	light: "rgb(200, 200, 200)",
	dark: "rgb(38, 43, 46)",
	danger: "rgb(255, 82, 82)",
};


export default createVuetify({
	components,

	directives,

	theme: {
		defaultTheme: "myCustomTheme",
		themes: {
			myCustomTheme: {
				dark: false,
				colors
			},
		},
	},

	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi
		}
	}
});
