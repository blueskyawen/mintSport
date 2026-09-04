<template>
	<view class="empty-box">
			<view class="icon">📭</view>
			<view class="tip">{{ tip }}</view>
			<button class="btn" @click="$emit('click')">{{ btnText }}</button>
	</view>
</template>

<script>
	export default {
		name:"empty-state",
		props: ['tip', 'btnText'],
		data() {
			return {

			};
		}
	}
</script scoped>
.empty-box{
	text-align:center;
	padding:100rpx 40rpx;
}
.icon{
	font-size:100rpx;
	margin-bottom:30rpx;
}
.btn{
	margin-top:40rpx;
	background:#72D1A8;
	color:#fff;
	width:300rpx;
}
<style>

</style>
