<template>
	<view class="login-wrap">
		<view class="title">制定健身计划 · 自律打卡</view>
		<view class="img-box">🏃‍♂️</view>
		<view class="btn-box">
			<button class="login-btn" @click="handleLogin">微信一键登录</button>
			<view class="agress">
				<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			</view>
		</view>
		<uni-id-pages-fab-login ref="uniFabLogin"></uni-id-pages-fab-login>
	</view>
</template>

<script>
import { setStorage } from '@/utils/storage.js';
import uniIdPagesAgreements from '@/uni_modules/uni-id-pages/components/uni-id-pages-agreements/uni-id-pages-agreements.vue';
import uniIdPagesFabLogin from '@/uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue';
export default {
	components: {
		uniIdPagesAgreements,
		uniIdPagesFabLogin
	},
	data() {
		return {
			type: "weixin" //快捷登录方式
		}
	},
	onLoad() {
		this.$nextTick(() => {
			this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter(item =>
				item.id !== this.type)
		})
	},
	methods: {
		handleLogin(e) {
			let options = {}
			console.log(e)
			if (e.detail?.code) {
				options.phoneNumberCode = e.detail.code
			}

			this.$refs.uniFabLogin.login_before(this.type, true, options)
		},
		handleLogin2(e) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.login-wrap{
	padding: 120rpx 60rpx;
	text-align: center;
	.title {
		font-size:36rpx;
		margin-bottom:80rpx;
	}
	.img-box{
		font-size:200rpx;
		margin-bottom:100rpx;
	}
	.btn-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.login-btn {
			background-color:#72D1A8;
			color:#fff;
			width: 90%;
		}
		.agress {
			width: 90%;
			padding: 14px 8px;
		}
	}
}
</style>
