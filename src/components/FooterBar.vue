<template>
	<div class="bg-gradient-dark" style="background-attachment: fixed; background-size: cover;">
		<VSheet color="transparent" class="bg-gradient-dark">
			<VContainer>
				<VRow>
					<VCol cols="12" lg="4">
						<RouterLink v-for="(v, i) in router.options.routes" :to="v.path">
							<VBtn variant="plain" color="primary" class="w-100">{{ v.name }}</VBtn>
						</RouterLink>
					</VCol>
				</VRow>
			</VContainer>
		</VSheet>
	</div>
</template>

<script setup>
	import { useRouter, RouterLink } from "vue-router";

	// Get the router instance
	const router = useRouter();
</script>
