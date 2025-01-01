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
				"internalType": "address",
				"name": "_v1EMPStrategy",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "_utilizedERC20Amount",
				"type": "uint256[]"
			}
		],
		"name": "depositAmountsValid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "valid_",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "message_",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "utilizedERC20AmountETHValueTotal_",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMPStrategy",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "_utilizedERC20Amount",
				"type": "uint256[]"
			}
		],
		"name": "utilizedERC20AmountETHValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "utilizedERC20AmountETHValueTotal_",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "utilizedERC20AmountETHValue_",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "_utilizedERC20",
				"type": "address[]"
			}
		],
		"name": "utilizedERC20Sort",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMPStrategy",
				"type": "address"
			},
			{
				"internalType": "address[]",
				"name": "_utilizedERC20",
				"type": "address[]"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "deposit",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "withdraw",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "allocation",
						"type": "uint256"
					}
				],
				"internalType": "struct UtilizationERC20[]",
				"name": "_utilizationERC20",
				"type": "tuple[]"
			}
		],
		"name": "utilizedERC20UpdateValid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "valid_",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "message_",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
