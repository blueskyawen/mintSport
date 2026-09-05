<template>
	<u-popup :show="show" :round="6" mode="center">
		<view class="pop-content">
			<view class="icon">
				<uni-icons custom-prefix="iconfont" type="icon-fit-xunzhang" color="#ff9900" size="100"></uni-icons>
			</view>
			<view class="text">已全部打卡完成, 你真棒 👍</view>
			<view class="submit-box">
				<u-button type="primary" color="#72D1A8" @click="submit">继续努力</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"record-success-popup",
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
	padding: 18px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text {
		font-size: 16px;
		margin: 12px 0;
	}
	.submit-box {
		width: 100%;
	}
}
</style>
