<template>
	<page-bg :headTitle="headTitle" :navBarHeight="navBarHeight">
		<view class="static-content" v-if="!isLoading && plan._id">
			<view class="lishi">
				<text @click="toRecordList">历史打卡记录</text>
			</view>
			<view class="head">
				<view class="left">
					计划周期: {{ plan.totalDay}} 天
				</view>
				<view class="right">
					今天第 {{ dayCount }} 天
				</view>
			</view>
			<view class="content">
				<view class="item-card">
					<view class="card-head">
						<uni-icons custom-prefix="iconfont" type="icon-fit-overview" color="#888880" size="22"></uni-icons>
						<text class="name">概览</text>
					</view>
					<view class="card">
						<view class="items">
							<view class="item" v-for="(item, index) in overViewItems" :key="index">
								<view>{{ item.name }}</view>
								<view>
									<text class="num">{{ item.value }}</text> 天
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="item-card">
					<view class="card-head">
						<uni-icons custom-prefix="iconfont" type="icon-fit-sport-log" color="#2979ff" size="22"></uni-icons>
						<text class="name">运动</text>
					</view>
					<view class="card">
						<view class="items">
							<view class="item" v-for="(item, index) in sportItems" :key="index">
								<view>{{ item.name }}</view>
								<view>
									<text class="num">{{ item.value }}</text> {{item.unitText}}
								</view>
							</view>
						</view>
						<view class="charts">
							<qiun-data-charts
							  type="line"
							  :opts="sportChartOpts"
							  :chartData="sportChartData"
							  :ontouch="true"
							  :canvas2d="true"
							  canvasId="sportcanvas"
							/>
						</view>
					</view>
				</view>
				<view class="item-card">
					<view class="card-head">
						<uni-icons custom-prefix="iconfont" type="icon-fit-alarm-clock" color="#72D1A8" size="22"></uni-icons>
						<text class="name">作息</text>
					</view>
					<view class="card">
						<view class="items">
							<view class="item" v-for="(item, index) in sleepItems" :key="index">
								<view>{{ item.name }}</view>
								<view>
									<text class="num">{{ item.value }}</text> {{item.unitText}}
								</view>
							</view>
						</view>
						<view class="charts">
							<qiun-data-charts
							  type="column"
							  :opts="sleepChartOpts"
							  :chartData="sleepChartData"
							  :ontouch="true"
							  :canvas2d="true"
							  canvasId="sleepcanvas"
							/>
						</view>
					</view>
				</view>
			</view>
			<view class="foot" v-if="sugestList.length">
				<view class="headt">
					<uni-icons type="info-filled" size="24" color="#f3a73f"></uni-icons>
					<text class="text">问题与建议</text>
				</view>
				<view class="title-items">
					<view class="title-item" v-for="(option, index) in sugestList" :key="index">
						<text>{{ index + 1 }}. </text>
						<text class="title">{{ option }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="form-content" v-if="!isLoading && !plan._id">
			<image class="empty-img" mode="widthFix" src="https://env-00jy6sztxc4d.normal.cloudstatic.cn/CDN/no-data.png"></image>
			<view class="title">暂无进行中的计划</view>
		</view>
	</page-bg>
</template>
<script>
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
import {
	store
} from '@/uni_modules/uni-id-pages/common/store.js';
import { getTodayStr, getFullDateStr } from "@/common/util.js";
export default {
	components: {},
	data(){
		return {
			headTitle: {
				title: '',
				subText: '数据统计 · 坚持正在形成习惯'
			},
			plan: {},
			records: [],
			isLoading: true,
			dayCount: 0,
			navBarHeight: 44, // 导航栏高度
			overViewItems: [
				{
					name: '累计打卡',
					value: 0
				},
				{
					name: '累计已完成',
					value: 0
				},
				{
					name: '连续打卡',
					value: 0
				}
			],
			sportItems: [
				{
					name: '全部完成',
					value: 0,
					unitText: '天'
				},
				{
					name: '累计运动',
					value: 0,
					unitText: '分钟'
				},
				{
					name: '平均每天',
					value: 0,
					unitText: '分钟'
				}
			],
			sleepItems: [
				{
					name: '早起完成',
					value: 0,
					unitText: '天'
				},
				{
					name: '早睡完成',
					value: 0,

					unitText: '天'
				},
				{
					name: '平均睡眠',
					value: 0,
					unitText: '小时'
				}
			],
			sportChartData: {},
			sportChartOpts: {
				color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				padding: [30,0,0,0],
				enableScroll: true,
				legend: {},
				xAxis: {
				  disableGrid: true,
				  scrollShow: true,
				   itemCount: 6
				},
				yAxis: {
				  gridType: "dash",
				  dashLength: 2
				},
				extra: {
				  line: {
					type: "straight",
					width: 2,
					activeType: "hollow"
				  }
				}
			},
			sleepChartOpts: {
				color: ["#72D1A8","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				padding: [30,0,0,0],
				touchMoveLimit: 24,
				enableScroll: true,
				legend: {},
				xAxis: {
				  disableGrid: true,
				  scrollShow: true,
				  itemCount: 10
				},
				yAxis: {
				  data: [
					{
					  min: 0
					}
				  ]
				},
				extra: {
				  column: {
					type: "group",
					width: 20,
					activeBgColor: "#000000",
					activeBgOpacity: 0.08
				  }
				}
			},
			sleepChartData: {},
			sugestTexts: [
				'每日打卡完成率过低',
				'早起达标率过低',
				'早睡达标率过低'
			],
			sugestList: []
		}
	},
	computed: {
		userInfo() {
			return store.userInfo;
		}
	},
	onReady() {
		// #ifdef H5
		this.navBarHeight = 10;
		// #endif
		// #ifndef H5
		this.navBarHeight = uni.getSystemInfoSync().system.toLowerCase().includes('ios') ? 44 : 48;
		// #endif
	},
	onShow() {
		this.loadData();
	},
	methods: {
		getSleepChartData(items) {
			items.sort((x,y) => y.id - x.id);
			let names = items.map(x => (x.id + 1) + '');
			let timeList = items.map(x => x.sleepTime);
			let res = {
				categories: names,
				series: [
				  {
					name: "每日睡眠时长(小时)",
					data: timeList
				  }
				]
			  };
			this.sleepChartData = JSON.parse(JSON.stringify(res));
		},
		getSportChartData() {
			let tmpRecords = [];
			let today = new Date();
			for (let i = 0; i < this.dayCount; i++) {
				let tmpDay = new Date();
				tmpDay.setDate(today.getDate() - i);
				let dateStr = getFullDateStr(tmpDay);
				tmpRecords.push({
					id: i,
					date: dateStr,
					sportTime: 0
				})
			}
			tmpRecords.forEach(x => {
				let fdItem = this.records.find(y => y.date == x.date)
				if (fdItem) {
					fdItem.sportFinishList.forEach(t => {
						if (t.finish) {
							x.sportTime += t.time;
						}
					})
				}
			});
			tmpRecords.sort((x,y) => y.id - x.id);
			let names = tmpRecords.map(x => x.date.split('-')).map(y => y[1] + '-' + y[2]);
			let timeList = tmpRecords.map(x => x.sportTime);
			let res = {
				categories: names,
				series: [
				  {
					name: "运动时长(分钟)",
					data: timeList
				  }
				]
			  };
			this.sportChartData = JSON.parse(JSON.stringify(res));
		},
		getSleepData() {
			let getupNum = 0, sleepNum = 0, allNum = 0, sleepTime = 0;
			let tmpRecords = [];
			let sleepTimeItems = [];
			let today = new Date();
			for (let i = 0; i < this.dayCount; i++) {
				let tmpDay = new Date();
				tmpDay.setDate(today.getDate() - i);
				let dateStr = getFullDateStr(tmpDay);
				tmpRecords.push({
					date: dateStr,
					getUpTime: '',
					sleepTime: ''
				})
			}
			for (let index = 0; index < this.records.length; index++) {
				let tmp = this.records[index];
				if (tmp.getUpTime && (tmp.getUpTime <= tmp.planGetUpTime)) {
					getupNum++;
				}
				if (tmp.sleepTime && (tmp.sleepTime <= tmp.planSleepTime)) {
					sleepNum++;
				}
				let fdItem = tmpRecords.find(x => x.date == tmp.date)
				if (fdItem) {
					fdItem.getUpTime = tmp.getUpTime;
					fdItem.sleepTime = tmp.sleepTime;
				}
			}
			for (let t = 0; t < tmpRecords.length - 1; t++) {
				let tmp = tmpRecords[t];
				let nextTmp = tmpRecords[t + 1];
				if (tmp.getUpTime && nextTmp.sleepTime) {
					allNum++;
					let getupItems = tmp.getUpTime.split(':').map(x => +x);
					let sleepItemss = nextTmp.sleepTime.split(':').map(x => +x);
					let sleepMins = (24 * 60 - sleepItemss[0] * 60 - sleepItemss[1]) + getupItems[0] * 60 +getupItems[1];
					sleepTime += sleepMins;
					sleepTimeItems.push({
						id: t,
						sleepTime: +((sleepMins / 60).toFixed(1))
					})
				} else {
					sleepTimeItems.push({
						id: t,
						sleepTime: 0
					})
				}
			}
			this.sleepItems[0].value = getupNum;
			this.sleepItems[1].value = sleepNum;
			this.sleepItems[2].value = allNum ? +((sleepTime / (allNum * 60)).toFixed(1)) : '-';
			this.getSleepChartData(sleepTimeItems);
		},
		getSportData() {
			let allTime = 0, finishNum = 0, pjTime = 0;
			for (let index = 0; index < this.records.length; index++) {
				let tmp = this.records[index];
				if (tmp.sportFinishList.every(x => x.finish)) {
					finishNum++;
				}
				tmp.sportFinishList.forEach(x => {
					if (x.finish) {
						allTime += x.time;
					}
				});
			}
			if (allTime > this.dayCount * 100) {
				pjTime = Number((allTime / (60 * this.dayCount)).toFixed(1));
				this.sportItems[2].unitText = '小时';
			} else {
				pjTime = Math.floor(allTime / this.dayCount);
				this.sportItems[2].unitText = '分钟';
			}
			if (allTime > 100) {
				let hourTime = Number((allTime / 60).toFixed(1));
				allTime = hourTime;
				this.sportItems[1].unitText = '小时';
			} else {
				this.sportItems[1].unitText = '分钟';
			}
			this.sportItems[0].value = finishNum;
			this.sportItems[1].value = allTime;
			this.sportItems[2].value = pjTime;
		},
		getOverviewData() {
			let allNum = this.records.length;
			let finishNum = this.records.filter(x => x.status == 'finish').length;
			let contiNum = 0;
			const todayStr = getTodayStr();
			if (this.records.find(x => x.date == todayStr)) {
				let today = new Date();
				for (let index = 0; index < this.dayCount; index++) {
					let tmpDay = new Date();
					tmpDay.setDate(today.getDate() - index);
					let dateStr = getFullDateStr(tmpDay);
					if (this.records.find(x => x.date == dateStr)) {
						contiNum++;
					} else {
						break;
					}
				}
			}
			this.overViewItems[0].value = allNum;
			this.overViewItems[1].value = finishNum;
			this.overViewItems[2].value = contiNum;
		},
		getDayCount() {
			let now = new Date();
			let planCreateTime = new Date(this.plan.create_date);
			let planStart = getFullDateStr(planCreateTime) + ' 00:00:00'
			let planStartTime = new Date(planStart).valueOf();
			return Math.ceil((now.valueOf() - planCreateTime) / 86400000)
		},
		async loadData() {
			if (this.userInfo._id) {
				try {
					let planRes = await this.$cloudApi.getActivePlan({
						user_id: this.userInfo._id
					});
					this.plan = planRes.data[0] || {};
					this.headTitle.title = this.plan.name || '统计分析'
					if (this.plan._id) {
						this.dayCount = this.getDayCount();
						let res = await this.$cloudApi.getPlanRecords({
							plan_id: this.plan._id
						});
						this.records = res.data || [];
						this.getOverviewData();
						this.getSportData();
						this.getSleepData();
						this.getSportChartData();
						this.isLoading = false;
					} else {
						this.isLoading = false;
					}
				} catch(e) {
					this.isLoading = false;
				}
			} else {
				this.isLoading = false;
			}
		},
		toRecordList() {
			uni.navigateTo({
				url: '/pages/record/list/list?id=' + this.plan._id + '&from=statistic'
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.static-content {
	margin-top: 60rpx;
	.lishi {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-bottom: 24rpx;
		color: #888;
		font-size: 28rpx;
	}
	.head {
		border-radius: 18rpx;
		padding: 24rpx 30rpx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-size: 33rpx;
	}
	.content {
		margin-top: 24rpx;
		min-height: 300px;
		border-radius: 18rpx;
		padding: 24rpx 30rpx;
		background-color: #fff;
		.item-card {
			display: flex;
			flex-direction: column;
			padding: 14rpx 0 47rpx;
			&:not(:last-of-type) {
				border-bottom: solid 1px #f2f2f2;
			}
			.card-head {
				display: flex;
				flex-direction: row;
				.name {
					font-size: 33rpx;
					margin-left: 14rpx;
				}
			}
			.card {
				margin-top: 28rpx;
				width: 100%;
				.items {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					width: 100%;
					.item {
						display: inline-flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						box-shadow: 0 0 5px rgba($color: #cbcacc, $alpha: 0.5);
						width: 197rpx;
						height: 197rpx;
						border-radius: 30rpx;
						font-size: 33rpx;
						line-height: 1.4;
						.num {
							font-size: 46rpx;
							font-weight: bold;
						}
					}
				}
				.charts {
					width: 100%;
					height: 562rpx
				}
			}
		}
	}
	.foot {
		background-color: #fff;
		border-radius: 18rpx;
		padding: 20rpx 30rpx;
		margin-top: 24rpx;
		box-shadow: 0 0 5px rgba($color: #d8d8d8, $alpha: 0.5);
		.headt {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			font-size: 38rpx;
			line-height: 1;
			.text {
				margin-left: 19rpx;
			}
		}
		.title-items {
			display: flex;
			flex-direction: column;
			font-size: 33px;
			margin-top: 19rpx;
			line-height: 1.5;
			.title-item {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				.title {}
			}
		}
	}
}
.form-content {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 16rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 80rpx;
	min-height: 200px;
	.empty-img {
		width: 100%;
	}
	.title {
		font-size: 36rpx;
		margin-bottom: 36rpx;
	}
}
</style>
