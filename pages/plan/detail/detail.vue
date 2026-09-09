<template>
	<mint-bg :isEmpty="!isLoading && !plan._id">
		<view class="detail-page">
			<view class="head">
				{{ plan.name }}
			</view>
			<view class="content">
				<view class="status">
					<text class="title">计划状态: </text>
					<text>
						<uni-icons custom-prefix="iconfont" v-if="plan.status == 'running'" type="icon-fit-runing" color="#ff9900" size="28"></uni-icons>
						<uni-icons custom-prefix="iconfont" v-else-if="plan.status == 'finish'" type="icon-fit-finished" color="#72D1A8" size="28"></uni-icons>
						<uni-icons custom-prefix="iconfont" v-else type="icon-fit-uncomplate" color="#888888" size="28"></uni-icons>
					</text>
				</view>
				<view class="overview">
					<view class="item total-day">
						<text>计划周期</text>
						<text class="num">{{ plan.totalDay }} 天</text>
					</view>
					<view class="item start-date">
						<text>开始时间</text>
						<text class="num">{{ startDate }}</text>
					</view>
					<view class="item end-date">
						<text>结束时间</text>
						<text class="num">{{ endDate }}</text>
					</view>
				</view>
				<view class="rate-view">
					<view class="record-rate">
						<view class="item count">
							<text>累计打卡</text>
							<text class="sub">{{ plan.recordDay }} 天</text>
						</view>
						<view class="item rate">
							<view class="item">
								<text>打卡率</text>
								<text class="sub">{{ recordRate }}</text>
							</view>
						</view>
					</view>
					<view class="record-rate finish">
						<view class="item count">
							<text>完成打卡</text>
							<text class="sub">{{ plan.recordFinishDay }} 天</text>
						</view>
						<view class="item rate">
							<view class="item">
								<text>完成率</text>
								<text class="sub">{{ finishRecordRate }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="record-rili">
					<view class="head">
						<text class="name">打卡日历</text>
						<text class="oper" @click.stop="toRecordList">更多打卡记录</text>
					</view>
					<view class="rili">
						<uni-calendar
						:insert="true"
						:lunar="true"
						:start-date="startDate"
						:end-date="finishDate"
						:selected="selectedInfos"
						></uni-calendar>
					</view>
				</view>
			</view>
		</view>
	</mint-bg>
</template>
<script>
import { getFullDateStr } from "@/common/util.js";
export default {
	data(){
		return {
			isLoading: true,
			plan: {},
			plan_id: '',
			recordList: [],
			startDate: '',
			endDate: '',
			finishDate: '',
			recordRate: '',
			finishRecordRate: '',
			selectedInfos: []
		}
	},
	onLoad(options){
		this.plan_id = options.id;
		this.getPlanData();
	},
	computed:{
		loginUserId() {
			return uniCloud.getCurrentUserInfo() ? uniCloud.getCurrentUserInfo().uid : '';
		}
	},
	methods: {
		getPlanData() {
			if (this.plan_id) {
				this.$cloudApi.getPlanById({
					id: this.plan_id
				}).then(res => {
					this.plan = res.data[0] || {};
					let startDateTime = new Date(this.plan.create_date);
					this.startDate = getFullDateStr(startDateTime);
					this.endDate = this.plan.end_date ? getFullDateStr(new Date(this.plan.end_date)) : '-';
					this.recordRate = this.plan.recordDay ? ((this.plan.recordDay*100/this.plan.totalDay).toFixed(1) + '%') : '0%';
					this.finishRecordRate = this.plan.recordFinishDay ? ((this.plan.recordFinishDay*100/this.plan.totalDay).toFixed(1) + '%') : '0%';
					this.getCalendarSelectInfos();
				}).finally(e => {
					this.isLoading = false;
				})
			} else {
				this.isLoading = false;
			}
		},
		getCalendarSelectInfos() {
			let startDateTime = new Date(this.plan.create_date);
			let tmpDay = new Date(this.plan.create_date);
			tmpDay.setDate(startDateTime.getDate() + this.plan.totalDay - 1);
			this.finishDate = getFullDateStr(tmpDay);
			this.$cloudApi.getPlanRecords({
				"plan_id": this.plan_id
			}).then(res => {
				let resords = res.data || [];
				for (let i = 0; i < this.plan.totalDay; i++) {
					let curDay = new Date(this.plan.create_date);
					curDay.setDate(startDateTime.getDate() + i);
					let curDateStr = getFullDateStr(curDay);
					let fdItem = resords.find(x => x.date == curDateStr);
					if (fdItem) {
						if (fdItem.status == 'finish') {
							this.selectedInfos.push({
								date: curDateStr,
								info: '已完成',
								fontSize: '28rpx',
								color: '#42B983'
							})
						} else {
							this.selectedInfos.push({
								date: curDateStr,
								info: '未完成',
								fontSize: '28rpx',
								color: '#e43d33'
							})
						}
					} else {
						this.selectedInfos.push({
							date: curDateStr,
							info: '未打卡',
							fontSize: '28rpx',
							color: '#7f7f7f'
						})
					}
				}
				console.log('this.selectedInfos', this.selectedInfos)
			})
		},
		toRecordList() {
			uni.navigateTo({
				url: '/pages/record/list/list?id=' + this.plan_id
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.detail-page {
	display: flex;
	width: 100%;
	flex-direction: column;
	width: 100%;
	padding: 33rpx;
	box-sizing: border-box;
	.head {
		font-size: 47rpx;
		font-weight: bold;
		margin-bottom: 33rpx;
	}
	.content {
		display: flex;
		width: 100%;
		flex-direction: column;
		.status {
			display: flex;
			font-size: 38rpx;
			flex-direction: row;
			align-items: center;
			padding: 19rpx 0 28rpx;
			.title {
				margin-right: 14rpx;
			}
		}
		.overview {
			width: 100%;
			background-color: #fff;
			padding: 24rpx 0px;
			border-radius: 19rpx;
			box-sizing: border-box;
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.item {
				display: inline-flex;
				flex-direction: column;
				align-items: center;
				width: 33%;
				font-size: 31rpx;
				position: relative;
				color: #888;
				.num {
					margin-top: 14rpx;
					color: #696869;
				}
				&:not(:last-of-type)::after {
					position: absolute;
					content: '';
					right: 0;
					width: 1px;
					background-color: #c5c5c5;
					height: 47rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.rate-view {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			.record-rate {
				background-color: #fff;
				width: 338rpx;
				border-radius: 19rpx;
				padding: 28rpx 24rpx;
				box-sizing: border-box;
				.item {
					width: 143rpx;
					display: inline-flex;
					flex-direction: column;
					align-items: center;
					font-size: 31rpx;
					position: relative;
					color: #888;
					.sub {
						margin-top: 14rpx;
						color: #696869;
					}
					&:not(:last-of-type)::after {
						position: absolute;
						content: '';
						right: 0;
						width: 1px;
						background-color: #c5c5c5;
						height: 33rpx;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}
		.record-rili {
			display: flex;
			flex-direction: column;
			width: 100%;
			background-color: #fff;
			margin-top: 28rpx;
			border-radius: 19rpx 19rpx 0 0;
			font-weight: normal;
			box-sizing: border-box;
			padding: 19rpx;
			.head {
				margin-bottom: 19rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				.name {
					font-size: 33rpx;
					color: #888;
				}
				.oper {
					color: #72D1A8;
					font-size: 28rpx;
					margin-left: 19rpx;
				}
			}
			.rili {
				box-sizing: border-box;
				width: 100%;
				::v-deep .uni-calendar-item__weeks-box-item {
					width: auto;
				}
			}
		}
	}
}
</style>
