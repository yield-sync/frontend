<template>
	<VDialog :max-width="maxWidth">
		<VCard :color="color">
			<VCardTitle class="text-center">{{ title }}</VCardTitle>

			<VCardText class="text-center">
				<p>{{ message }}</p>

				<p v-if="warning" class="text-error">{{ warning }}</p>
			</VCardText>

			<VCardActions class="justify-center">
				<VBtn color="light" variant="outlined" @click="$emit('cancel')">
					Cancel
				</VBtn>

				<VBtn color="danger" variant="flat" @click="$emit('confirm')">
					{{ confirmText }}
				</VBtn>
			</VCardActions>
		</VCard>
	</VDialog>
</template>

<script setup lang="ts">
	defineProps<{
		title: string;
		message: string;
		warning?: string;
		confirmText: string;
		maxWidth?: string;
		color?: string;
	}>();

	defineEmits([
		"cancel",
		"confirm",
	]);
</script>
