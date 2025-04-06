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
	}
);
