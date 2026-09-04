<template>
	<view class="page">
		<view class="head">今日运动清单</view>
		<view v-if="!activePlan || !activePlan.sportList.length" class="empty">今日暂无运动任务</view>
		<view v-else>
			<view v-for="(sport,idx) in activePlan.sportList" :key="idx" class="sport-card">
				<view class="left">
					<view class="name">{{sport.name}}</view>
					<view class="time">{{sport.time}}</view>
				</view>
				<u-button :type="dayRecord.sportFinishList.includes(idx)?'success':'primary'"
					@click="checkItem(idx)">
					{{dayRecord.sportFinishList.includes(idx)?'已完成':'打卡'}}
				</u-button>
			</view>
		</view>
	</view>
</template>
<script>
import { getStorage, setStorage } from '@/utils/storage.js'
export default {
	data(){
		return {
			activePlan:{},
			todayStr:''
		}
	},
	computed:{
		dayRecord(){
			let recordList = getStorage('checkRecord') || []
			return recordList.find(r=>r.date === this.todayStr) || {date:this.todayStr,sportFinishList:[],dietFinish:false,getUpFinish:false,sleepFinish:false}
		}
	},
	onLoad(){
		this.activePlan = getStorage('activePlan')
		let date = new Date()
		this.todayStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
	},
	methods:{
		checkItem(index){
			let recordList = getStorage('checkRecord') || []
			let curr = recordList.find(r=>r.date === this.todayStr)
			if(!curr){
				curr = {date:this.todayStr,sportFinishList:[],dietFinish:false,getUpFinish:false,sleepFinish:false}
				recordList.push(curr)
			}
			let i = curr.sportFinishList.indexOf(index)
			if(i>-1){
				curr.sportFinishList.splice(i,1)
			}else{
				curr.sportFinishList.push(index)
			}
			setStorage('checkRecord',recordList)
			uni.showToast({title:'打卡状态更新'})
			this.$forceUpdate()
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
.head{font-size:34rpx;font-weight:bold;margin-bottom:30rpx;}
.sport-card{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx;display:flex;justify-content:space-between;align-items:center;}
.name{font-size:30rpx;}
.time{font-size:24rpx;color:#888;margin-top:8rpx;}
.empty{text-align:center;padding:100rpx;color:#888;}
</style>
