<template>
	<view class="page" :style="{ height: heighth + 'px' }">
		<image class="bg-img" mode="widthFix" src="/static/bg/home.jpg"></image>
		<view class="content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"page-bg",
		data() {
			return {
				heighth: 500
			};
		},
		created() {
			this.heighth = uni.getWindowInfo().windowHeight;
		},
	}
</script>

<style lang="scss">
.page {
	height: 100%;
	width: 100%;
	background-color: #F7FBF9;
	position: relative;
	padding: 0;
	.bg-img {
		width: 100%;
		border-bottom-left-radius: 20% 6% ;
		border-bottom-right-radius: 20% 6% ;
	}
	.content {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		// height: 100%;
		width: 100%;
		box-sizing: border-box;
		height: 100%;
		overflow-y: auto;
	}
}
</style>
