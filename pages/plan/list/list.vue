<template>
	<mint-bg :isEmpty="!isLoading && !list.length">
		<view class="plan-items">
			<view class="plan-item-box" v-for="(plan, index) in list" :key="index" >
				<view class="plan-item" @click="toDetail(plan)">
					<view class="left">
						<view class="head">
							<uni-icons custom-prefix="iconfont" type="icon-fit-add-jihua" color="#ff9900" size="18"></uni-icons>
							<text class="name">{{ plan.name }}</text>
						</view>
						<view class="foot">
							<view class="text-i">
								<text class="text-1">开始时间:</text>
								<u--text mode="date" :text="plan.create_date" color="#888" size="12px"></u--text>
							</view>
							<view class="text-i t-day">
								<text>计划周期: {{ plan.totalDay }} 天</text>
								<text class="text-2">已打卡: {{ plan.recordDay }} 天</text>
							</view>
						</view>
					</view>
					<view class="right">
						<uni-icons custom-prefix="iconfont" v-if="plan.status == 'running'" type="icon-fit-runing" color="#ff9900" size="28"></uni-icons>
						<uni-icons custom-prefix="iconfont" v-else-if="plan.status == 'finish'" type="icon-fit-finished" color="#72D1A8" size="28"></uni-icons>
						<uni-icons custom-prefix="iconfont" v-else type="icon-fit-uncomplate" color="#888888" size="28"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</mint-bg>
</template>

<script>
	export default {
		data() {
			return {
				isLoading: true,
				list: []
			}
		},
		onLoad() {
				this.getListData();
		},
		computed: {
			loginUserId() {
				return uniCloud.getCurrentUserInfo() ? uniCloud.getCurrentUserInfo().uid : '';
			}
		},
		methods: {
			getListData() {
				if (this.loginUserId) {
					this.$cloudApi.getPlanList({
						user_id: this.loginUserId
					}).then(res => {
						this.list = res.data || [];
					})
					this.isLoading = false;
				} else {
					this.isLoading = false;
				}
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/plan/detail/detail?id=' + item._id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.plan-items {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.plan-item-box {
	width: 100%;
	padding: 2px 4px;
	box-sizing: border-box;
}
.plan-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 10px 8px;
	box-sizing: border-box;
	border-radius: 8px;
	background-color: #fff;
	.left {
		display: inline-flex;
		flex-direction: column;
		.head {
			display: inline-flex;
			flex-direction: row;
			align-items: center;
			.name {
				margin-left: 6px;
				font-size: 14px;
			}
		}
		.foot {
			display: inline-flex;
			flex-direction: column;
			padding-left: 24px;
			font-size: 12px;
			margin-top: 6px;
			.text-i {
				display: inline-flex;
				flex-direction: row;
				align-items: center;
				font-size: 12px;
				color: #888;
				line-height: 1.1;
				.text-1 {
					margin-right: 6px;
				}
				.text-2 {
					margin-left: 12px;
				}
				&.t-day {
					margin-top: 3px;
				}
			}
		}
	}
	.right {}
}
</style>
