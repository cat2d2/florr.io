<script setup>
defineProps(['size'])
</script>
<template>
	<div class="title" :style="{ 'font-size': size + 'vmin' }">
		<slot/>
	</div>
</template>
<style>
.title {
	transform:translate(-50%, -50%);
	font-family:'Ubuntu';
	font-weight:Bold;
	font-style:normal;
	color:#FFFFFF;
}
</style>