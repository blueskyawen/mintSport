<!-- 网络链接内容展示页（uni-id-pages中用于展示隐私政策协议内容） -->
<template>
	<view>
		<!-- #ifndef MP -->
		<web-view v-if="s_url" :src="s_url"></web-view>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<view class="rich-content">
			<u-parse class="art-content" :content="richContent"></u-parse>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { privacyStr, serviceStr } from "@/common/aggress.js";
	export default {
		onLoad({url,title}) {
			let decodeurl = decodeURIComponent(url)

			// #ifndef MP
			if(decodeurl.substring(0, 4) != 'http') {
				if (decodeurl.includes('static/')) {
					this.s_url = decodeurl;
				} else {
					uni.showModal({
						title:"错误",
						content: '不是一个有效的网站链接,'+'"'+decodeurl+'"',
						showCancel: false,
						confirmText:"知道了",
						complete: () => {
							uni.navigateBack()
						}
					});
					title = "页面路径错误"
				}
			} else {
				this.s_url = url;
			}
			// #endif
			// #ifdef MP
			if(decodeurl.includes('service')) {
				this.richContent = serviceStr
			} else {
				this.richContent = privacyStr
			}
			// #endif
			if(title){
				uni.setNavigationBarTitle({title});
			}
		},
		data() {
			return {
				s_url: null,
				richContent: ''
			};
		}
	}
</script>

<style scoped>
	.rich-content {
		padding: 22rpx 32rpx 60rpx;
	}
	.rich-content .art-content {
		line-height: 3;
	}
</style>
