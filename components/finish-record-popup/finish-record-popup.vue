<template>
	<u-popup :show="show" :round="6" mode="center">
		<view class="pop-content">
			<view class="icon">
				<image src="/static/bg/record-finish.png"></image>
			</view>
			<view class="text">今日打卡已全部完成 👍</view>
			<view class="text">又向好习惯靠近了一步</view>
			<view class="submit-box">
				<u-button type="primary" color="#72D1A8" @click="submit">继续努力</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"finish-record-popup",
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {}
		},
		methods: {
			submit() {
				this.$emit('close-pop')
			}
		}
	}
</script>

<style lang="scss" scoped>
.pop-content{
	padding: 42rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.icon {
		width: 600rpx;
		image {
			width: 100%;
		}
	}
	.text {
		font-size: 38rpx;
		line-height: 1.5;
	}
	.submit-box {
		margin-top: 28rpx;
		width: 100%;
	}
}
</style>
