import { defineStore } from "pinia";


type State = {
	loggedIn: boolean,
}

type Getters = {
};

type Actions = {
	setLoggedIn(state: boolean): void,
}


export default defineStore<"App", State, Getters, Actions>(
	"App",
	{
		state: () =>
			{
				const loggedIn = (
					localStorage.getItem("authToken") && localStorage.getItem("authToken") != ""
				) ? true : false;

				return {
					loggedIn
				};
			},

			getters: {},

			actions: {
				setLoggedIn(state: boolean)
				{
					this.loggedIn = state;
				},
			},
	}
);
