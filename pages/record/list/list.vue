<template>
	<mint-bg :isEmpty="!isLoading && !list.length">
		<view class="list-page">
			<view class="item-box" v-for="(item, index) in list" :key="index">
				<view class="item-t">
					<view class="left">
						<uni-icons custom-prefix="iconfont" type="icon-fit-fire" color="#ff9900" size="26"></uni-icons>
						<text class="name">日期: {{ item.date }}</text>
					</view>
					<view class="right">
						<uni-icons v-if="item.date == todayStr" custom-prefix="iconfont" type="icon-fit-runing" color="#ff9900" size="26"></uni-icons>
						<template v-else>
							<text v-if="item.status == 'finish'" class="finish">已完成</text>
							<text v-else class="unfinish">未完成</text>
						</template>
					</view>
				</view>
			</view>
		</view>
	</mint-bg>
</template>

<script>
	import { getTodayStr } from "@/common/util.js";
	export default {
		data() {
			return {
				isLoading: true,
				list: [],
				plan_id: '',
				from: ''
			}
		},
		onLoad(options) {
			this.plan_id = options.id;
			this.from = options.from;
			this.getListData();
		},
		methods: {
			getListData() {
				if (this.plan_id) {
					this.$cloudApi.getPlanRecords({
						plan_id: this.plan_id
					}).then(res => {
						let rescords = res.data || [];
						this.todayStr = getTodayStr();
						if (this.from == 'statistic') {
							rescords = rescords.filter(x => x.date !== this.todayStr);
						}
						this.list = rescords;
					}).finally(e => {
						this.isLoading = false;
					})
				} else {
					this.isLoading = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.list-page {
	width: 100%;
	display: flex;
	flex-direction: column;
	.item-box {
		width: 100%;
		box-sizing: border-box;
		padding: 8rpx 16rpx;
		.item-t {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			box-sizing: border-box;
			padding: 24rpx;
			border-radius: 19rpx;
			.left {
				display: inline-flex;
				flex-direction: row;
				align-items: center;
				.name {
					font-size: 33rpx;
				}
			}
			.right {
				display: inline-flex;
				flex-direction: row;
				align-items: center;
				font-size: 33rpx;
				.finish {
					color:  #42B983;
					margin-left: 14rpx;
				}
				.unfinish {
					color: #FF8866;
					margin-left: 14rpx;
				}
			}
		}
	}
}
</style>
