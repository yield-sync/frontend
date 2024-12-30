import { defineStore } from "pinia";


interface State
{
	advancedMode: boolean;
}


interface Actions
{
	toggleAdvancedMode(): void;
}


export default defineStore<"App", State, {}, Actions>(
	"App",
	{
		state: () =>
		{
			const storedAdvancedMode = localStorage.getItem("advancedMode");

			return {
				advancedMode: String(storedAdvancedMode) == 'true' ? true : false,
			};
		},

		actions: {
			toggleAdvancedMode()
			{
				this.advancedMode = !this.advancedMode;

				localStorage.setItem("advancedMode", String(this.advancedMode));
			},
		},
	}
);
