<template>
	<VCard class="m-0 rounded-xl elevation-0 clear">
		<VCardText>
			<VRow>
				<VCol cols="1">
					<h6 class="text-center text-uppercase text-primary">Status</h6>
				</VCol>

				<VCol cols="3">
					<h6 class="text-center text-uppercase text-primary">Type | Token Symbol</h6>
				</VCol>

				<VCol cols="2">
					<h6 class="text-center text-uppercase text-primary">Amount / ID</h6>
				</VCol>

				<VCol cols="2">
					<h6 class="text-center text-uppercase text-primary">To</h6>
				</VCol>

				<VCol cols="2">
					<h6 class="text-center text-uppercase text-primary">For : Against</h6>
				</VCol>

				<VCol cols="2">
					<h6 class="text-center text-uppercase text-primary">View</h6>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>

	<div v-if="loading" class="text-center">
		<VProgressCircular
			class=""
			indeterminate
			color="primary"
		/>
	</div>

	<div v-if="!loading" class="mb-6">
		<VCard
			v-for="(w, i) in detailedTransferRequests"
			:key="i"
			class="my-6 rounded-xl elevation-0 bg-light-frost"
		>
			<VCardText>
				<VRow>
					<VCol v-if="!opened[i]" cols="1">
						<h4 class="mt-2 text-center">
							{{
								(
									parseInt(w.forVoteCount) < forVoteCountRequired &&
									parseInt(w.againstVoteCount) < againstVoteCountRequired
								) ? '🗳️' : (
									parseInt(w.againstVoteCount) >= againstVoteCountRequired
								) ? '❌' : (
									currentTimestamp - w.latestRelevantForVoteBlockTimestamp >= transferDelaySeconds
								) ?  '✅' : '⏳'
							}}
						</h4>
					</VCol>

					<VCol v-if="!opened[i]" cols="3">
						<h4 v-if="w.forERC20" class="mt-2 text-center text-primary">
							ERC 20 | {{ w.tokenSymbol }}
						</h4>

						<h4 v-else-if="w.forERC721" class="mt-2 text-center text-primary">
							ERC 721 | {{ w.tokenSymbol }}
						</h4>

						<h4 v-else class="mt-2 text-center text-primary">
							Ether | {{ w.tokenSymbol }}
						</h4>
					</VCol>

					<VCol v-if="!opened[i]" cols="2">
						<h4 v-if="!w.forERC721" class="mt-2 text-center">{{ w.amount * 10 ** -18 }}</h4>
						<h4 v-if="w.forERC721" class="mt-2 text-center">#{{ w.tokenId }}</h4>
					</VCol>

					<VCol v-if="!opened[i]" cols="2">
						<a
							:href="`https://etherscan.io/address/${w.to}`"
							target="_blank"
							rel="noopener noreferrer"
							:title="w.to"
							class="text-center text-dark"
						>
							<VBtn variant="plain" class="w-100 rounded-xl">
								🔗 {{ w.to.substring(0, 4) + "..." + w.to.substring(w.to.length - 4) }}
							</VBtn>
						</a>
					</VCol>

					<VCol v-if="!opened[i]" cols="2">
						<h3 class="mt-2 text-center">
							<span class="text-success">{{ w.forVoteCount }}</span> :
							<span class="text-danger">{{ w.againstVoteCount }}</span>
						</h3>
					</VCol>

					<VCol v-if="!opened[i]" cols="2">
						<VBtn
							variant="flat"
							color="primary"
							class="w-100 rounded-xl elevation-0"
							@click="opened[i] = true"
						>
							<h1 class="m-0">+</h1>
						</VBtn>
					</VCol>

					<VCol v-if="opened[i]" cols="12">
						<VRow>
							<VCol cols="1">
								<h4 class="mt-2 text-center">
									{{
										(
											parseInt(w.forVoteCount) < forVoteCountRequired &&
											parseInt(w.againstVoteCount) < againstVoteCountRequired
										) ? '🗳️' : (
											parseInt(w.againstVoteCount) >= againstVoteCountRequired
										) ? '❌' : (
											currentTimestamp - w.latestRelevantForVoteBlockTimestamp >= transferDelaySeconds
										) ?  '✅' : '⏳'
									}}
								</h4>
							</VCol>

							<VCol cols="1">
								<RouterLink
									v-if="$route.query.admin == 'true'"
									:to="`/transfer-request-edit/${vaultAddress}/${w.id}`"
								>
									<VBtn color="admin" variant="flat" class="w-100 rounded-xl">
										Edit
									</VBtn>
								</RouterLink>
							</VCol>

							<VCol cols="8">
								<h3 class="mt-2 text-center text-uppercase text-primary">
									Transfer Request {{ w.id }}
								</h3>
							</VCol>

							<VCol cols="2">
								<VBtn
									variant="flat"
									color="primary"
									class="w-100 rounded-xl elevation-0"
									@click="opened[i] = false"
								>
									<h1 class="m-0">-</h1>
								</VBtn>
							</VCol>

							<VCol cols="4" class="text-left">
								<h4 v-if="w.forERC20" class="mb-3 text-center text-uppercase text-primary">
									ERC 20
								</h4>

								<h4 v-else-if="w.forERC721" class="mb-3 text-center text-uppercase text-primary">
									ERC 721
								</h4>

								<h4 v-else class="mb-3 text-center text-uppercase text-primary">
									Ether
								</h4>

								<a
									v-if="w.forERC20"
									:href="`https://etherscan.io/address/${w.tokenAddress}`"
									target="_blank"
									rel="noopener noreferrer"
									:title="w.tokenAddress"
								>
									<VBtn color="primary" variant="tonal" class="w-100 rounded-xl">
										🔗 {{ w.tokenSymbol }}
									</VBtn>
								</a>

								<a
									v-else-if="w.forERC721"
									:href="`https://etherscan.io/address/${w.tokenAddress}`"
									target="_blank"
									rel="noopener noreferrer"
									:title="w.tokenAddress"
								>
									<VBtn color="primary" variant="tonal" class="w-100 rounded-xl">
										🔗 {{ w.tokenSymbol }}
									</VBtn>
								</a>

								<a
									v-else
									href="https://etherscan.io/"
									target="_blank"
									rel="noopener noreferrer"
									class="text-decoration-none"
									:title="w.tokenAddress"
								>
									<VBtn color="primary" variant="tonal" class="w-100 rounded-xl">
										🔗 ETH
									</VBtn>
								</a>
							</VCol>

							<VCol v-if="!w.forERC721" cols="4" class="text-center">
								<h4 class="mb-3 text-uppercase text-primary">Amount</h4>
								<h3 class="text-dark">{{ w.amount * 10 ** -18 }}</h3>
							</VCol>

							<VCol v-if="w.forERC721" cols="4" class="text-center">
								<h4 class="mb-3 text-uppercase text-primary">Token Id</h4>
								<h3 class="text-dark">{{ w.tokenId }}</h3>
							</VCol>

							<VCol cols="4" class="text-center">
								<h4 class="mb-3 text-uppercase text-primary">Created By</h4>

								<a
									:href="`https://etherscan.io/address/${w.creator}`"
									target="_blank"
									rel="noopener noreferrer"
									class="text-decoration-none"
									:title="w.tokenAddress"
								>
									<h3 class="text-center text-uppercase text-dark" :title="w.creator">
										{{ w.creator.substring(0, 4) + "..." + w.creator.substring(w.creator.length - 4) }}
									</h3>
								</a>
							</VCol>

							<VCol cols="12" class="text-center">
								<h4 class="mb-3 text-center text-uppercase text-primary">Transfer To</h4>
								<a
									:href="`https://etherscan.io/address/${w.to}`"
									target="_blank"
									rel="noopener noreferrer"
									class="text-decoration-none"
									:title="w.tokenAddress"
								>
									<h3 class="text-center text-uppercase text-dark">{{ w.to }}</h3>
								</a>
							</VCol>

							<VCol cols="6" class="text-center">
								<h4 class="text-center mb-3 text-success text-uppercase">For</h4>

								<VProgressLinear
									color="success"
									:model-value="(parseInt(w.forVoteCount) / forVoteCountRequired * 100)"
									:height="36"
									striped
									class="mb-3 rounded-xl"
								>
									<strong>{{ w.forVoteCount }}/{{ forVoteCountRequired }}</strong>
								</VProgressLinear>

								<VBtn
									v-if="(
										parseInt(w.forVoteCount) < forVoteCountRequired &&
										parseInt(w.againstVoteCount) < againstVoteCountRequired
									)"
									:disabled="voting[w.id]"
									variant="flat"
									color="success"
									class="px-6 rounded-xl elevation-0"
									@click="voteOnTransferRequest(w.id, true)"
								>
									Vote For
								</VBtn>
							</VCol>

							<VCol cols="6" class="text-center">
								<h4 class="text-center mb-3 text-danger text-uppercase">Against</h4>

								<VProgressLinear
									color="danger"
									:model-value="(parseInt(w.againstVoteCount) / againstVoteCountRequired * 100)"
									:height="36"
									striped
									class="mb-3 rounded-xl"
								>
									<strong>{{ w.againstVoteCount }}/{{ againstVoteCountRequired }}</strong>
								</VProgressLinear>

								<VBtn
									v-if="(
										parseInt(w.forVoteCount) < forVoteCountRequired &&
										parseInt(w.againstVoteCount) < againstVoteCountRequired
									)"
									:disabled="voting[w.id]"
									variant="flat"
									color="danger"
									class="px-6 rounded-xl elevation-0"
									@click="voteOnTransferRequest(w.id, false)"
								>
									Vote Against
								</VBtn>
							</VCol>

							<VCol v-if="false" cols="12">
								<h4 class="mb-3 text-primary">Voted Voter</h4>
								<h4 v-for="(v, i) in w.votedMembers" :key="i">
									{{ i + 1 }}. {{ v.substring(0, 4) + "..." + v.substring(v.length - 4) }}
								</h4>
							</VCol>

							<VCol cols="12">
								<h4 class="mb-3 text-center text-primary">
									Latest Relevant For Vote Time
								</h4>
								<h3 class="mb-3 text-center text-dark">
									{{ w.latestRelevantForVoteTime }}
								</h3>
							</VCol>

							<VCol cols="12">
								<VBtn
									v-if="
										parseInt(w.againstVoteCount) >= againstVoteCountRequired || (
											parseInt(w.forVoteCount) >= forVoteCountRequired && (
												currentTimestamp - w.latestRelevantForVoteBlockTimestamp
											) >= transferDelaySeconds
										)
									"
									:disabled="processing[w.id]"
									color="primary"
									class="w-100 rounded-xl elevation-0"
									@click="processTransferRequest(w.id)"
								>
									Proccess Request
								</VBtn>
							</VCol>

							<VCol v-if="error" cols="12">
								<h6 class="text-danger">{{ error }}</h6>
							</VCol>
						</VRow>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>

	</div>

	<VCard class="rounded-xl elevation-0 bg-light-frost">
		<VCardText>
			<VRow>
				<VCol cols="12" sm="3">
					<h6 class="text-center text-uppercase text-dark">
						🗳️ Voting in Progress
					</h6>
				</VCol>

				<VCol cols="12" sm="3">
					<h6 class="text-center text-uppercase text-dark">
						⏳ Waiting Delay
					</h6>
				</VCol>

				<VCol cols="12" sm="3">
					<h6 class="text-center text-uppercase text-dark">
						✅ Approved
					</h6>
				</VCol>

				<VCol cols="12" sm="3">
					<h6 class="text-center text-uppercase text-dark">
						❌ Denied
					</h6>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { TransactionReceipt } from "web3-core";
	import { Contract } from "web3-eth-contract";
	import { AbiItem } from "web3-utils";

	import abiER20 from "../../abi/erc20";
	import yieldSyncV1VaultABI from "../../abi/YieldSyncV1Vault";

	export default defineComponent({
		name: "CTransferRequest",

		props: {
			vaultAddress: {
				required: true,
				type: String
			},

			asAdmin: {
				type: Boolean,
				default: false
			},
		},

		data()
		{
			return {
				loading: true as boolean,

				currentTimestamp: 99999999999999 as number,
				voting: {
				} as {
					[key: string]: boolean,
				},
				processing: {
				} as {
					[key: string]: boolean,
				},
				yieldSyncV1Vault: undefined as undefined | Contract,
				againstVoteCountRequired: 0 as number,
				forVoteCountRequired: 0 as number,
				transferDelaySeconds: 0 as number,
				opened: {
				} as {
					[key: string]: boolean,
				},
				idsOfOpenTransferRequests: [
				],
				detailedTransferRequests: [
				] as {
					id: number,
					againstVoteCount: string,
					amount: number,
					creator: string,
					forERC20: boolean,
					forERC721: boolean,
					forVoteCount: string,
					latestRelevantForVoteTime: string,
					latestRelevantForVoteBlockTimestamp: number,
					to: string,
					token: string,
					tokenSymbol: string,
					tokenAddress: string,
					tokenId: string,
					votedMembers: string[],
				}[],

				error: "" as string,
			};
		},

		methods: {
			async setCurrentBlockTimestamp()
			{
				// Get the current block number
				this.$store.state.web3.eth.getBlockNumber((error: string, blockNumber: number) =>
				{
					if (error)
					{
						console.error("Error:", error);
						return;
					}

					// Get the block details
					this.$store.state.web3.eth.getBlock(blockNumber, (
						error: string,
						block: {
							number: number;
							hash: string;
							parentHash: string;
							nonce: string;
							sha3Uncles: string;
							logsBloom: string;
							transactionsRoot: string;
							stateRoot: string;
							miner: string;
							difficulty: string;
							totalDifficulty: string;
							extraData: string;
							size: number;
							gasLimit: number;
							gasUsed: number;
							timestamp: number;
							transactions: string[];
							uncles: string[];
						}
					) =>
					{
						if (error)
						{
							console.error("Error:", error);
							return;
						}

						// Retrieve the timestamp of the current block
						this.currentTimestamp = block.timestamp;

						console.log("Current block timestamp:", this.currentTimestamp);
					});
				});
			},

			async getTransferRequestData()
			{
				this.loading = true;

				await this.setCurrentBlockTimestamp();

				if (!this.yieldSyncV1Vault)
				{
					return;
				}

				this.detailedTransferRequests = [
				];

				this.againstVoteCountRequired = await this.yieldSyncV1Vault.methods.againstVoteCountRequired().call();

				this.forVoteCountRequired = await this.yieldSyncV1Vault.methods.forVoteCountRequired().call();

				this.transferDelaySeconds = await this.yieldSyncV1Vault.methods.transferDelaySeconds().call();

				this.idsOfOpenTransferRequests = await this.yieldSyncV1Vault.methods.idsOfOpenTransferRequests()
					.call();

				for (let i = 0; i < this.idsOfOpenTransferRequests.length; i++)
				{
					const wr = await this.yieldSyncV1Vault.methods.transferRequestId_transferRequest(
						this.idsOfOpenTransferRequests[i]
					).call();

					// Get token details
					const erc20Contract = new this.$store.state.web3.eth.Contract(
						abiER20 as AbiItem[],
						wr.token
					);

					let name = "N.A.";
					let symbol = "N.A.";

					try
					{
						name = await erc20Contract.methods.name().call();
						symbol = await erc20Contract.methods.symbol().call();
					}
					catch (e)
					{
						console.log(e);
					}

					// Create a new Date object using the JavaScript timestamp
					const date = new Date(wr.latestRelevantForVoteTime * 1000);

					// Get the individual components of the date and time
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					const hours = date.getHours();
					const minutes = date.getMinutes();
					const seconds = date.getSeconds();

					this.detailedTransferRequests.push({
						id: this.idsOfOpenTransferRequests[i],
						againstVoteCount: wr.againstVoteCount,
						amount: wr.amount,
						creator: wr.creator,
						forERC20: wr.forERC20,
						forERC721: wr.forERC721,
						forVoteCount: wr.forVoteCount,
						latestRelevantForVoteTime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
						latestRelevantForVoteBlockTimestamp: wr.latestRelevantForVoteTime,
						to: wr.to,
						token: !wr.forERC20 && !wr.forERC721 ? "Ether" : name,
						tokenSymbol: !wr.forERC20 && !wr.forERC721 ? "ETH" : symbol,
						tokenAddress: wr.token,
						tokenId: wr.tokenId,
						votedMembers: wr.votedMembers
					});
				}

				this.loading = false;
			},

			async processTransferRequest(wId: number)
			{
				if (!this.yieldSyncV1Vault)
				{
					return;
				}

				await this.yieldSyncV1Vault.methods.processTransferRequest(wId).send({
					from: this.$store.state.wallet.accounts[0]
				}).on("sent", async () =>
				{
					this.processing[wId] = true;
				}).on("confirmation", async (confirmationNumber: number, receipt: TransactionReceipt) =>
				{
					console.log(`Confirmation #${confirmationNumber}`, receipt);

					if (confirmationNumber == 0)
					{
						this.processing[wId] = false;

						await this.getTransferRequestData();
					}

				}).on("error", async (error: Error) =>
				{
					this.error = String(error);

					this.processing[wId] = false;
				});
			},

			async voteOnTransferRequest(wId: number, vote: boolean)
			{
				if (!this.yieldSyncV1Vault)
				{
					return;
				}

				await this.yieldSyncV1Vault.methods.voteOnTransferRequest(
					wId, vote
				).send({
					from: this.$store.state.wallet.accounts[0]
				}).on("sent", async () =>
				{
					this.voting[wId] = true;
				}).on("confirmation", async (confirmationNumber: number, receipt: TransactionReceipt) =>
				{
					console.log(`Confirmation #${confirmationNumber}`, receipt);
					if (confirmationNumber == 0)
					{
						await this.getTransferRequestData();

						this.voting[wId] = false;
					}
				}).on("error", async (error: Error) =>
				{
					this.error = String(error);

					this.voting[wId] = false;
				});
			},
		},

		async created()
		{
			this.yieldSyncV1Vault = new this.$store.state.web3.eth.Contract(
				yieldSyncV1VaultABI as AbiItem[],
				this.vaultAddress
			);

			await this.getTransferRequestData();
		}
	});
</script>

<style lang="scss" scoped>
	.clear {
		background-color: rgba(255, 255, 255, 0);
	}
</style>
