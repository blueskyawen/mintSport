<template>
	<view class="mint-page" :style="{ height: heighth + 'px' }">
		<view class="content">
			<slot></slot>
			<view class="data-empty" :class="{'hide': !isEmpty}">
				<image src="/static/bg/data-empty.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mint-bg",
		props: {
			isEmpty: {
				type: Boolean,
				default: false
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
.mint-page {
	height: 100%;
	width: 100%;
	background-color: #F7FBF9;
	position: relative;
	padding: 0;
	background-color: #eef6f8;
	.content {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		height: 100%;
		overflow-y: auto;
	}
	.data-empty {
		position: absolute;
		top: 234rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 28rpx;
		color: #fff;
		&.hide {
			display: none;
		}
	}
}
</style>
