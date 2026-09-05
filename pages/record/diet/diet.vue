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
import { getStorage, setStorage } from '@/utils/storage.js';
import { getTodayStr } from "@/common/util.js";
import {
	store
} from '@/uni_modules/uni-id-pages/common/store.js';
export default {
	data(){
		return {
			plan_id:'',
			recordData: {
				diet: '',
				dietImgs: []
			},
			activePlan:{},
			todayStr:'',
			dietText:'',
			imgList:[]
		}
	},
	onLoad(options) {
		this.plan_id = options.plan_id;
		this.getRecordData();
	},
	computed: {
		userInfo() {
			return store.userInfo;
		}
	},
	methods: {
		async getRecordData() {
			let todayStr = getTodayStr();
			let res = await this.$cloudApi.getDayRecord({
				plan_id: this.plan_id,
				date: todayStr
			});
			if (res.data.length) {
				this.recordData.diet = res.data[0].diet;
				this.recordData.dietImgs = res.data[0].dietImgs;
			} else {
				let planRes = await this.$cloudApi.getPlanById({
					id: this.plan_id
				});
				if (planRes.data.length) {
					let res1 = await this.$cloudApi.addDayRecord({
						"plan_id": this.plan_id,
						"date": todayStr,
						"sportFinishList": sportCheckList,
						"diet": "",
						"dietImgs": [],
						"getUpTime": '',
						"sleepTime": '',
						"planGetUpTime": planRes.data[0].getUpTime,
						"planSleepTime": planRes.data[0].sleepTime,
						"status": 'running',
						"create_date": Date.now()
					});
				}
			}
		},
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
