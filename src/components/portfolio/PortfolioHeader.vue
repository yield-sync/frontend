<template>
	<VRow v-if="!updatePortfolioToggle">
		<VCol cols="10">
			<h1 class="text-primary">{{ portfolio.name }}</h1>
		</VCol>
		<VCol cols="2" class="d-flex justify-end">
			<VMenu location="bottom right">
				<template #activator="{ props }">
					<VBtn icon="mdi-dots-vertical" v-bind="props" variant="text" color="light" />
				</template>
				<VList bg-color="dark">
					<VListItem @click="$emit('toggle-update')">
						<VListItemTitle>Update Name</VListItemTitle>
					</VListItem>
					<VListItem @click="$emit('confirm-delete')">
						<VListItemTitle class="text-error">Delete</VListItemTitle>
					</VListItem>
				</VList>
			</VMenu>
		</VCol>
	</VRow>
	<UpdateName v-else :id="id" :name="portfolio.name" :rules="[]" :loading="loading"
		@submit="$emit('update-name', $event)" @cancel="$emit('toggle-update')" class="mb-3" />
</template>

<script setup lang="ts">
	import UpdateName from './UpdateName.vue';

	defineProps<{
		id: string | number;
		portfolio: { name: string };
		loading: boolean;
		updatePortfolioToggle: boolean;
	}>();

	defineEmits(['toggle-update', 'confirm-delete', 'update-name']);
</script>
