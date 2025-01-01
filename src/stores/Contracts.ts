import { defineStore } from "pinia";
import { watch } from "vue";
import { Contract } from "web3-eth-contract";
import { isAddress } from "web3-validator";
import type { AbiItem } from "web3-utils";

import V1EMPArrayUtility from "@/abi/V1EMPArrayUtility";
import V1EMPDeployer from "@/abi/V1EMPDeployer";
import V1EMPUtility from "@/abi/V1EMPUtility";
import V1EMPRegistry from "@/abi/V1EMPRegistry";
import V1EMPStrategyDeployer from "@/abi/V1EMPStrategyDeployer";
import V1EMPStrategyUtility from "@/abi/V1EMPStrategyUtility";
import config from "@/config";
import useWeb3WalletStore from "@/stores/Web3Wallet";


type State = {
	error: string,
	v1EMPRegistry?: Contract<AbiItem[]>,
	v1EMPArrayUtility?: Contract<AbiItem[]>,
	v1EMPUtility?: Contract<AbiItem[]>,
	v1EMPDeployer?: Contract<AbiItem[]>,
	v1EMPStrategyUtility?: Contract<AbiItem[]>,
	v1EMPStrategyDeployer?: Contract<AbiItem[]>,
}

type Getters = {
};

type Actions = {
	_setAllContracts(): Promise<void>,
	setV1EMPRegistry(): Promise<void>,
	setV1EMPArrayUtility(): Promise<void>,
	setV1EMPDeployer(): Promise<void>,
	setV1EMPUtility(): Promise<void>,
	setV1EMPStrategyDeployer(): Promise<void>,
	setV1EMPStrategyUtility(): Promise<void>,
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

		getters: {},

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
					this.error = "setV1EMPArrayUtility: Registry not set";

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

			async setV1EMPDeployer(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "setV1EMPDeployer: No web3 found";

					return;
				}

				if (!this.v1EMPRegistry)
				{
					this.error = "setV1EMPDeployer: Registry not set";

					return;
				}

				try
				{
					const result = await this.v1EMPRegistry.methods.v1EMPDeployer().call();

					if (!isAddress(String(result)))
					{
						this.error = "setV1EMPDeployer: Get address failure";

						return;
					}

					this.v1EMPDeployer = new web3Wallet.web3.eth.Contract(
						V1EMPDeployer as AbiItem[],
						String(result)
					);
				}
				catch (error)
				{
					this.error = String(error);
				}
			},

			async setV1EMPUtility(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "setV1EMPUtility: No web3 found";

					return;
				}

				if (!this.v1EMPRegistry)
				{
					this.error = "setV1EMPUtility: Registry not set";

					return;
				}

				try
				{
					const result = await this.v1EMPRegistry.methods.v1EMPUtility().call();

					if (!isAddress(String(result)))
					{
						this.error = "setV1EMPUtility: Get address failure";

						return;
					}

					this.v1EMPUtility = new web3Wallet.web3.eth.Contract(
						V1EMPUtility as AbiItem[],
						String(result)
					);
				}
				catch (error)
				{
					this.error = String(error);
				}
			},

			async setV1EMPStrategyDeployer(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "setV1EMPStrategyDeployer: No web3 found";

					return;
				}

				if (!this.v1EMPRegistry)
				{
					this.error = "setV1EMPStrategyDeployer: Registry not set";

					return;
				}

				try
				{
					const result = await this.v1EMPRegistry.methods.v1EMPStrategyDeployer().call();

					if (!isAddress(String(result)))
					{
						this.error = "setV1EMPStrategyDeployer: Get address failure";

						return;
					}

					this.v1EMPStrategyDeployer = new web3Wallet.web3.eth.Contract(
						V1EMPStrategyDeployer as AbiItem[],
						String(result)
					);
				}
				catch (error)
				{
					this.error = String(error);
				}
			},

			async setV1EMPStrategyUtility(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "setV1EMPStrategyUtility: No web3 found";

					return;
				}

				if (!this.v1EMPRegistry)
				{
					this.error = "setV1EMPStrategyUtility: Registry not set";

					return;
				}

				try
				{
					const result = await this.v1EMPRegistry.methods.v1EMPStrategyUtility().call();

					if (!isAddress(String(result)))
					{
						this.error = "setV1EMPStrategyUtility: Get address failure";

						return;
					}

					this.v1EMPStrategyUtility = new web3Wallet.web3.eth.Contract(
						V1EMPStrategyUtility as AbiItem[],
						String(result)
					);
				}
				catch (error)
				{
					this.error = String(error);
				}
			},

			async _setAllContracts(): Promise<void>
			{
				console.log("Setting all contract..");

				await this.setV1EMPRegistry();
				await this.setV1EMPArrayUtility();
				await this.setV1EMPDeployer();
				await this.setV1EMPUtility();
				await this.setV1EMPStrategyDeployer();
				await this.setV1EMPStrategyUtility();
			},

			async initialize(): Promise<void>
			{
				const web3Wallet = useWeb3WalletStore();

				await this._setAllContracts();

				watch(
					() => web3Wallet.networkId,
					async (networkIdNew, networkIdOld) =>
					{
						if (networkIdNew != networkIdOld)
						{
							await this._setAllContracts();
						}
					}
				);
			}
		},
	}
);
