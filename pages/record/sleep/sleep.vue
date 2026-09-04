<template>
	<view class="page">
		<view class="time-card">
			<view>目标早起时间：{{activePlan.getUpTime||'未设置'}}</view>
			<u-button :type="dayRecord.getUpFinish?'success':'primary'" @click="clockGetUp">
				{{dayRecord.getUpFinish?'早起已打卡':'早起打卡'}}
			</u-button>
		</view>
		<view class="time-card">
			<view>目标早睡时间：{{activePlan.sleepTime||'未设置'}}</view>
			<u-button :type="dayRecord.sleepFinish?'success':'primary'" @click="clockSleep">
				{{dayRecord.sleepFinish?'早睡已打卡':'早睡打卡'}}
			</u-button>
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
			let list = getStorage('checkRecord')||[]
			return list.find(r=>r.date===this.todayStr) || {date:this.todayStr,sportFinishList:[],dietFinish:false,getUpFinish:false,sleepFinish:false}
		}
	},
	onLoad(){
		this.activePlan = getStorage('activePlan')
		let d = new Date()
		this.todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
	},
	methods:{
		clockGetUp(){
			let list = getStorage('checkRecord')||[]
			let curr = list.find(r=>r.date===this.todayStr)
			if(!curr){
				curr = {date:this.todayStr,sportFinishList:[],dietFinish:false,getUpFinish:false,sleepFinish:false}
				list.push(curr)
			}
			curr.getUpFinish = !curr.getUpFinish
			setStorage('checkRecord',list)
			uni.showToast({title:'状态更新'})
			this.$forceUpdate()
		},
		clockSleep(){
			let list = getStorage('checkRecord')||[]
			let curr = list.find(r=>r.date===this.todayStr)
			if(!curr){
				curr = {date:this.todayStr,sportFinishList:[],dietFinish:false,getUpFinish:false,sleepFinish:false}
				list.push(curr)
			}
			curr.sleepFinish = !curr.sleepFinish
			setStorage('checkRecord',list)
			uni.showToast({title:'状态更新'})
			this.$forceUpdate()
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
.time-card{background:#fff;padding:40rpx;border-radius:20rpx;margin-bottom:24rpx;display:flex;justify-content:space-between;align-items:center;}
</style>
