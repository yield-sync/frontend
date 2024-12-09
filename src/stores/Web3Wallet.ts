import { defineStore } from "pinia";
import Web3 from "web3";


interface State
{
	walletConnected: boolean,
	web3?: Web3,
	accounts: string[],
	networkId: number,
	error: string,
}


interface Actions
{
	connectWallet(): Promise<void>,
	disconnectWallet(): void,
	initialize(): Promise<void>
	switchNetwork(networkId: string): Promise<void>,
}


const NO_WINDOW_ETHEREUM_ERROR: string = "No Ethereum provider found, please install a wallet";


function _withdowEthereumAvailable(): boolean
{
	if (window.ethereum)
	{
		return true;
	}

	return false
}

/**
* @notice This store is meant to store the web 3 wallet details.
*/
export const useWeb3WalletStore = defineStore<"Web3Wallet", State, {}, Actions>(
	"Web3Wallet",
	{
		state: () =>
		{
			return {
				walletConnected: false,
				web3: undefined,
				accounts: [],
				networkId: 1,
				error: "",
			};
		},

		actions: {
			disconnectWallet(): void
			{
				localStorage.removeItem("walletAddress");

				this.walletConnected = false;
				this.web3 = undefined;
				this.accounts = [];
				this.networkId = -1;
				this.error = "";
			},

			async connectWallet(): Promise<void>
			{
				if (!_withdowEthereumAvailable())
				{
					this.error = NO_WINDOW_ETHEREUM_ERROR;
				}

				try
				{
					this.web3 = new Web3(window.ethereum);

					this.accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

					this.networkId = Number(await this.web3.eth.net.getId());

					this.walletConnected = true;

					this.error = "";
				}
				catch (e: any)
				{
					if (e.code === 4001)
					{
						this.error = "User denied account access.";

						return;
					}

					this.error = String(e);
				}
			},

			async switchNetwork(chainId: string): Promise<void>
			{
				if (!window.ethereum)
				{
					this.error = NO_WINDOW_ETHEREUM_ERROR;

					return;
				}

				try
				{
					if (!this.web3)
					{
						this.error = "No web3 found";

						return;
					}

					await window.ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [
							{
								chainId
							},
						],
					});

					await this.connectWallet();
				}
				catch (e)
				{
					this.error = String(e);

					return;
				}
			},

			async initialize(): Promise<void>
			{
				if (!_withdowEthereumAvailable())
				{
					this.error = NO_WINDOW_ETHEREUM_ERROR;

					return;
				}

				await this.connectWallet();

				window.ethereum.on("accountsChanged", (accounts: string[]) =>
				{
					if (!accounts)
					{
						this.disconnectWallet();

						return;
					}

					this.accounts = accounts;
				});

				window.ethereum.on("chainChanged", async () =>
				{
					if (this.web3)
					{
						await this.connectWallet();
					}
				});
			}
		},
	}
);
