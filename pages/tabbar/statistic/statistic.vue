<template>
	<view class="page">
		<view class="card">
			<view>总打卡天数：{{totalCheck}}</view>
			<view>周期完成率：{{rate}}%</view>
		</view>
		<view class="chart-box">
			<canvas canvas-id="lineCanvas" style="width:100%;height:400rpx;"></canvas>
		</view>
	</view>
</template>
<script>
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
import { getStorage } from '@/utils/storage.js'
export default {
	data(){
		return {
			totalCheck:0,
			rate:0
		}
	},
	onShow(){
		let recordList = getStorage('checkRecord')||[]
		this.totalCheck = recordList.length
		let activePlan = getStorage('activePlan')
		if(activePlan && activePlan.totalDay){
			this.rate = Math.round(this.totalCheck / activePlan.totalDay *100)
		}
		this.drawChart(recordList)
	},
	methods:{
		drawChart(list){
			let ctx = uni.createCanvasContext('lineCanvas',this)
			let chart = new uCharts({
				ctx:ctx,
				canvasId:'lineCanvas',
				type:'line',
				series:[{name:'每日完成',data:list.map(item=>{
					let count = 0
					if(item.sportFinishList && item.sportFinishList.length>0) count++
					if(item.dietFinish) count++
					if(item.getUpFinish) count++
					if(item.sleepFinish) count++
					return count
				})}],
				xAxis:{categories:list.map(i=>i.date)},
				legend:{show:false},
				padding:[10,10,10,10]
			})
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
.card{background:#fff;padding:30rpx;border-radius:20rpx;margin-bottom:20rpx;}
.chart-box{background:#fff;padding:20rpx;border-radius:20rpx;}
</style>
