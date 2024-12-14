<script setup>
defineProps(['size', 'color'])
</script>
<template>
	<div class="text" :style="{ 'font-size': size + 'vmin', 'color': color }">
		<slot/>
	</div>
</template>
<style>
.text {
	transform:translate(-50%, -50%);
	font-family:'PT-sans';
	font-weight:Bold;
	font-style:normal;
	color:#FFFFFF;
}
</style>