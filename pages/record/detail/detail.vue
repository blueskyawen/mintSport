<template>
	<page-bg :headTitle="headTitle">
		<view class="form-content">
			<view class="form-item">
				<view class="left">
					<uni-icons custom-prefix="iconfont" type="icon-fit-alarm-clock" color="#2979ff" size="22"></uni-icons>
					<text class="name">早起打卡</text>
					<text class="time">{{ plan.getUpTime }}</text>
				</view>
				<view class="right">
					<view class="completed" v-if="recordData.getUpTime">
						<view class="state">
							<text class="time">{{ recordData.getUpTime }}</text>
							<text class="state-t" :class="{'not-ok': !isGetUpOk}">{{ isGetUpOk ? '已达标' : '未达标' }}</text>
						</view>
						<text class="title">已打卡</text>
					</view>
					<text class="incomplete" v-else>待打卡</text>
				</view>
			</view>
			<view class="form-item" v-for="(item, index) in sportList" :key="index">
				<view class="left">
					<uni-icons custom-prefix="iconfont" type="icon-fit-run-line" color="#ff9900" size="22"></uni-icons>
					<text class="name">{{ item.name }}</text>
				</view>
				<view class="right">
					<text class="completed-1" v-if="item.finish">已完成</text>
					<text class="incomplete-1" v-else>待完成</text>
				</view>
			</view>
			<view class="form-item">
				<view class="left">
					<uni-icons custom-prefix="iconfont" type="icon-fit-yinshi" color="#19be6b" size="22"></uni-icons>
					<text class="name">饮食记录</text>
				</view>
				<view class="right">
					<text class="completed-1" v-if="recordData.diet">已完成</text>
					<text class="incomplete-1" v-else>待完成</text>
				</view>
			</view>
			<view class="form-item">
				<view class="left">
					<uni-icons custom-prefix="iconfont" type="icon-fit-alarm-clock" color="#2979ff" size="22"></uni-icons>
					<text class="name">早睡打卡</text>
					<text class="time">{{ plan.sleepTime }}</text>
				</view>
				<view class="right">
					<view class="completed" v-if="recordData.sleepTime">
						<view class="state">
							<text class="time">{{ recordData.sleepTime }}</text>
							<text class="state-t" :class="{'not-ok': !isSleepOk}">{{ isSleepOk ? '已达标' : '未达标' }}</text>
						</view>
						<text class="title">已打卡</text>
					</view>
					<text class="incomplete" v-else>待打卡</text>
				</view>
			</view>
		</view>
		<view class="rate">
			<text>今日完成度</text>
			<text class="text">{{ complateRate }}</text>
		</view>
	</page-bg>
</template>

<script>
	import { getTodayStr } from "@/common/util.js";
	const weekMap = ['日','一','二','三','四','五','六']
	export default {
		data() {
			return {
				headTitle: {
					title: '',
					subText: ''
				},
				plan_id:'',
				plan: {},
				recordData: {},
				sportList: [],
				rate: '0%',
				total: 0
			}
		},
		computed: {
			isGetUpOk() {
				return this.recordData.getUpTime <= this.plan.getUpTime
			},
			isSleepOk() {
				return this.recordData.sleepTime <= this.plan.sleepTime
			},
			complateRate() {
				let count = this.sportList.filter(x => x.finish).length;
				if (this.recordData.diet) {
					count++;
				}
				if (this.recordData.getUpTime) {
					count++;
				}
				if (this.recordData.sleepTime) {
					count++;
				}
				return Math.ceil((count * 100) / this.total) + '%'
			}
		},
		onLoad(options) {
			this.plan_id = options.plan_id;
			this.getRecordData();
		},
		methods: {
			async getRecordData() {
				let planRes = await this.$cloudApi.getPlanById({
					id: this.plan_id
				});
				this.plan = planRes.data[0] || {};
				this.headTitle.title = this.plan.name;
				let now = new Date();
				let planCreateTime = new Date(this.plan.create_date);
				let planStart = planCreateTime.toJSON().split('T').shift() + ' 00:00:00'
				let planStartTime = new Date(planStart).valueOf();
				let num = Math.ceil((now.valueOf() - planCreateTime) / 86400000)
				this.headTitle.subText = '今天周' + weekMap[now.getDay()] + ' · ' + '第 ' + num + ' 天';
				let todayStr = getTodayStr();
				let res = await this.$cloudApi.getDayRecord({
					plan_id: this.plan_id,
					date: todayStr
				});
				this.recordData = res.data[0] || {};
				this.sportList = this.recordData.sportFinishList;
				this.total = this.sportList.length + 3;
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
			line-height: 1;
			.name {
				font-size: 33rpx;
				margin-left: 14rpx;
			}
			.time {
				font-size: 28rpx;
				margin-left: 14rpx;
				line-height: 33rpx;
			}
		}
		.right {
			display: inline-flex;
			flex-direction: row;
			align-items: center;
			margin-right: 46rpx;
			font-size: 28rpx;
			.completed-1 {
				color: $main-color;
			}
			.completed {
				display: inline-flex;
				flex-direction: row;
				align-items: center;
				font-size: 28rpx;
				.title {
					color: $main-color;
				}
				.state {
					margin-right: 28rpx;
					display: inline-flex;
					flex-direction: column;
					.time {
						margin-bottom: 7rpx;
					}
					.state-t {
						color: #2979ff;
						&.not-ok {
							color: #e43d33;
						}
					}
				}
			}
		}
	}
}
.rate {
	box-sizing: border-box;
	width: 100%;
	padding: 23rpx 33rpx;
	background-color: #dbf1e1;
	margin: 30rpx 0;
	font-size: 33rpx;
	border-radius: 18rpx;
	.text {
		margin-left: 14rpx;
	}
}
</style>
