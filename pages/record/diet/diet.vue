<template>
	<view class="page">
		<view class="tip-card">
			<view class="t1">今日饮食目标</view>
			<view class="t2">{{activePlan.dietTip || '未设置饮食目标'}}</view>
		</view>
		<view class="form-item">
			<view class="label">今日实际饮食</view>
			<u-textarea v-model="dietText" placeholder="记录今天吃了什么"/>
		</view>
		<view class="form-item">
			<view class="label">上传实拍图（最多9张）</view>
			<u-upload
				:file-list="imgList"
				:max-count="9"
				@after-read="afterRead"
				@delete="delImg"
			></u-upload>
		</view>
		<u-button type="primary" @click="submit">提交打卡</u-button>
	</view>
</template>
<script>
import { getStorage, setStorage } from '@/utils/storage.js'
export default {
	data(){
		return {
			activePlan:{},
			todayStr:'',
			dietText:'',
			imgList:[]
		}
	},
	onLoad(){
		this.activePlan = getStorage('activePlan')
		let d = new Date()
		this.todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
		let recordList = getStorage('checkRecord')||[]
		let curr = recordList.find(r=>r.date===this.todayStr)
		if(curr){
			this.dietText = curr.dietText||''
			this.imgList = curr.dietImg||[]
		}
	},
	methods:{
		afterRead(res){
			this.imgList.push({url:res.file.url})
		},
		delImg(index){
			this.imgList.splice(index,1)
		},
		submit(){
			let recordList = getStorage('checkRecord')||[]
			let curr = recordList.find(r=>r.date===this.todayStr)
			if(!curr){
				curr = {date:this.todayStr,sportFinishList:[],dietFinish:false,getUpFinish:false,sleepFinish:false}
				recordList.push(curr)
			}
			curr.dietFinish = true
			curr.dietText = this.dietText
			curr.dietImg = this.imgList
			setStorage('checkRecord',recordList)
			uni.showToast({title:'饮食打卡完成'})
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
.tip-card{background:#fff;padding:30rpx;border-radius:20rpx;margin-bottom:30rpx;}
.t1{font-weight:bold;margin-bottom:10rpx;}
.form-item{margin-bottom:30rpx;}
.label{margin-bottom:16rpx;}
</style>
