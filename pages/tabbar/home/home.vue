<template>
	<view class="home" :style="{ height: heighth + 'px' }">
		<image class="bg-img" mode="widthFix" src="/static/bg/home.jpg"></image>
		<view class="content">
			<view class="user-bar">
				<image v-if="avatorSrc" :src="avatorSrc" class="avatar"></image>
				<text class="name">{{ userInfo ? (userInfo.nickname || userInfo.username) : '匿名用户' }}</text>
			</view>
			<view class="head">
				<view class="sologn">今天也要动起来</view>
				<view class="day-text">已连续打卡 {{ continueDay }} 天</view>
			</view>
			<view class="card-box">
				<view v-if="plan._id" class="has-plan">
					<view class="card-head">
						<text class="title">今日计划</text>
						<view class="you">
							<u-icon name="arrow-right" color="#c7c7c7" size="12" @click="toDetail"></u-icon>
						</view>
					</view>
					<view class="card-content">
						<view class="cont-left">
							<view class="t-item">
								<view class="w-icon yundong">
									<uni-icons custom-prefix="iconfont" type="icon-fit-run-line" color="#ff9900" size="22"></uni-icons>
								</view>
								<view class="w-title">
									<text class="title-t">今日运动</text>
									<text class="title-b">{{ todayRecord.sportTime }} 分钟</text>
								</view>
							</view>
							<view class="t-item">
								<view class="w-icon chishi">
									<uni-icons custom-prefix="iconfont" type="icon-fit-yinshi" color="#19be6b" size="22"></uni-icons>
								</view>
								<view class="w-title">
									<text class="title-t">今日饮食</text>
									<text class="title-b">{{ todayRecord.dish ? '已记录' : '未记录' }}</text>
								</view>
							</view>
							<view class="t-item">
								<view class="w-icon sleep">
									<uni-icons custom-prefix="iconfont" type="icon-fit-alarm-clock" color="#2979ff" size="22"></uni-icons>
								</view>
								<view class="w-title">
									<text class="title-t">睡眠目标</text>
									<text class="title-b">{{ todayRecord.sleepTitle }}</text>
								</view>
							</view>
						</view>
						<view class="cont-right">
							<view class="chart-box">
							   <qiun-data-charts type="arcbar":opts="opts" :chartData="chartData"/>
							</view>
							<image class="img" src="/static/bg/run-man2.png"></image>
						</view>
					</view>
				</view>
				<view v-else class="no-plan">
					<view class="set-left">
						<view class="text">
							你还没有健身打卡计划, 创建一个专属计划
						</view>
						<view class="btn-box">
							<button class="t-btn" @tap="goAddPlan">创建计划</button>
						</view>
					</view>
					<view class="set-right">
						<image src="/static/bg/ready.png" class="ready-man"></image>
					</view>
				</view>
			</view>
			<view class="action-box">
				<view class="item" @tap="goAddPlan">
					<view class="oper">
						<uni-icons custom-prefix="iconfont" type="icon-fit-add-jihua" color="#ff9900" size="22"></uni-icons>
					</view>
					<text>定制计划</text>
				</view>
				<view class="item" @tap="goRecordSport">
					<view class="oper">
						<uni-icons custom-prefix="iconfont" type="icon-fit-sport-log" color="#2979ff" size="22"></uni-icons>
					</view>
					<text>运动打卡</text>
				</view>
				<view class="item" @tap="goRecordDiet">
					<view class="oper">
						<uni-icons custom-prefix="iconfont" type="icon-fit-dish" color="#ff9900" size="22"></uni-icons>
					</view>
					<text>记录饮食</text>
				</view>
				<view class="item" @tap="goRecordSleep()">
					<view class="oper">
						<uni-icons custom-prefix="iconfont" type="icon-fit-sleep-time" color="#72D1A8" size="22"></uni-icons>
					</view>
					<text>记录作息</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	store
} from '@/uni_modules/uni-id-pages/common/store.js';
import parseImageUrl from "@/common/parseImageUrl.js";
import { getTodayStr } from "@/common/util.js";
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
var uChartsInstance = {};
export default {
	data() {
		return {
			avatorSrc: '/static/logo.png',
			avatorUrl: '',
			continueDay: 0,
			plan: {},
			heighth: 500,
			todayRecord: {
				sportTime: 0,
				dish: false,
				sleepTime: {
					getup: '',
					sleep: ''
				},
				sleepTitle: '0%'
			},
			chartData: {},
			      opts: {
			        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
			        padding: undefined,
			        title: {
			          name: "",
			          fontSize: 35,
			          color: "#2fc25b"
			        },
			        subtitle: {
			          name: "",
			          fontSize: 25,
			          color: "#666666"
			        },
			        extra: {
			          arcbar: {
			            type: "default",
			            width: 10,
			            backgroundColor: "#E9E9E9",
			            startAngle: 0.2,
			            endAngle: 0.75,
			            gap: 2,
			            direction: "ccw",
			            linearType: "custom"
			          }
			        }
			      }
		}
	},
	computed: {
		userInfo() {
			return store.userInfo;
		},
		hasLogin() {
			return store.hasLogin
		}
	},
	onLoad() {
		this.heighth = uni.getWindowInfo().windowHeight;
	},
	onShow() {
		this.init();
		this.getAvatorImg();
	},
	onReady() {
		this.getServerData();
	},
	methods: {
		init() {
			if (this.hasLogin) {
				this.loadData();
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
					// url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
				})
			}
		},
		isGetAvator() {
			return this.userInfo.avatar_file &&
					this.userInfo.avatar_file.url &&
					this.userInfo.avatar_file.url !== this.avatorUrl;
		},
		async getAvatorImg() {
			if (this.isGetAvator()) {
				this.avatorUrl = this.userInfo.avatar_file.url;
				let images = [this.userInfo.avatar_file.url];
				let resImgs = await parseImageUrl(images);
				this.avatorSrc = resImgs[0] ? resImgs[0].src : '';
			}
		},
		async loadData() {
			if (this.userInfo._id) {
				let planRes = await this.$cloudApi.getActivePlan({
					user_id: this.userInfo._id
				});
				if (planRes.data.length) {
					this.plan = planRes.data[0];
					const todayStr = getTodayStr();
					let res = await this.$cloudApi.getPlanRecords({
						plan_id: this.plan._id
					});
					let records = res.data || [];
					if (records.length) {
						// 累计打卡天数
						this.continueDay = records.filter(x => x.status === 'finish').length;
						const todayStr = getTodayStr();
						let todayData = records.find(x => x.date == todayStr);
						if (todayData) {
							let count = todayData.diet ? 3 : 0;
							this.todayRecord.dish = todayData.diet;
							this.todayRecord.sleepTime.getup = todayData.getUpTime;
							this.todayRecord.sleepTime.sleep = todayData.sleepTime;
							if (todayData.getUpTime && todayData.sleepTime) {
								count += 2;
								let isGetupOk = todayData.getUpTime <= todayData.planGetUpTime;
								let isSleepOk = todayData.sleepTime <= todayData.planSleepTime;
								this.todayRecord.sleepTitle = (isGetupOk && isSleepOk) ? '已完成' : '未完成'
							} else {
								if (todayData.getUpTime || todayData.sleepTime) {
									this.todayRecord.sleepTitle = '50%';
									count += 1;
								} else {
									this.todayRecord.sleepTitle = '0%';
								}
							}
							let tmpTime = 0;
							let finishedSports = todayData.sportFinishList.filter(x => x.finish);
							let finishNum = finishedSports.length;
							if (finishNum > 0) {
								if (finishNum == todayData.sportFinishList.length) {
									count += 5;
								} else {
									count += 2;
								}
							}
							finishedSports.forEach(x => {
								tmpTime += x.time;
							})
							this.todayRecord.sportTime = tmpTime;
							this.getServerData(count / 10);
						}
					}
				}
			}
		},
		getServerData(value) {
		  setTimeout(() => {
			//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
	        let res = {
	            series: [
	              {
	                color: "#2fc25b",
	                data: value || 0
	              }
	            ]
	          };
	        this.chartData = JSON.parse(JSON.stringify(res));
		  }, 500);
		},
		goAddPlan() {
			uni.navigateTo({
				url: '/pages/plan/create/create'
			})
		},
		toDetail() {
			uni.navigateTo({
				url: '/pages/record/detail/detail?plan_id=' + this.plan._id
			})
		},
		goRecordSport() {
			if (!this.plan._id) {
				uni.showToast({
					title: '你还没有专属计划, 请先创建'
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/record/sport/sport?plan_id=' + this.plan._id
			})
		},
		goRecordDiet() {
			if (!this.plan._id) {
				uni.showToast({
					title: '你还没有专属计划, 请先创建'
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/record/diet/diet?plan_id=' + this.plan._id
			})
		},
		goRecordSleep() {
			if (!this.plan._id) {
				uni.showToast({
					title: '你还没有专属计划, 请先创建'
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/record/sleep/sleep?plan_id=' + this.plan._id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	width: 100%;
	background-color: #F7FBF9;
	position: relative;
	.bg-img {
		width: 100%;
		border-bottom-left-radius: 20% 6% ;
		border-bottom-right-radius: 20% 6% ;
	}
	.content {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		// height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 38rpx;
		height: 100%;
		overflow-y: auto;
		padding-bottom: 14rpx;
		.user-bar {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom:40rpx;
			.avatar{
				width:80rpx;
				height:80rpx;
				border-radius:50%;
				border: solid 1px #e9e9eb;
			}
			.name {
				font-size: 38rpx;
				margin-left: 14rpx;
			}
		}
		.head {
			margin-bottom: 60rpx;
			.sologn {
				font-size: 56rpx;
				font-weight: bold;
			}
			.day-text {
				font-size: 33rpx;
				margin-top: 12rpx;
			}
		}
		.card-box {
			box-sizing: border-box;
			padding: 24rpx;
			border-radius: 24rpx;
			background-color: #fff;
			margin-bottom: 18rpx;
			width: 100%;
			height: 674rpx;
			box-shadow: 0 0 5px rgba($color: #d8d8d8, $alpha: 0.5);
			.has-plan {
				display: flex;
				flex-direction: column;
				height: 100%;
				.card-head {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 28rpx;
					.title {
						font-size: 37rpx;
					}
					.you {
						border: solid 1px #c7c7c7;
						padding: 2px;
						border-radius: 50%;
					}
				}
				.card-content {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					flex: 1;
					.cont-left {
						width: 50%;
						> .t-item {
							display: inline-flex;
							flex-direction: row;
							padding: 32rpx 0;
							&:not(:last-of-type) {
								border-bottom: solid 1px #e9e9eb;
							}
							.w-icon {
								border-radius: 50%;
								padding: 5px;
								height: 60rpx;
								width: 60rpx;
								display: inline-flex;
								justify-content: center;
								align-items: center;
								&.yundong {
									background-color: #fdf6ec;
								}
								&.chishi {
									background-color: #dbf1e1;
								}
								&.sleep {
									background-color: #ecf5ff;
								}
							}
							.w-title {
								display: inline-flex;
								flex-direction: column;
								margin-left: 5px;
								font-size: 32rpx;
								.title-t {}
								.title-b {
									font-size: 28rpx;
								}
							}
						}
					}
					.cont-right {
						width: 50%;
						position: relative;
						.img {
							width: 100%;
							height: 468rpx;
							transform: scale(0.8);
							position: absolute;
							z-index: 2;
							top: 0;
							left: 19rpx;
						}
						.chart-box {
							width: 100%;
							height: 422rpx;
							position: relative;
							top: -75rpx;
						}
					}
				}
			}

			.no-plan {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: 100%;
				.set-left {
					display: flex;
					flex-direction: column;
					width: 50%;
					box-sizing: border-box;
					align-items: center;
					.text {
						font-size: 32rpx;
						line-height: 1.8;
						width: 80%;
					}
					.btn-box {
						margin-top: 23rpx;
						width: 80%;
					}
					.t-btn {
						background-color: #96dda8;
						color: #fff;
						line-height: 2;
					}
				}
				.set-right {
					width: 50%;
					.ready-man {
						width: 100%;
					}
				}
			}
		}
	}
	.action-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.item {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 18rpx;
			box-sizing: border-box;
			width: 155rpx;
			height: 155rpx;
			background-color: #fff;
			border-radius: 14rpx;
			box-shadow: 0 0 5px rgba($color: #d8d8d8, $alpha: 0.5);
			text {
				font-size: 12px;
				margin-top: 14rpx;
			}
		}
	}
}
</style>
