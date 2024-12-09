<template>
	<VContainer style="max-width: 800px;">
		<div class="mb-4 rounded-xl bg-light-frost elevation-0">
			<VCard color="transparent" class="elevation-0">
				<VCardTitle class="text-center">
					<h3 class="text-center text-uppercase text-primary">
						{{ title }}
					</h3>
				</VCardTitle>

				<VCardText class="px-6 py-6">
					<slot></slot>
				</VCardText>
			</VCard>
		</div>
	</VContainer>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				required: true
			}
		},
	};
</script>
