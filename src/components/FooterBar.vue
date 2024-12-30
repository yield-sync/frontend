<template>
	<div class="bg-gradient-dark" style="background-attachment: fixed; background-size: cover;">
		<VSheet color="transparent" class="bg-gradient-dark">
			<VContainer>
				<VRow>
					<VCol cols="12" lg="6">
						<RouterLink v-for="(v, i) in router.options.routes" :to="v.path">
							<VBtn variant="plain" color="primary" class="w-100">{{ v.name }}</VBtn>
						</RouterLink>
					</VCol>

					<VCol cols="12" lg="6">
						<VSwitch
							v-model="_advancedMode"
							@change="toggleAdvancedMode()"
							label="Advanced Mode"
							color="primary"
							hide-details
							class="text-primary switch-center"
						></VSwitch>
					</VCol>
				</VRow>
			</VContainer>
		</VSheet>
	</div>
</template>

<script setup>
	import { ref, watch } from "vue";
	import { useRouter, RouterLink } from "vue-router";

	import useAppStore from "@/stores/App";

	const app = useAppStore();
	const router = useRouter();

	let _advancedMode = ref(app.advancedMode);

	const toggleAdvancedMode = () => {
		app.toggleAdvancedMode();

		_advancedMode.value = app.advancedMode;
	};
</script>

<style scoped>
	.switch-center {
		display: flex;
		justify-content: center;
	}
</style>
