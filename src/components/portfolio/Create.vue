<template>
	<VRow v-if="app.loggedIn">
		<VCol cols="12">
			<VSheet class="mx-auto" color="dark">
				<VForm validate-on="submit lazy">
					<VTextField
						v-model="userName"
						:rules="rules"
						variant="outlined"
						color="success"
						label="Portfolio Name"
					></VTextField>

					<VBtn
						:loading="loading"
						color="success"
						variant="outlined"
						class="w-100"
						text="+ Create Portfolio"
						type="submit"
						block
					></VBtn>
				</VForm>
			</VSheet>

			<h3 class="text-center text-error">{{ requestError }}</h3>
		</VCol>
	</VRow>

</template>

<script setup>
	import { ref, onMounted } from "vue";
	import axios from "axios";

	import useAppStore from "@/stores/App";

	const app = useAppStore();

	const requestError = ref("");

	const URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_SERVER_URL : "";

	onMounted(async () =>
	{
		try
		{
			if (!app.loggedIn)
			{
				return;
			}
		}
		catch (error)
		{
			requestError.value = error.response?.data.message || error.message;
		}
	});
</script>
