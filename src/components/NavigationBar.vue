<template>
	<VSheet color="transparent">
		<VContainer>
			<VRow>
				<VCol
					cols="12"
					lg="4"
				>
					<RouterLink to="/" style="letter-spacing: 4px; text-decoration: none !important">
						<h1 class="text-primary text-uppercase" style="letter-spacing: 4px;">Yield Sync</h1>
					</RouterLink>
				</VCol>

				<VCol
					cols="12"
					lg="4"
				>
					<VBtn
						variant="tonal"
						color="white"
						class="w-100 rounded-xl container1 elevation-0"
					>
						<img
							:src="config.networkChain[web3Wallet.networkId].icon"
							alt="Description of Image"
							class="mr-2"
							style="max-width: 20px;"
						/>

						<h5 class="mx-auto text-center text-light">
							{{ config.getChainName(web3Wallet.networkId) }} ⦁ {{ web3Wallet.networkId }}
						</h5>

						<VMenu activator="parent">
							<VList class="mt-3 px-0 py-0 rounded-xl bg-dark elevation-0">
								<VListItem v-for="(n, k) in config.networkChain" :key="k" class="network-option">
									<VListItemTitle @click="switchNetwork(String(k))">
										<VRow>
											<VCol cols="1">
												<img :src="n.icon" style="max-width: 20px;" />
											</VCol>
											<VCol>{{ n.chainName }}</VCol>
										</VRow>
									</VListItemTitle>
								</VListItem>
							</VList>
						</VMenu>
					</VBtn>
				</VCol>

				<VCol
					cols="12"
					lg="4"
				>
					<VBtn
						v-if="!web3Wallet.walletConnected"
						@click="web3Wallet.connectWallet"
						color="dark"
						variant="tonal"
						class="w-100 rounded-pill"
					>
						Connect Wallet
					</VBtn>

					<VBtn
						v-else
						@click="web3Wallet.disconnectWallet"
						color="white"
						variant="tonal"
						class="w-100 rounded-pill"
					>
						Disconnect ⦁ {{ web3Wallet.accounts ? shortener(web3Wallet.accounts[0]) : "" }}
					</VBtn>
				</VCol>

				<VCol
					cols="12"
					md="4"
					lg="4"
					xl="4"
					class="text-left"
				>
					<RouterLink
						v-for="(v, i) in router.options.routes"
						:to="v.path"
						class="mr-2 text-decoration-none text-dark"
					>
						<VBtn
							v-if="v.name != 'governance'"
							variant="plain"
							color="primary"
							class="rounded-xl text-uppercase"
						>
							{{ v.name }}
						</VBtn>
					</RouterLink>
				</VCol>

				<VCol
					cols="12"
					md="4"
					lg="4"
					xl="4"
					class="text-left"
				>
					<h4 class="text-center text-danger">
						{{ web3Wallet.error }}
					</h4>
				</VCol>

				<VCol
					cols="12"
					md="4"
					lg="4"
					xl="4"
					class="text-right"
				>
					<VTextField
						label="Insert Alchemy API Key Here"
						variant="outlined"
						density="compact"
						hide-details
					/>
				</VCol>
			</VRow>
		</VContainer>
	</VSheet>
</template>


<script lang="ts" setup>
	import { useRouter, RouterLink } from "vue-router";

	import config from "@/config";
	import useWeb3WalletStore from "@/stores/Web3Wallet";


	const web3Wallet = useWeb3WalletStore();
	const router = useRouter();

	const shortener = (subject: string | null) =>
	{
		return subject ? subject.substring(0, 4) + "..." + subject.substring(subject.length - 4) : "";
	};

	const switchNetwork = async (networkChainKey: string) =>
	{
		web3Wallet.switchNetwork(config.networkChain[networkChainKey].chainId);
	};
</script>

<style lang="scss" scoped>
	@import "@/assets/styles/variables.scss";

	.container1 {
		display: flex;
	}

	.network-option {
		cursor: pointer;

		&:hover {
			@extend .bg-gradient;
		}
	}
</style>
