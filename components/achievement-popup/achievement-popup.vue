<template>
	<u-popup :show="show" :round="6" mode="center">
		<view class="achieve-pop-content">
			<view class="icon">
				<image v-if="achieve.url" mode="widthFix" :src="achieve.url"></image>
			</view>
			<view class="text">恭喜解锁新成就勋章</view>
			<view class="text txt2">LV{{ achieve.grade || 0 }} {{ achieve.name }}</view>
			<view class="submit-box">
				<u-button type="primary" color="#72D1A8" @click="submit">继续努力</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"achievement-popup",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			achieve: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				list: []
			};
		},
		methods: {
			submit() {
				this.$emit('close-pop')
			}
		}
	}
</script>

<style lang="scss" scoped>
.achieve-pop-content {
	padding: 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.icon {
		width: 520rpx;
		image {
			width: 100%;
		}
	}
	.text {
		font-size: 33rpx;
		line-height: 1.5;
	}
	.txt2 {
		font-size: 45rpx;
		margin-top: 7rpx;
		font-weight: bold;
	}
	.submit-box {
		margin-top: 28rpx;
		width: 100%;
	}
}
</style>
