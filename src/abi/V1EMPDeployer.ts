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
		"inputs": [
			{
				"internalType": "bool",
				"name": "_utilizedERC20WithdrawFull",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			}
		],
		"name": "deployV1EMP",
		"outputs": [
			{
				"internalType": "address",
				"name": "v1EMP_",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deployV1EMPOpen",
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
				"name": "_deployV1EMPOpen",
				"type": "bool"
			}
		],
		"name": "deployV1EMPOpenUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
