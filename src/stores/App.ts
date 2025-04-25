import axios from "axios";
import { defineStore } from "pinia";


type State = {
	loggedIn: boolean,
	portfolios: any[],
}

type Getters = {
};

type Actions = {
	setLoggedIn(state: boolean): void,
	getPortfolios(): void,
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
				loggedIn,
				portfolios: [
				],
			};
		},

		getters: {
		},

		actions: {
			setLoggedIn(state: boolean)
			{
				this.loggedIn = state;
			},

			async getPortfolios()
			{
				const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

				const authAxios = axios.create({
					baseURL: `${URL}/api/portfolio`,
					headers: {
						authorization: `Bearer ${localStorage.getItem("authToken")}`
					}
				});

				const response = await authAxios.get("/");

				this.portfolios = response.data.portfolios;
			},
		},
	}
);
