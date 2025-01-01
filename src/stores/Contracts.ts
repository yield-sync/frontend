import { defineStore } from "pinia";
import { watch } from "vue";
import { Contract } from "web3-eth-contract";
import { isAddress } from "web3-validator";
import type { AbiItem } from "web3-utils";

import V1EMPRegistry from "@/abi/V1EMPRegistry";
import V1EMPArrayUtility from "@/abi/V1EMPArrayUtility";
import config from "@/config";
import useWeb3WalletStore from "@/stores/Web3Wallet";


type State = {
	error: string,
	v1EMPRegistry?: Contract<AbiItem[]>,
	v1EMPArrayUtility?: Contract<AbiItem[]>,
	v1EMPUtility?: string,
	v1EMPDeployer?: string,
	v1EMPStrategyUtility?: string,
	v1EMPStrategyDeployer?: string,
}

type Getters = {
};

type Actions = {
	setV1EMPRegistry(): Promise<void>,
	setV1EMPArrayUtility(): Promise<void>,
	setAllContractAddresses(): void,
	initialize(): Promise<void>,
}


export default defineStore<"Contracts", State, Getters, Actions>(
	"Contracts",
	{
		state: () =>
		{
			return {
				error: "",
			};
		},

		actions: {
			async setV1EMPRegistry(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "Failed to set YS Gov because no web3 found";

					return;
				}

				this.v1EMPRegistry = new web3Wallet.web3.eth.Contract(
					V1EMPRegistry as AbiItem[],
					config.networkChain[web3Wallet.networkId].v1EMPRegistry
				);
			},

			async setV1EMPArrayUtility(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "setV1EMPArrayUtility: No web3 found";

					return;
				}

				if (!this.v1EMPRegistry)
				{
					console.error("setV1EMPArrayUtility: Registry not found");

					return;
				}

				try
				{
					const result = await this.v1EMPRegistry.methods.v1EMPArrayUtility().call();

					if (!isAddress(String(result)))
					{
						this.error = "setV1EMPArrayUtility: Get address failure";

						return;
					}

					this.v1EMPArrayUtility = new web3Wallet.web3.eth.Contract(
						V1EMPArrayUtility as AbiItem[],
						String(result)
					);
				}
				catch (error)
				{
					this.error = String(error);
				}
			},

			setAllContractAddresses(): void
			{
				console.log("Setting all contract..");

				if (!this.v1EMPRegistry)
				{
					this.error = "Registry not available.";

					return;
				}

				this.v1EMPRegistry.methods.v1EMPUtility().call().then((result) =>
				{
					this.v1EMPUtility = String(result);

				}).catch((error) =>
				{
					this.v1EMPUtility = "?";

					console.error("Error:", error);

					this.error = String(error);
				});

				this.v1EMPRegistry.methods.v1EMPStrategyUtility().call().then((result) =>
				{
					this.v1EMPStrategyUtility = String(result);

				}).catch((error) =>
				{
					this.v1EMPStrategyUtility = "?";

					console.error("Error:", error);

					this.error = String(error);
				});

				this.v1EMPRegistry.methods.v1EMPDeployer().call().then((result) =>
				{
					this.v1EMPDeployer = String(result);

				}).catch((error) =>
				{
					this.v1EMPDeployer = "?";

					console.error("Error:", error);

					this.error = String(error);
				});

				this.v1EMPRegistry.methods.v1EMPStrategyDeployer().call().then((result) =>
				{
					this.v1EMPStrategyDeployer = String(result);

				}).catch((error) =>
				{
					this.v1EMPStrategyDeployer = "?";

					console.error("Error:", error);

					this.error = String(error);
				});
			},

			async initialize(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				await this.setV1EMPRegistry();
				await this.setV1EMPArrayUtility();
				this.setAllContractAddresses();

				watch(
					() => web3Wallet.networkId,
					async (networkIdNew, networkIdOld) =>
					{
						if (networkIdNew != networkIdOld)
						{
							await this.setV1EMPRegistry();
							await this.setV1EMPArrayUtility();
							this.setAllContractAddresses();
						}
					}
				);
			}
		},
	}
);
