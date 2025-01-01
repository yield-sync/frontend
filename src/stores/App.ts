import { defineStore } from "pinia";


type State = {
	advancedMode: boolean,
}

type Getters = {
};

type Actions = {
	toggleAdvancedMode(): void,
}


export default defineStore<"App", State, Getters, Actions>(
	"App",
	{
		state: () =>
		{
			const storedAdvancedMode = localStorage.getItem("advancedMode");

			return {
				advancedMode: String(storedAdvancedMode) == 'true' ? true : false,
			};
		},

		getters: {},

		actions: {
			toggleAdvancedMode()
			{
				this.advancedMode = !this.advancedMode;

				localStorage.setItem("advancedMode", String(this.advancedMode));
			},
		},
	}
);
