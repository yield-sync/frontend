<template>
	<VCard class="mb-6 rounded-xl elevation-0 bg-light-frost">
		<VCardTitle class="text-primary">
			<h4 class="m-0 text-center text-uppercase">🔧 Properties</h4>
		</VCardTitle>

		<VCardText class="mt-4">
			<VCard class="mb-6 px-3 py-3 rounded-xl elevation-0 bg-light-frost">
				<VRow>
					<VCol :cols="this.asAdmin ? 8 : 12" class="text-center">
						<h3 class="mb-3 text-uppercase text-primary">✅ For Vote Count Required</h3>

						<h3 v-if="!this.asAdmin || !this.edit.voteForRequired" class="m-0">
							{{ this.vault.voteForRequired }}
						</h3>

						<VTextField
							v-if="this.asAdmin && this.edit.voteForRequired"
							v-model="this.update.voteForRequired"
							size="sm"
							type="number"
							label="New For Vote Count"
							variant="outlined"
						/>
					</VCol>

					<VCol v-if="this.asAdmin" cols="4" class="text-right">
						<VBtn
							:disabled="this.updating.voteForRequired"
							variant="flat"
							:color="this.edit.voteForRequired ? 'danger' : 'admin'"
							class="w-100 mb-3 rounded-xl"
							@click="this.edit.voteForRequired = !this.edit.voteForRequired"
						>
							{{ this.edit.voteForRequired ? 'Cancel' : 'Edit' }}
						</VBtn>

						<VBtn
							v-if="this.edit.voteForRequired"
							:disabled="this.updating.voteForRequired"
							variant="tonal"
							color="success"
							class="w-100 mb-3 rounded-xl"
							@click="this.updatevoteForRequired()"
						>
							Update
						</VBtn>
					</VCol>
				</VRow>
			</VCard>

			<VCard class="mb-6 px-3 py-3 rounded-xl elevation-0 bg-light-frost">
				<VRow>
					<VCol :cols="this.asAdmin ? 8 : 12" class="text-center">
						<h3 class="mb-3 text-uppercase text-primary">❌ Against Vote Count Required</h3>

						<h3 v-if="!this.asAdmin || !this.edit.voteAgainstRequired" class="m-0">
							{{ this.vault.voteAgainstRequired }}
						</h3>

						<VTextField
							v-if="this.asAdmin && this.edit.voteAgainstRequired"
							v-model="this.update.voteAgainstRequired"
							size="sm"
							type="number"
							label="New Against Vote Count"
							variant="outlined"
							class="rounded-xl"
						/>
					</VCol>

					<VCol v-if="this.asAdmin" cols="4" class="text-right">
						<VBtn
							:disabled="this.updating.voteAgainstRequired"
							variant="flat"
							:color="this.edit.voteAgainstRequired ? 'danger' : 'admin'"
							class="w-100 mb-3 rounded-xl"
							@click="this.edit.voteAgainstRequired = !this.edit.voteAgainstRequired"
						>
							{{ this.edit.voteAgainstRequired ? 'Cancel' : 'Edit' }}
						</VBtn>

						<VBtn
							v-if="this.edit.voteAgainstRequired"
							:disabled="this.updating.voteAgainstRequired"
							variant="tonal"
							color="success"
							class="mb-3 w-100 rounded-xl"
							@click="this.updatevoteAgainstRequired()"
						>
							Update
						</VBtn>
					</VCol>
				</VRow>
			</VCard>

			<VCard class="mb-6 px-3 py-3 rounded-xl elevation-0 bg-light-frost">
				<VRow>
					<VCol :cols="this.asAdmin ? 8 : 12" class="text-center">
						<h3 class="mb-3 text-uppercase text-primary">⏳ Min Vote Period</h3>

						<!-- Member Only -->
						<h3 v-if="!this.asAdmin || !this.edit.minVotePeriodSeconds" class="m-0">
							{{ this.vault.minVotePeriodSeconds }} Sec.
						</h3>

						<VTextField
							v-if="this.asAdmin && this.edit.minVotePeriodSeconds"
							v-model="this.update.minVotePeriodSeconds"
							size="sm"
							type="number"
							label="New For Vote Count"
							variant="outlined"
						/>
					</VCol>

					<VCol v-if="this.asAdmin" cols="4" class="text-right">
						<VBtn
							:disabled="this.updating.minVotePeriodSeconds"
							variant="flat"
							:color="this.edit.minVotePeriodSeconds ? 'danger' : 'admin'"
							class="w-100 mb-3 rounded-xl"
							@click="this.edit.minVotePeriodSeconds = !this.edit.minVotePeriodSeconds"
						>
							{{ this.edit.minVotePeriodSeconds ? 'Cancel' : 'Edit' }}
						</VBtn>

						<VBtn
							v-if="this.edit.minVotePeriodSeconds"
							:disabled="this.updating.minVotePeriodSeconds"
							variant="tonal"
							color="success"
							class="w-100 mb-3 rounded-xl"
							@click="this.updateMinVotePeriodSeconds()"
						>
							Update
						</VBtn>
					</VCol>
				</VRow>
			</VCard>

			<VCard class="mb-6 px-3 py-3 rounded-xl elevation-0 bg-light-frost">
				<VRow>
					<VCol :cols="this.asAdmin ? 8 : 12" class="text-center">
						<h3 class="mb-3 text-uppercase text-primary">⌛ Max Vote Period</h3>

						<!-- Member Only -->
						<h3 v-if="!this.asAdmin || !this.edit.maxVotePeriodSeconds" class="m-0">
							{{ this.vault.maxVotePeriodSeconds }} Sec.
						</h3>

						<VTextField
							v-if="this.asAdmin && this.edit.maxVotePeriodSeconds"
							v-model="this.update.maxVotePeriodSeconds"
							size="sm"
							type="number"
							label="New For Vote Count"
							variant="outlined"
						/>
					</VCol>

					<VCol v-if="this.asAdmin" cols="4" class="text-right">
						<VBtn
							:disabled="this.updating.maxVotePeriodSeconds"
							variant="flat"
							:color="this.edit.maxVotePeriodSeconds ? 'danger' : 'admin'"
							class="w-100 mb-3 rounded-xl"
							@click="this.edit.maxVotePeriodSeconds = !this.edit.maxVotePeriodSeconds"
						>
							{{ this.edit.maxVotePeriodSeconds ? 'Cancel' : 'Edit' }}
						</VBtn>

						<VBtn
							v-if="this.edit.maxVotePeriodSeconds"
							:disabled="this.updating.maxVotePeriodSeconds"
							variant="tonal"
							color="success"
							class="w-100 mb-3 rounded-xl"
							@click="this.updateMaxVotePeriodSeconds()"
						>
							Update
						</VBtn>
					</VCol>
				</VRow>
			</VCard>
		</VCardText>
	</VCard>

	<VCard v-if="!this.asAdmin" class="mb-6 rounded-xl elevation-0 bg-light-frost">
		<VCardTitle class="text-primary">
			<h4 class="m-0 text-center text-uppercase">⚙️ Membership Settings</h4>
		</VCardTitle>

		<VCardText class="mt-4 text-center">
			<VBtn
				:disabled="this.processing"
				variant="outlined"
				color="danger"
				class="rounded-xl elevation-0"
				@click="this.renounceMembership()"
			>
				Renounce Membership
			</VBtn>

			<h6 v-if="this.error">{{ this.error }}</h6>
		</VCardText>
	</VCard>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { AbiItem } from "web3-utils";
	import { TransactionReceipt } from "web3-core";
	import { Contract } from "web3-eth-contract";

	import YieldSyncV1Vault from "../../../abi/YieldSyncV1Vault";
	import YieldSyncV1BTransferRequestProtocol from "../../../abi/YieldSyncV1BTransferRequestProtocol";

	export default defineComponent({
		name: "CTRPASettings",

		props: {
			vaultAddress: {
				type: String,
				required: true
			},

			asAdmin: {
				type: Boolean,
				default: false
			},
		},

		data()
		{
			return {
				processing: false as boolean,
				yieldSyncV1Vault: undefined as undefined | Contract,

				vault: {
					voteAgainstRequired: 0 as number,
					voteForRequired: 0 as number,
					maxVotePeriodSeconds: 0 as number,
					minVotePeriodSeconds: 0 as number,
				},
				update: {
					voteAgainstRequired: 0 as number,
					voteForRequired: 0 as number,
					maxVotePeriodSeconds: 0 as number,
					minVotePeriodSeconds: 0 as number,
				},
				edit: {
					voteAgainstRequired: false as boolean,
					voteForRequired: false as boolean,
					maxVotePeriodSeconds: false as boolean,
					minVotePeriodSeconds: false as boolean,
				},
				updating: {
					voteAgainstRequired: false as boolean,
					voteForRequired: false as boolean,
					maxVotePeriodSeconds: false as boolean,
					minVotePeriodSeconds: false as boolean,
				},

				error: "" as string,

				transferRequestProtocol: this.$store.state.config.networkChain[
					this.$store.state.currentChain.name
				].yieldSyncV1BTransferRequestProtocol,
			};
		},

		methods: {
			updatevoteAgainstRequired()
			{
				if (!this.$store.state.web3.utils.isAddress(this.vaultAddress))
				{
					return;
				}

				const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
					YieldSyncV1BTransferRequestProtocol as AbiItem[],
					this.transferRequestProtocol
				);

				transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultPropertyAdminUpdate(
					this.vaultAddress,
					[
						this.update.voteAgainstRequired,
						this.vault.voteForRequired,
						this.vault.transferDelaySeconds,
					]
				).send({
					from: this.$store.state.wallet.accounts[0]
				}).on(
					"sent",
					async () =>
					{
						this.updating.voteAgainstRequired = true;
					}
				).on(
					"confirmation",
					async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.edit.voteAgainstRequired = false;

							this.vault.voteAgainstRequired = (
								await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
									this.vaultAddress
								).call()
							)[0];

							this.updating.voteAgainstRequired = false;
						}
					}
				).on(
					"error",
					async (error: Error) =>
					{
						this.error = String(error);

						this.updating.voteAgainstRequired = false;
					}
				);
			},

			updatevoteForRequired()
			{
				if (!this.$store.state.web3.utils.isAddress(this.vaultAddress))
				{
					return;
				}

				const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
					YieldSyncV1BTransferRequestProtocol as AbiItem[],
					this.transferRequestProtocol
				);

				transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultPropertyAdminUpdate(
					this.vaultAddress,
					[
						this.vault.voteAgainstRequired,
						this.update.voteForRequired,
						this.vault.transferDelaySeconds,
					]
				).send({
					from: this.$store.state.wallet.accounts[0]
				}).on(
					"sent",
					async () =>
					{
						this.updating.voteForRequired = true;
					}
				).on(
					"confirmation",
					async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.edit.voteForRequired = false;

							this.vault.voteForRequired = (
								await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
									this.vaultAddress
								).call()
							)[1];

							this.updating.voteForRequired = false;
						}
					}
				).on(
					"error",
					async (error: Error) =>
					{
						this.error = String(error);

						this.updating.voteForRequired = false;
					}
				);
			},

			updateMaxVotePeriodSeconds()
			{
				if (!this.$store.state.web3.utils.isAddress(this.vaultAddress))
				{
					return;
				}

				const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
					YieldSyncV1BTransferRequestProtocol as AbiItem[],
					this.transferRequestProtocol
				);

				transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultPropertyAdminUpdate(
					this.vaultAddress,
					[
						this.vault.voteAgainstRequired,
						this.vault.voteForRequired,
						this.update.maxVotePeriodSeconds,
						this.update.minVotePeriodSeconds,
					]
				).send({
					from: this.$store.state.wallet.accounts[0]
				}).on(
					"sent",
					async () =>
					{
						this.updating.maxVotePeriodSeconds = true;
					}
				).on(
					"confirmation",
					async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.edit.maxVotePeriodSeconds = false;

							this.vault.maxVotePeriodSeconds = (
								await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
									this.vaultAddress
								).call()
							)[2];

							this.updating.maxVotePeriodSeconds = false;
						}
					}
				).on(
					"error",
					async (error: Error) =>
					{
						this.error = String(error);

						this.updating.maxVotePeriodSeconds = false;
					}
				);
			},

			updateMinVotePeriodSeconds()
			{
				if (!this.$store.state.web3.utils.isAddress(this.vaultAddress))
				{
					return;
				}

				const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
					YieldSyncV1BTransferRequestProtocol as AbiItem[],
					this.transferRequestProtocol
				);

				transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultPropertyAdminUpdate(
					this.vaultAddress,
					[
						this.vault.voteAgainstRequired,
						this.vault.voteForRequired,
						this.update.maxVotePeriodSeconds,
						this.update.minVotePeriodSeconds,
					]
				).send({
					from: this.$store.state.wallet.accounts[0]
				}).on(
					"sent",
					async () =>
					{
						this.updating.minVotePeriodSeconds = true;
					}
				).on(
					"confirmation",
					async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.edit.minVotePeriodSeconds = false;

							this.vault.minVotePeriodSeconds = (
								await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
									this.vaultAddress
								).call()
							)[2];

							this.updating.minVotePeriodSeconds = false;
						}
					}
				).on(
					"error",
					async (error: Error) =>
					{
						this.error = String(error);

						this.updating.minVotePeriodSeconds = false;
					}
				);
			},

			async renounceMembership()
			{
				if (!this.yieldSyncV1Vault)
				{
					return;
				}

				try
				{
					this.yieldSyncV1Vault.methods.renounceMembership().send({
						from: this.$store.state.wallet.accounts[0]
					}).on("sent", async () =>
					{
						this.processing = true;
					}).on("confirmation", async (confirmationNumber: number, receipt: TransactionReceipt) =>
					{
						console.log(`Confirmation #${confirmationNumber}`, receipt);

						if (confirmationNumber == 0)
						{
							this.processing = false;
						}
					}).on("error", async (error: Error) =>
					{
						this.error = String(error);

						this.processing = false;
					});
				}
				catch (e)
				{
					this.error = String(e);
				}
			}
		},

		async created(): Promise<void>
		{
			this.yieldSyncV1Vault = new this.$store.state.web3.eth.Contract(
				YieldSyncV1Vault as AbiItem[],
				this.vaultAddress
			);

			if (!this.yieldSyncV1Vault)
			{
				return;
			}

			const transferRequestProtocol: Contract = new this.$store.state.web3.eth.Contract(
				YieldSyncV1BTransferRequestProtocol as AbiItem[],
				this.transferRequestProtocol
			);

			this.vault.voteAgainstRequired = (
				await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
					this.vaultAddress
				).call()
			).voteAgainstRequired;

			this.vault.voteForRequired = (
				await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
					this.vaultAddress
				).call()
			).voteForRequired;

			this.vault.maxVotePeriodSeconds = (
				await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
					this.vaultAddress
				).call()
			).maxVotePeriodSeconds;

			this.vault.minVotePeriodSeconds = (
				await transferRequestProtocol.methods.yieldSyncV1Vault_yieldSyncV1VaultProperty(
					this.vaultAddress
				).call()
			).minVotePeriodSeconds;

			this.update.voteAgainstRequired = this.vault.voteAgainstRequired;
			this.update.voteForRequired = this.vault.voteForRequired;
			this.update.maxVotePeriodSeconds = this.vault.maxVotePeriodSeconds;
			this.update.minVotePeriodSeconds = this.vault.minVotePeriodSeconds;
		}
	});
</script>
