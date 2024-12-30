import { defineStore } from "pinia";
import { watch } from "vue";
import { Contract } from "web3-eth-contract";
import type { AbiItem } from "web3-utils";

import V1EMPRegistry from "@/abi/V1EMPRegistry";
import config from "@/config";

import useWeb3WalletStore from "@/stores/Web3Wallet";


interface State
{
	error: string,
	v1EMPRegistry?: Contract<AbiItem[]>,
	v1EMPArrayUtility?: string,
	v1EMPUtility?: string,
	v1EMPDeployer?: string,
	v1EMPStrategyUtility?: string,
	v1EMPStrategyDeployer?: string
}

interface Actions
{
	setV1EMPRegistry(): void,
	setAllContractAddresses(): void,
	initialize(): Promise<void>,
}


export default defineStore<"Contracts", State, {}, Actions>(
	"Contracts",
	{
		state: () =>
		{
			return {
				error: "",
				yieldSyncGovernance: undefined,
				v1EMPRegistry: undefined,
				v1EMPArrayUtility: undefined,
				v1EMPDeployer: undefined,
				v1EMPStrategyUtility: undefined,
				v1EMPStrategyDeployer: undefined
			};
		},

		actions: {
			setV1EMPRegistry(): void
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

			setAllContractAddresses(): void
			{
				console.log("Setting all contract adresses..");

				if (this.v1EMPRegistry)
				{
					this.v1EMPRegistry.methods.v1EMPArrayUtility().call().then((result) =>
					{
						this.v1EMPArrayUtility = String(result);
					}).catch((error) =>
					{
						this.v1EMPArrayUtility = "?";

						console.error("Error:", error);
					});

					this.v1EMPRegistry.methods.v1EMPUtility().call().then((result) =>
					{
						this.v1EMPUtility = String(result);

					}).catch((error) =>
					{
						this.v1EMPUtility = "?";

						console.error("Error:", error);
					});

					this.v1EMPRegistry.methods.v1EMPStrategyUtility().call().then((result) =>
					{
						this.v1EMPStrategyUtility = String(result);

					}).catch((error) =>
					{
						this.v1EMPStrategyUtility = "?";

						console.error("Error:", error);
					});

					this.v1EMPRegistry.methods.v1EMPDeployer().call().then((result) =>
					{
						this.v1EMPDeployer = String(result);

					}).catch((error) =>
					{
						this.v1EMPDeployer = "?";

						console.error("Error:", error);
					});

					this.v1EMPRegistry.methods.v1EMPStrategyDeployer().call().then((result) =>
					{
						this.v1EMPStrategyDeployer = String(result);

					}).catch((error) =>
					{
						this.v1EMPStrategyDeployer = "?";

						console.error("Error:", error);
					});
				}
				else
				{
					console.error("Registry not available.");
				}
			},

			async initialize(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				this.setV1EMPRegistry();
				this.setAllContractAddresses();

				watch(
					() => web3Wallet.networkId,
					async (networkIdNew, networkIdOld) =>
					{
						if (networkIdNew != networkIdOld)
						{
							this.setV1EMPRegistry();
							this.setAllContractAddresses();
						}
					}
				);
			}
		},
	}
);
