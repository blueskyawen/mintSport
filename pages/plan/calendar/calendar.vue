<template>
	<view class="page">
		<u-calendar v-model="showCalendar" :mode="'month'" @confirm="selectDay"></u-calendar>
		<u-button @click="showCalendar=true">选择日期查看打卡记录</u-button>
		<view v-if="currentRecord" class="record-box">
			<view>日期：{{currentRecord.date}}</view>
			<view>运动完成：{{currentRecord.sportFinishList.length||0}}项</view>
			<view>饮食打卡：{{currentRecord.dietFinish?'是':'否'}}</view>
			<view>早起达标：{{currentRecord.getUpFinish?'是':'否'}}</view>
			<view>早睡达标：{{currentRecord.sleepFinish?'是':'否'}}</view>
		</view>
	</view>
</template>
<script>
import { getStorage } from '@/utils/storage.js'
export default {
	data(){
		return {
			showCalendar:false,
			currentRecord:{}
		}
	},
	methods:{
		selectDay(date){
			this.showCalendar = false
			let list = getStorage('checkRecord')||[]
			this.currentRecord = list.find(r=>r.date === date) || {date:date,empty:true}
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
.record-box{background:#fff;padding:30rpx;border-radius:20rpx;margin-top:30rpx;line-height:2;}
</style>
