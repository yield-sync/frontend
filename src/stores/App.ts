import { defineStore } from "pinia";
import type { _GettersTree } from 'pinia';


interface State
{
	advancedMode: boolean;
}

type Getters = _GettersTree<State> & {
	doubleCount(state: State): number;
};

interface Actions
{
	toggleAdvancedMode(): void;
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

		actions: {
			toggleAdvancedMode()
			{
				this.advancedMode = !this.advancedMode;

				localStorage.setItem("advancedMode", String(this.advancedMode));
			},
		},
	}
);
