<template>
	<VContainer class="py-16">
		<div class="w-100 mx-auto" style="max-width: 1000px;">
			<RouterLink :to="`/v1-vault/${this.$route.params.vaultaddress}`">
				<VBtn
					class="mb-3 rounded-xl elevation-0 bg-light-frost text-primary"
					@click="
						this.$store.state.view.v1Vault.tab = 'tr';
						this.$store.state.view.v1Vault.transferRequests.tab = 'o';
						this.$store.state.view.v1Vault.transferRequest.for = 'Ether';
					"
				>
					⬅️ Return to Vault
				</VBtn>
			</RouterLink>

			<VCard class="mb-6 rounded-xl elevation-0 bg-light-frost">
				<VCardTitle class="text-primary">
					<h4 class="m-0 text-center text-uppercase">Edit Transfer Request</h4>
				</VCardTitle>

				<VCardText class="mt-4">
					<VRow>
						<VCol sm="12">
							<!-- CREATOR -->
							<VTextField
								v-model="this.transferRequest.creator"
								type="text"
								label="Creator"
								variant="outlined"
								hide-details
								class="mb-3"
								size="small"
							/>
						</VCol>

						<VCol cols="12">
							<fieldset class="border-0">
								<input
									v-model="this.transferRequest.for"
									type="radio"
									value="Ether"
									id="Ether"
									checked
								/>

								<label for="Ether">Ether</label>

								<input
									v-model="this.transferRequest.for"
									type="radio"
									value="ERC 20"
									id="ERC 20"
								/>

								<label for="ERC 20">ERC 20</label>

								<input
									v-model="this.transferRequest.for"
									type="radio"
									value="ERC 721"
									id="ERC 721"
								/>

								<label for="ERC 721">ERC 721</label>
							</fieldset>
						</VCol>

						<VCol sm="12">
							<!-- TO -->
							<VTextField
								v-model="this.transferRequest.to"
								type="text"
								label="To"
								variant="outlined"
								hide-details
								class="mb-3"
								size="small"
							/>

						</VCol>

						<VCol sm="6">
							<!-- TOKEN -->
							<VTextField
								v-model="this.transferRequest.token"
								:disabled="this.transferRequest.for == 'Ether'"
								type="text"
								label="Token"
								variant="outlined"
								hide-details
								class="mb-3"
								size="small"
							/>

						</VCol>

						<VCol sm="2">
							<!-- TOKEN ID -->
							<VTextField
								v-model="this.transferRequest.tokenId"
								:disabled="this.transferRequest.for != 'ERC 721'"
								type="number"
								label="Token Id"
								variant="outlined"
								hide-details
								class="mb-3"
								size="small"
							/>
						</VCol>

						<VCol sm="4">
							<!-- AMOUNT -->
							<VTextField
								v-model="this.transferRequest.amount"
								type="number"
								label="Amount"
								variant="outlined"
								hide-details
								class="mb-3"
								size="small"
							/>
						</VCol>

						<VCol cols="12">
							<VBtn
								:disabled="this.updatingTR"
								variant="flat"
								color="primary"
								border-primary="primary"
								class="w-100 rounded-xl"
								@click="this.updateTransferRequest()"
							>
								Update
							</VBtn>
						</VCol>
					</VRow>
				</VCardText>
			</VCard>
		</div>

		<div class="w-100 mx-auto" style="max-width: 1000px;">
			<VCard class="mb-6 rounded-xl elevation-0 bg-light-frost">
				<VCardTitle class="bg-light-frost text-primary">
					<h4 class="m-0 text-center text-uppercase">Edit Transfer Request Poll</h4>
				</VCardTitle>

				<VCardText class="mt-4">
					<VRow>
						<VCol sm="12">
							<!-- Latest Relevant For Vote Time -->
							<VTextField
								v-model="this.transferRequest.latestForVoteTime"
								type="number"
								label="Latest Relevant For Vote Time"
								variant="outlined"
								hide-details
								class="mb-3"
								size="small"
							/>
						</VCol>

						<VCol cols="12">
							<h3 class="mb-6 text-primary">Voted For Members</h3>

							<VRow
								v-for="(m, i) in this.transferRequest.voteForMembers" :key="i"
								class="mb-3"
							>
								<VCol md="10">
									<h3 class="member-or-admin my-2">{{ m }}</h3>
								</VCol>

								<VCol md="2">
									<VBtn
										variant="tonal"
										color="danger"
										class="w-100 rounded-xl elevation-0 border"
										@click="this.removeVoteForMember(i)"
									>
										✕
									</VBtn>
								</VCol>
							</VRow>

							<VRow>
								<VCol md="10">
									<VTextField
										v-model="this.addVoteForMemberField"
										label="Add Voted Member Address"
										variant="outlined"
									/>
								</VCol>

								<VCol md="2">
									<VBtn
										variant="tonal"
										color="success"
										class="w-100 rounded-xl elevation-0 border"
										@click="this.addVoteForMember()"
									>
										Add
									</VBtn>
								</VCol>
							</VRow>
						</VCol>

						<VCol cols="12">
							<h3 class="mb-6 text-primary">Voted Against Members</h3>

							<VRow
								v-for="(m, i) in this.transferRequest.voteAgainstMembers" :key="i"
								class="mb-3"
							>
								<VCol md="10">
									<h3 class="member-or-admin my-2">{{ m }}</h3>
								</VCol>

								<VCol md="2">
									<VBtn
										variant="tonal"
										color="danger"
										class="w-100 rounded-xl elevation-0 border"
										@click="this.removeVoteAgainstMember(i)"
									>
										✕
									</VBtn>
								</VCol>
							</VRow>

							<VRow>
								<VCol md="10">
									<VTextField
										v-model="this.addVoteAgainstMemberField"
										label="Add Voted Member Address"
										variant="outlined"
									/>
								</VCol>

								<VCol md="2">
									<VBtn
										variant="tonal"
										color="success"
										class="w-100 rounded-xl elevation-0 border"
										@click="this.addVoteAgainstMember()"
									>
										Add
									</VBtn>
								</VCol>
							</VRow>
						</VCol>

						<VCol sm="12">
							<VBtn
								:disabled="this.updatingTRP"
								variant="flat"
								color="primary"
								border-primary="primary"
								class="w-100 rounded-xl"
								@click="this.updateTransferRequestPoll()"
							>
								<VProgressCircular
									v-if="this.updatingTRP"
									indeterminate
									color="light"
								/>

								<h2 v-else>Update</h2>
							</VBtn>
						</VCol>
					</VRow>
				</VCardText>
			</VCard>
		</div>
	</VContainer>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { TransactionReceipt } from "web3-core";
	import { Contract } from "web3-eth-contract";
	import { AbiItem } from "web3-utils";

	import yieldSyncV1VaultABI from "../abi/YieldSyncV1Vault";
	import YieldSyncV1ATransferRequestProtocol from "../abi/YieldSyncV1ATransferRequestProtocol";

	type UpdateTransferRequest = [
		// forERC20
		boolean,
		// forERC721
		boolean,
		// creator
		string,
		// to
		string,
		// token
		string,
		// amount
		bigint,
		// created
		number,
		// tokenId
		number,
	]

	type UpdateTransferRequestPoll = [
		// latestForVoteTime
		number,
		// votedAgainstMembers
		string[],
		// votedForMembers
		string[],
	]

	export default defineComponent({
		name: "RVV1Vault",

		data()
		{
			return {
				ZeroAddress: "0x0000000000000000000000000000000000000000",
				updatingTR: false,
				updatingTRP: false,
				yieldSyncV1Vault: undefined as undefined | Contract,

				transferRequest: {
					for: "Ether" as "Ether" | "ERC 20" | "ERC 721",
					creator: "" as string,
					token: "" as string,
					tokenId: 0 as number,
					amount: 0 as number,
					to: "" as string,
					created: 0 as number,
					latestForVoteTime: 0 as number,
					voteForMembers: [
					] as string[],
					voteAgainstMembers: [
					] as string[],
				},

				error: "",
				addVoteAgainstMemberField: "",
				addVoteForMemberField: "",

				transferRequestProtocol: this.$store.state.config.networkChain[
					this.$store.state.currentChain.name
				].yieldSyncV1ATransferRequestProtocol,
			};
		},

		methods: {
			addVoteAgainstMember()
			{
				if (this.$store.state.web3.utils.isAddress(this.addVoteAgainstMemberField))
				{
					// Add member
					this.transferRequest.voteAgainstMembers = [
						...this.transferRequest.voteAgainstMembers,
						this.addVoteAgainstMemberField,
					];

					// Clear field
					this.addVoteAgainstMemberField = "";
				}
			},

			removeVoteAgainstMember(i: number)
			{
				if (i > -1)
				{
					this.transferRequest.voteAgainstMembers = this.transferRequest.voteAgainstMembers.filter(
						(m: string) =>
						{
							return m !== this.transferRequest.voteAgainstMembers[i];
						}
					);
				}
			},

			addVoteForMember()
			{
				if (this.$store.state.web3.utils.isAddress(this.addVoteForMemberField))
				{
					// Add member
					this.transferRequest.voteForMembers = [
						...this.transferRequest.voteForMembers,
						this.addVoteForMemberField,
					];

					// Clear field
					this.addVoteForMemberField = "";
				}
			},

			removeVoteForMember(i: number)
			{
				if (i > -1)
				{
					this.transferRequest.voteForMembers = this.transferRequest.voteForMembers.filter(
						(m: string) =>
						{
							return m !== this.transferRequest.voteForMembers[i];
						}
					);
				}
			},

			async updateTransferRequest()
			{
				const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
					YieldSyncV1ATransferRequestProtocol as AbiItem[],
					this.transferRequestProtocol
				);

				if (!transferRequestProtocol)
				{
					this.error = "No transfer request found";
					return;
				}

				const updatedTransferRequest: UpdateTransferRequest = [
					this.transferRequest.for == "ERC 20" ? true : false,
					this.transferRequest.for == "ERC 721" ? true : false,
					this.transferRequest.creator,
					this.transferRequest.to,
					this.transferRequest.for !== "Ether" ? this.transferRequest.token : this.ZeroAddress,
					BigInt(this.transferRequest.amount * 10 ** 18),
					this.transferRequest.created,
					this.transferRequest.tokenId,
				];

				transferRequestProtocol.methods.yieldSyncV1Vault_transferRequestId_transferRequestUpdate(
					this.$route.params.vaultaddress,
					this.$route.params.transferrequestid,
					updatedTransferRequest
				).send(
					{
						from: this.$store.state.wallet.accounts[0]
					}
				).on(
					"sent",
					async () =>
					{
						this.updatingTR = true;
					}
				).on(
					"confirmation",
					async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.$store.state.view.v1Vault.transferRequests.tab = "o";
							this.$store.state.view.v1Vault.transferRequests.key++;
						}

						this.updatingTR = false;
					}
				).on(
					"error",
					async (error: Error) =>
					{
						this.error = String(error);

						this.updatingTR = false;
					}
				);
			},

			async updateTransferRequestPoll()
			{
				const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
					YieldSyncV1ATransferRequestProtocol as AbiItem[],
					this.transferRequestProtocol
				);

				if (!transferRequestProtocol)
				{
					this.error = "No transfer request found";
					return;
				}

				const updateTransferRequestPoll: UpdateTransferRequestPoll = [
					this.transferRequest.latestForVoteTime,
					this.transferRequest.voteAgainstMembers,
					this.transferRequest.voteForMembers,
				];

				transferRequestProtocol.methods.yieldSyncV1Vault_transferRequestId_transferRequestPollAdminUpdate(
					this.$route.params.vaultaddress,
					this.$route.params.transferrequestid,
					updateTransferRequestPoll
				).send(
					{
						from: this.$store.state.wallet.accounts[0]
					}
				).on(
					"sent",
					async () =>
					{
						this.updatingTRP = true;
					}
				).on(
					"confirmation",
					async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.$store.state.view.v1Vault.transferRequests.tab = "o";
							this.$store.state.view.v1Vault.transferRequests.key++;
						}

						this.updatingTRP = false;
					}
				).on(
					"error",
					async (error: Error) =>
					{
						this.error = String(error);

						this.updatingTRP = false;
					}
				);
			},
		},

		async created(): Promise<void>
		{
			this.yieldSyncV1Vault = new this.$store.state.web3.eth.Contract(
				yieldSyncV1VaultABI as AbiItem[],
				this.$route.params.vaultaddress
			);

			const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
				YieldSyncV1ATransferRequestProtocol as AbiItem[],
				this.transferRequestProtocol
			);

			if (!transferRequestProtocol)
			{
				this.error = "No transfer request found";
				return;
			}

			const tR = await transferRequestProtocol.methods.yieldSyncV1Vault_transferRequestId_transferRequest(
				this.$route.params.vaultaddress,
				this.$route.params.transferrequestid
			).call();

			const tRP = await transferRequestProtocol.methods.yieldSyncV1Vault_transferRequestId_transferRequestPoll(
				this.$route.params.vaultaddress,
				this.$route.params.transferrequestid
			).call();

			if (this.transferRequest)
			{
				if (tR.forERC20 && !tR.forERC721)
				{
					this.transferRequest.for = "ERC 20";
				}

				if (!tR.forERC20 && tR.forERC721)
				{
					this.transferRequest.for = "ERC 721";
				}

				this.transferRequest.creator = String(tR.creator);
				this.transferRequest.token =  String(tR.token);
				this.transferRequest.tokenId =  parseInt(tR.tokenId);
				this.transferRequest.amount = parseInt(tR.amount) * 10 ** -18;
				this.transferRequest.to = String(tR.to);
				this.transferRequest.created = tR.created;
				this.transferRequest.voteForMembers.length =  parseInt(tRP.voteForMembers.length);
				this.transferRequest.voteAgainstMembers.length =  parseInt(tRP.voteAgainstMembers.length);
				this.transferRequest.latestForVoteTime = parseInt(tRP.latestForVoteTime);
				this.transferRequest.voteForMembers = tRP.voteForMembers;
				this.transferRequest.voteAgainstMembers = tRP.voteAgainstMembers;
			}
		},
	});
</script>

<style scoped>
p, label {
    font: 1rem 'Fira Sans', sans-serif;
}

input {
    margin: 0.4rem;
}
</style>
