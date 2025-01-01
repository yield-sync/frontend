import { defineStore } from "pinia";


type State = {
	advancedMode: boolean,
	adminMode: boolean,
}

type Getters = {
};

type Actions = {
	toggleAdminMode(): void,
	toggleAdvancedMode(): void,
}


export default defineStore<"App", State, Getters, Actions>(
	"App",
	{
		state: () =>
		{
			const storedAdminMode = localStorage.getItem("adminMode")
			const storedAdvancedMode = localStorage.getItem("advancedMode");

			return {
				adminMode: String(storedAdminMode) == 'true' ? true : false,
				advancedMode: String(storedAdvancedMode) == 'true' ? true : false,
			};
		},

		getters: {},

		actions: {
			toggleAdminMode()
			{
				this.adminMode = !this.adminMode;

				localStorage.setItem("adminMode", String(this.adminMode));
			},

			toggleAdvancedMode()
			{
				this.advancedMode = !this.advancedMode;

				localStorage.setItem("advancedMode", String(this.advancedMode));
			},
		},
	}
);
