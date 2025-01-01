export default [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMPRegistry",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "deployV1EMPStrategy",
		"outputs": [
			{
				"internalType": "address",
				"name": "v1EMPStrategy_",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deployV1EMPStrategyOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_deployV1EMPStrategyOpen",
				"type": "bool"
			}
		],
		"name": "deployV1EMPStrategyOpenUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
