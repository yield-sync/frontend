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
		"name": "TOLERANCE",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMP",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "utilizedERC20",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "transferAmount",
				"type": "uint256"
			}
		],
		"name": "optimizedTransferAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "optimizedTransferAmount_",
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
				"name": "_v1EMP",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "_utilizedERC20Amount",
				"type": "uint256[]"
			}
		],
		"name": "utilizedERC20AmountValid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "valid_",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "utilizedERC20AmountTotalETHValue_",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "message_",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "utilizedStrategySync",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMP",
				"type": "address"
			},
			{
				"internalType": "address[]",
				"name": "_v1EMPStrategy",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_allocation",
				"type": "uint256[]"
			}
		],
		"name": "utilizedV1EMPStrategyValid",
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
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMP",
				"type": "address"
			},
			{
				"internalType": "uint256[][]",
				"name": "_v1EMPStrategyUtilizedERC20Amount",
				"type": "uint256[][]"
			}
		],
		"name": "v1EMPStrategyUtilizedERC20AmountValid",
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
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_v1EMP",
				"type": "address"
			}
		],
		"name": "v1EMP_utilizedERC20",
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
				"name": "_v1EMP",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "utilizedERC20",
				"type": "address"
			}
		],
		"name": "v1EMP_utilizedERC20_utilizationERC20",
		"outputs": [
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
				"internalType": "struct UtilizationERC20",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "v1EMP",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "v1EMPStrategy",
				"type": "address"
			}
		],
		"name": "v1EMP_v1EMPStrategy_utilizedERC20UpdateTracker",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "utilizedERC20UpdateTracker",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
