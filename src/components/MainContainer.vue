<template>
	<VContainer style="max-width: 800px;">
		<div class="mb-4 rounded-xl bg-light-frost elevation-0">
			<VCard color="transparent" class="elevation-0">
				<VCardTitle class="py-6 text-center">
					<h3 class="text-center text-uppercase text-primary">
						{{ title }}
					</h3>
				</VCardTitle>

				<VCardText>
					<slot/>
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
