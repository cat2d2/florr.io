<script setup>
defineProps(['props']);
</script>
<template>
	<div class="block"
		:class="{ tr: props.tr ?? true }"
		:style="{ top: props.y + '%', left: props.x + '%' }">
		<slot/>
	</div>
</template>
<style>
.block {
	position:absolute;
	display:block;
	top:0%;
	left:0%;
}

.tr {
	transition:
		top 0.7s cubic-bezier(0.16, 1, 0.3, 1),
		left 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>