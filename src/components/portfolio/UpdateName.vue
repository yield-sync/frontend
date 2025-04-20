<template>
	<VForm @submit.prevent="submit" validate-on="submit lazy" ref="formRef">
		<VRow>
			<VCol cols="12">
				<VTextField
					v-model="nameModel"
					:rules="rules"
					density="compact"
					variant="outlined"
					color="success"
					base-color=""
					label="Portfolio Name"
					hide-details="auto"
					class="text-light"
				/>
			</VCol>

			<VCol cols="6" class="text-center">
				<VBtn
					:loading="loading"
					color="success"
					variant="flat"
					type="submit"
					class="w-100"
					size="small"
					rounded
				>
					Save
				</VBtn>
			</VCol>

			<VCol cols="6" class="text-center">
				<VBtn
					@click="$emit('cancel')"
					color="light"
					variant="outlined"
					class="w-100"
					size="small"
					rounded
				>
					Cancel
				</VBtn>
			</VCol>
		</VRow>
	</VForm>
</template>

<script setup>
	import { ref } from "vue";

	const emit = defineEmits(["submit"]);

	const props = defineProps({
		id: String,
		name: String,
		loading: Boolean,
		rules: Array
	});

	const nameModel = ref(props.name);

	const formRef = ref();

	const submit = () => {
		emit("submit", nameModel.value);
	};
</script>
