// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";
import $store from "../store";

export default async (ALCHEMY_API_KEY: string, address: string) =>
{
	let network = Network.ETH_MAINNET;

	try
	{
		switch ($store.state.currentChain.id)
		{
		case 1:
			network = Network.ETH_MAINNET;
			break;

		case 5:
			network = Network.ETH_GOERLI;
			break;

		case 10:
			network = Network.OPT_MAINNET;
			break;

		case 420:
			network = Network.OPT_GOERLI;
			break;

		case 11155111:
			network = Network.ETH_SEPOLIA;
			break;

		default:
			console.log("alchemy/getNFTBalances: Invalid network");

			break;
		}

		const alchemy = new Alchemy({
			apiKey: ALCHEMY_API_KEY,
			network,
		});

		return await alchemy.nft.getNftsForOwner(address);
	}
	catch (e)
	{
		return e;
	}
};
