<template>
	<view class="page" :style="{ height: heighth + 'px' }">
		<image class="bg-img" mode="widthFix" src="/static/bg/home.jpg"></image>
		<view class="content">
			<view class="main-content">
				<view class="head">
					<view class="title">{{ headTitle.title }}</view>
					<view class="text">{{ headTitle.subText }}</view>
				</view>
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"page-bg",
		props: {
			headTitle: {
				type: Object,
				default: () => {}
			}
		},
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

<style lang="scss" scoped>
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
		.main-content {
			padding: 38rpx 38rpx 14rpx;
			.head {
				display: flex;
				flex-direction: column;
				margin-bottom: 33rpx;
				line-height: 1.8;
				.title {
					font-size: 56rpx;
					font-weight: bold;
				}
				.text {
					font-size: 33rpx;
				}
			}
		}
	}
}
</style>
