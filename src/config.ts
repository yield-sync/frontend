type Config = {
	getChainName: (chainId: number) => "mainnet" | "sepolia" | "base-sepolia",
	networkChain: {
		[key: string]: {
			chainId: string,
			chainName: string,
			nativeCurrency: {
				name: string,
				symbol: string,
				decimals: number,
			},
			rpcUrls: string[],
			blockExplorerUrls: string[]
			icon: string,
			yieldSyncGovernance: string
			v1EMPRegistry: string
		}
	},
}


import ethLogo from "./assets/eth.svg";
import baseLogo from "./assets/base.svg";


export default {
	getChainName: (chainId: number): "mainnet" | "sepolia" | "base-sepolia" =>
	{
		switch (chainId)
		{
			case 1:
				return "mainnet";

			case 11155111:
				return "sepolia";

			case 84532:
				return "base-sepolia";

			default:
				return "mainnet";
		}
	},

	networkChain: {
		1: {
			chainId: "0x1",
			chainName: "Ethereum Mainnet",
			nativeCurrency: {
				name: "ETH",
				symbol: "ETH",
				decimals: 18
			},
			rpcUrls: [
				"https://rpc.ankr.com/eth"
			],
			blockExplorerUrls: [
				"https://etherscan.io",
			],
			icon: ethLogo,
			yieldSyncGovernance: "0x0000000000000000000000000000000000000000",
			v1EMPRegistry: "0x0000000000000000000000000000000000000000",
		},

		11155111: {
			chainId: "0xAA36A7",
			chainName: "Ethereum Sepolia",
			nativeCurrency: {
				name: "ETH",
				symbol: "ETH",
				decimals: 18
			},
			rpcUrls: [
				"https://rpc.sepolia.org"
			],
			blockExplorerUrls: [
				"https://sepolia.etherscan.io",
			],
			icon: ethLogo,
			yieldSyncGovernance: "0xf0A36563020F90De506d0BaB29EdEfffAcD3A0F0",
			v1EMPRegistry: "0x0000000000000000000000000000000000000000",
		},

		84532: {
			chainId: "0x14a34",
			chainName: "Base Sepolia",
			nativeCurrency: {
				name: "ETH",
				symbol: "ETH",
				decimals: 18
			},
			rpcUrls: [
				"https://sepolia.base.org"
			],
			blockExplorerUrls: [
				"https://sepolia.basescan.org",
			],
			icon: baseLogo,
			yieldSyncGovernance: "0x5a0a98c17E61aA4Df761b4Fc77aC5ba77C93d6B6",
			v1EMPRegistry: "0xB21bB59caf6C58C1824123e87420AFF147481C01",
		},
	},
} as Config;
