import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";


export default createVuetify({
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
					dark: "#212224",
					info: "#2196F3",
					light: "#e6e6e6",
					primary: "#7fad6f",
					"primary-light": "#6e964e",
					secondary: "#03DAC6",
					success: "#008000",
					warning: "#ffd712",
					danger: "#f0483a",
					white: "#FFFFFF",
					clear: "#ffffff00",
				},
			}
		}
	}
});
