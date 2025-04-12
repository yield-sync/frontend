import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		svgr(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: "@import \"@/styles/variables.scss\";"
			},
		},
	},
});
