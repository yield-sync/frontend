<template>
	<VContainer>
		<div class="w-100 mx-auto" style="max-width: 800px;">
			<VRow
				bg-color="primary"
				color="dark"
				fixed-tabs
				class="mb-3"
			>
				<VCol cols="4">
					<VBtn
						:class="
							(
								this.$store.state.view.dashboard.tab == 'm'
							) ? 'bg-primary text-white' : 'bg-light-frost text-primary'
						"
						class="w-100 rounded-pill elevation-0"
						@click="this.$store.state.view.dashboard.tab = 'm'"
					>
						<h3>👤 Memberships</h3>
					</VBtn>
				</VCol>

				<VCol cols="4">
					<VBtn
						:class="
							(
								this.$store.state.view.dashboard.tab == 'a'
							) ? 'bg-primary text-white' : 'bg-light-frost text-primary'
						"
						class="w-100 rounded-pill elevation-0"
						@click="this.$store.state.view.dashboard.tab = 'a'"
					>
						<h3>🔑 Adminships</h3>
					</VBtn>
				</VCol>

				<VCol cols="4">
					<VBtn
						:class="
							(
								this.$store.state.view.dashboard.tab == 'd'
							) ? 'bg-primary text-white' : 'bg-light-frost text-primary'
						"
						class="w-100 rounded-pill elevation-0"
						@click="this.$store.state.view.dashboard.tab = 'd'"
					>
						<h3>🏦 Deploy</h3>
					</VBtn>
				</VCol>
			</VRow>

			<CMemberships v-if="this.$store.state.view.dashboard.tab == 'm'"/>

			<CAdminships v-if="this.$store.state.view.dashboard.tab == 'a'"/>

			<CDeploy v-if="this.$store.state.view.dashboard.tab == 'd'"/>
		</div>
	</VContainer>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import CDeploy from "@/components/Dashboard/CDeploy.vue";
	import CAdminships from "@/components/Dashboard/CAdminships.vue";
	import CMemberships from "@/components/Dashboard/CMemberships.vue";

	export default defineComponent({
		name: "RVDashboard",

		components: {
			CDeploy,
			CAdminships,
			CMemberships
		},
	});
</script>
