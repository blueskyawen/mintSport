<template>
	<page-bg :headTitle="headTitle">
		<view class="form-content">
			<view class="title">
				<text>完成度:</text>
				<text class="rate">{{ finishRate }}</text>
			</view>
			<view class="form-item" v-for="(item, index) in recordData" :key="index">
				<view class="left">
					<uni-icons custom-prefix="iconfont" type="icon-fit-run-man" color="#ff9900" size="22"></uni-icons>
					<text class="name">{{ item.name }}</text>
					<text class="time">{{ item.time }} 分钟</text>
				</view>
				<uni-icons v-if="item.finish" custom-prefix="iconfont" type="icon-fit-finished" color="#ff9900" size="22"></uni-icons>
				<text v-else @click.stop="selectCheck(item)">
					<uni-icons :class="{'hidden': !item.checked }" custom-prefix="iconfont" type="icon-fit-check-finish"
						color="#19be6b" size="22"></uni-icons>
					<uni-icons :class="{'hidden': item.checked }" custom-prefix="iconfont" type="icon-fit-check-finish"
						color="#88888" size="22"></uni-icons>
				</text>
			</view>
		</view>
		<view class="submit-box">
			<u-button type="primary" :loading="isLoading" color="#72D1A8" @click="submit">提交</u-button>
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
	data() {
		return {
			headTitle: {
				title: '打卡运动项目',
				subText: '记录今天的运动情况, 加油, 自律人!'
			},
			plan_id:'',
			recordData: [],
			isLoading: false,
			record_id:'',
			showPop: false
		}
	},
	computed: {
		userInfo() {
			return store.userInfo;
		},
		finishRate() {
			let total = this.recordData.length;
			let checkNum = this.recordData.filter(x => x.checked).length;
			let rate = total > 0 ? Math.ceil((checkNum * 100) / total) : 0;
			return rate + '%'
		}
	},
	onLoad(options) {
		this.plan_id = options.plan_id;
		this.getRecordData();
	},
	methods: {
		async getRecordData() {
			let todayStr = getTodayStr();
			let res = await this.$cloudApi.getDayRecord({
				plan_id: this.plan_id,
				date: todayStr
			});
			if (res.data.length) {
				this.recordData = res.data[0].sportFinishList.map(x => {
					return {...x, checked: x.finish}
				});
				this.record_id = res.data[0]._id;
			} else {
				let planRes = await this.$cloudApi.getPlanById({
					id: this.plan_id
				});
				if (planRes.data.length) {
					let planSports = planRes.data[0].sportList;
					let sportCheckList = planSports.map(x => {
						return {
							...x,
							finish: false,
							checked: false
						}
					});
					let res1 = await this.$cloudApi.addDayRecord({
						"user_id": this.userInfo._id,
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
					this.record_id = res1.id;
					this.recordData = sportCheckList;
				}
			}
		},
		selectCheck(item) {
			item.checked = !item.checked;
		},
		isModify(updateList) {
			return this.recordData.find(x => {
				let fdItem = updateList.find(y => y.name == x.name);
				return fdItem ? fdItem.finish !== x.finish : false;
			})
		},
		submit() {
			if (this.isLoading) return;
			this.isLoading = true;
			let updateList = this.recordData.map(x => {
				return {
					name: x.name,
					time: x.time,
					finish: x.checked
				}
			});
			if (!this.isModify(updateList)) {
				uni.navigateBack();
				return;
			}
			console.log('saveCheckRecord==')
			this.$cloudApi.saveCheckRecord({
				id: this.record_id,
				data: {
					"sportFinishList": updateList
				}
			}).then(res => {
				if (updateList.every(x => x.finish == true)) {
					this.showPop = true;
				} else {
					uni.showToast({
						title: '提交成功'
					})
					setTimeout(() => {
						uni.navigateBack();
					}, 1000)
				}
			}).catch(e => {
				uni.showToast({
					title: e.msg || e.message || JSON.stringify(e)
				})
				this.isLoading = false;
			})
		},
		closePop() {
			this.showPop = false;
			setTimeout(() => {
				uni.navigateBack();
			}, 300)
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
		line-height: 2;
		.rate {
			font-size: 33rpx;
			margin-left: 14rpx;
		}
	}
	.form-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 38rpx 0;
		&:not(:last-of-type) {
			border-bottom: solid 1px #f2f2f2;
		}
		.left {
			display: inline-flex;
			flex-direction: row;
			align-items: center;
			margin-right: 46rpx;
		}
		.name {
			font-size: 38rpx;
			margin-left: 14rpx;
		}
		.time {
			font-size: 33rpx;
			margin-left: 19rpx;
			white-space: nowrap;
		}
		.hidden {
			display: none;
		}
	}
}
.submit-box {
	margin: 37rpx 0;
}
</style>
