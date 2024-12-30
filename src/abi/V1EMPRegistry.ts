export default [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__governance",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ONE_HUNDRED_PERCENT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "eRC20",
				"type": "address"
			}
		],
		"name": "eRC20_v1EMPERC20ETHValueFeed",
		"outputs": [
			{
				"internalType": "address",
				"name": "v1EMPERC20ETHValueFeed",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_eRC20",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_v1EMPERC20ETHValueFeed",
				"type": "address"
			}
		],
		"name": "eRC20_v1EMPERC20ETHValueFeedUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "governance",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "governancePayTo",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__governance",
				"type": "address"
			}
		],
		"name": "governanceUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPArrayUtility",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__v1EMPArrayUtility",
				"type": "address"
			}
		],
		"name": "v1EMPArrayUtilityUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPDeployer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__v1EMPDeployer",
				"type": "address"
			}
		],
		"name": "v1EMPDeployerUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPIdTracker",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "v1EMPId",
				"type": "uint256"
			}
		],
		"name": "v1EMPId_v1EMP",
		"outputs": [
			{
				"internalType": "address",
				"name": "v1EMP",
				"type": "address"
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
		"name": "v1EMPRegister",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPStrategyDeployer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__v1EMPStrategyDeployer",
				"type": "address"
			}
		],
		"name": "v1EMPStrategyDeployerUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPStrategyIdTracker",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "v1EMPStrategyId",
				"type": "uint256"
			}
		],
		"name": "v1EMPStrategyId_v1EMPStrategy",
		"outputs": [
			{
				"internalType": "address",
				"name": "v1EMPStrategy",
				"type": "address"
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
			}
		],
		"name": "v1EMPStrategyRegister",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPStrategyUtility",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__v1EMPStrategyUtility",
				"type": "address"
			}
		],
		"name": "v1EMPStrategyUtilityUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "v1EMPStrategy",
				"type": "address"
			}
		],
		"name": "v1EMPStrategy_v1EMPStrategyId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "v1EMPStrategyId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "v1EMPUtility",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "__v1EMPUtility",
				"type": "address"
			}
		],
		"name": "v1EMPUtilityUpdate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "v1EMP",
				"type": "address"
			}
		],
		"name": "v1EMP_v1EMPId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "v1EMPId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
