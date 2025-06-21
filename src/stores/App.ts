import axios from "axios";
import { defineStore } from "pinia";


type State = {
	baseAPIURL: string,
	loggedIn: boolean,
	portfolios: any[],
	sectors: string[]
}

type Getters = {
};

type Actions = {
	setLoggedIn(state: boolean): void,
	setSectors(): Promise<void>,
	getPortfolios(): Promise<void>
	init(): void,
}


export default defineStore<"App", State, Getters, Actions>(
	"App",
	{
		state: () =>
		{
			return {
				baseAPIURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "",
				loggedIn: (localStorage.getItem("authToken") && localStorage.getItem("authToken") != "") ? true : false,
				portfolios: [
				],
				sectors: [
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

			async setSectors(): Promise<void>
			{
				const authAxios = axios.create({
					baseURL: `${this.baseAPIURL}/api/sector`,
					headers: {
						authorization: `Bearer ${localStorage.getItem("authToken")}`
					}
				});

				const response = await authAxios.get("/");

				if (response.status !== 200)
				{
					throw new Error("Failed to fetch sectors");
				}

				if (!response.data)
				{
					throw new Error("Invalid response format for sectors");
				}

				if (!Array.isArray(response.data))
				{
					throw new Error("Sectors data is not an array");
				}

				if (response.data.length === 0)
				{
					throw new Error("No sectors found");
				}

				this.sectors = response.data;
			},

			async getPortfolios(): Promise<void>
			{
				const authAxios = axios.create({
					baseURL: `${this.baseAPIURL}/api/portfolio`,
					headers: {
						authorization: `Bearer ${localStorage.getItem("authToken")}`
					}
				});

				const response = await authAxios.get("/");

				this.portfolios = response.data.portfolios;
			},

			async init()
			{
				try
				{
					await this.setSectors();
				}
				catch (e)
				{
					console.error("[app-store] Failed to initialize sectors:", e);
				}
			},
		},
	}
);
