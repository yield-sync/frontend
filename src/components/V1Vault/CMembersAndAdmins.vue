<template>
	<VCard class="mb-6 rounded-xl elevation-0 bg-light-frost">
		<VCardTitle class="text-primary">
			<h4 class="m-0 text-center text-uppercase">👥 Members & Admins</h4>
		</VCardTitle>

		<VCardText class="mt-4">
			<CMembers
				:v1VaultAddress="this.vaultAddress"
				:asAdmin="this.asAdmin"
				class="mb-6"
			/>

			<CAdmins
				:v1VaultAddress="this.vaultAddress"
				:asAdmin="this.asAdmin"
			/>
		</VCardText>
	</VCard>
</template>

<script lang="ts">
	import { defineComponent } from "vue";

	import CAdmins from "./CAdmins.vue";
	import CMembers from "./CMembers.vue";

	export default defineComponent({
		name: "CMembersAndAdmins",

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

		components: {
			CAdmins,
			CMembers,
		},
	});
</script>
