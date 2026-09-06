<template>
	<page-bg :headTitle="headTitle">
		<view class="form-content">
			<view class="title">
				打卡以当前时间作为记录, 不可修改
			</view>
			<view class="form-item">
				<view class="top">
					<view class="title">
						<uni-icons custom-prefix="iconfont" type="icon-fit-alarm-clock" color="#72D1A8" size="22"></uni-icons>
						<text class="text">早起打卡</text>
					</view>
					<text @click="clickGetUp" class="btn" :class="{'disable': !!recordData.getUpTime }">{{ recordData.getUpTime ? '已打卡' : '打卡' }}</text>
				</view>
				<view class="bottom">
					<view class="plan">
						<text class="name">目标时间: </text>
						<text class="time">{{ planTime.getUpTime }}</text>
					</view>
					<view class="curt">
						<text class="name">打卡时间: </text>
						<text class="time">{{ recordData.getUpTime }}</text>
						<text class="title" v-if="recordData.getUpTime" :class="{'un-ok': !isGetUpTimeOk }">
						{{ isGetUpTimeOk ? '已完成' : '未完成' }}</text>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="top">
					<view class="title">
						<uni-icons custom-prefix="iconfont" type="icon-fit-alarm-clock" color="#72D1A8" size="22"></uni-icons>
						<text class="text">早睡打卡</text>
					</view>
					<text @click="clickSleep" class="btn" :class="{'disable': !!recordData.sleepTime }">{{ recordData.sleepTime ? '已打卡' : '打卡' }}</text>
				</view>
				<view class="bottom">
					<view class="plan">
						<text class="name">目标时间: </text>
						<text class="time">{{ planTime.sleepTime }}</text>
					</view>
					<view class="curt">
						<text class="name">打卡时间: </text>
						<text class="time">{{ recordData.sleepTime }}</text>
						<text class="title" v-if="recordData.sleepTime" :class="{'un-ok': !isSleepTimeOk }">
						{{ isSleepTimeOk ? '已完成' : '未完成' }}
					</text>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-box">
			<u-button type="primary" color="#72D1A8" @click="back">返回</u-button>
		</view>
		<record-success-popup :show="showPop" @close-pop="closePop"></record-success-popup>
	</page-bg>
</template>
<script>
import { getTodayStr } from "@/common/util.js";
import {
	store
} from '@/uni_modules/uni-id-pages/common/store.js';
export default {
	data(){
		return {
			headTitle: {
				title: '记录作息时间',
				subText: '每天都要早睡早起, 做一个健康自律人!'
			},
			plan_id:'',
			recordData: {
				getUpTime: '',
				sleepTime: ''
			},
			planTime: {
				getUpTime: '',
				sleepTime: ''
			},
			record_id:'',
			showPop: false,
			isLoading: false
		}
	},
	computed: {
		userInfo() {
			return store.userInfo;
		},
		isSleepTimeOk() {
			return this.recordData.sleepTime <= this.planTime.sleepTime;
		},
		isGetUpTimeOk() {
			return this.recordData.getUpTime <= this.planTime.getUpTime;
		}
	},
	onLoad(options) {
		this.plan_id = options.plan_id;
		this.getRecordData();
	},
	methods:{
		async getRecordData() {
			let todayStr = getTodayStr();
			let res = await this.$cloudApi.getDayRecord({
				plan_id: this.plan_id,
				date: todayStr
			});
			if (res.data.length) {
				this.recordData.getUpTime = res.data[0].getUpTime;
				this.recordData.sleepTime = res.data[0].sleepTime;
				this.planTime.getUpTime = res.data[0].planGetUpTime;
				this.planTime.sleepTime = res.data[0].planSleepTime;
				this.record_id = res.data[0]._id;
			} else {
				let planRes = await this.$cloudApi.getPlanById({
					id: this.plan_id
				});
				if (planRes.data.length) {
					let res1 = await this.$cloudApi.addDayRecord({
						"plan_id": this.plan_id,
						"date": todayStr,
						"sportFinishList": [],
						"diet": "",
						"dietImgs": [],
						"getUpTime": '',
						"sleepTime": '',
						"planGetUpTime": planRes.data[0].getUpTime,
						"planSleepTime": planRes.data[0].sleepTime,
						"status": 'running',
						"create_date": Date.now()
					});
					this.record_id = res1.id;
				}
			}
		},
		back() {
			uni.navigateBack();
		},
		closePop() {
			this.showPop = false;
			setTimeout(() => {
				uni.navigateBack();
			}, 300)
		},
		getNowTime() {
			let nowStr = (new Date()).toTimeString();
			let tmps = nowStr.split(':');
			return tmps[0] + ':' + tmps[1];
		},
		checkShowPopUp() {
			if (this.recordData.getUpTime && this.recordData.sleepTime) {
				this.showPop = true;
			}
		},
		clickGetUp() {
			if (this.isLoading || this.recordData.getUpTime) return;
			let nowTime = this.getNowTime();
			this.$cloudApi.saveCheckRecord({
				id: this.record_id,
				data: {
					"getUpTime": nowTime
				}
			}).then(res => {
				uni.showToast({
					title: '打卡成功'
				})
				this.recordData.getUpTime = nowTime;
			}).catch(e => {
				uni.showToast({
					title: e.msg || e.message || JSON.stringify(e)
				})
			}).finally(e => {
				this.isLoading = false;
			})
		},
		clickSleep() {
			if (this.isLoading || this.recordData.sleepTime) return;
			let nowTime = this.getNowTime();
			this.$cloudApi.saveCheckRecord({
				id: this.record_id,
				data: {
					"sleepTime": nowTime
				}
			}).then(res => {
				uni.showToast({
					title: '打卡成功'
				})
				this.recordData.sleepTime = nowTime;
			}).catch(e => {
				uni.showToast({
					title: e.msg || e.message || JSON.stringify(e)
				})
			}).finally(e => {
				this.isLoading = false;
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.form-content {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 16rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	margin-top: 60rpx;
	min-height: 200px;
	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 33rpx;
		box-sizing: border-box;
		line-height: 1.5;
	}
	.form-item {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		flex-direction: column;
		padding: 42rpx 0;
		&:not(:last-of-type) {
			border-bottom: solid 1px #f2f2f2;
		}
		.top {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.title {
				display: inline-flex;
				flex-direction: row;
				align-items: center;
				.text {
					font-size: 36rpx;
					margin-left: 14rpx;
				}
			}
			.btn {
				font-size: 28rpx;
				padding: 3px 8px;
				border: solid 1px #72D1A8;
				color: #fff;
				background-color: #72D1A8;
				border-radius: 5px;
				&.disable {
					background-color: #c7c9ce;
					border-color: #c7c9ce;
				}
			}
		}
		.bottom {
			display: flex;
			flex-direction: row;
			flex-direction: column;
			margin-left: 29px;
			font-size: 28rpx;
			line-height: 1.8;
			.plan {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 28rpx;
				.name {}
				.time {
					margin-left: 14rpx;
				}
			}
			.curt {
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #8bc8b9;
				font-size: 28rpx;
				.name {}
				.time {
					margin-left: 14rpx;
				}
				.title {
					font-size: 28rpx;
					margin-left: 24rpx;
					color: #00bd56;
					&.un-ok {
						color: #e43d33;
					}
				}
			}
		}
	}
}
.submit-box {
	margin: 37rpx 0;
}
</style>
