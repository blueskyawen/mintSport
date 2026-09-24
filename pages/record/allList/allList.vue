<template>
	<mint-bg :isEmpty="!isLoading && !list.length">
		<mescroll-body class="body-content" :bottombar="false" @init="mescrollInit" @down="downCallback" :up="upOptions" @up="upCallback">
			<view class="list-page">
				<view class="item-box" v-for="(item, index) in list" :key="index">
					<view class="item-t" @click.stop="toDetail(item)">
						<view class="left">
							<uni-icons custom-prefix="iconfont" type="icon-fit-fire" color="#ff9900" size="26"></uni-icons>
							<view class="name-date">
								<text class="date">日期: {{ item.date }}</text>
								<text class="name">计划: {{ item.plan_name && item.plan_name[0] ? (item.plan_name[0].name || '-') : '-' }}</text>
							</view>
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
		</mescroll-body>
	</mint-bg>
</template>

<script>
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js';
	import { getTodayStr } from "@/common/util.js";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				isLoading: true,
				list: [],
				heighth: 500,
				upOptions: {
					noMoreSize: 10,
					textNoMore: '没有更多了',
					empty: {
						use: false
					}
				},
				todayStr: ''
			}
		},
		onLoad() {
			this.todayStr = getTodayStr();
			this.heighth = uni.getWindowInfo().windowHeight;
		},
		computed: {
			loginUserId() {
				return this.userInfo ? (this.userInfo._id || '') : '';
			},
			userInfo() {
				return store.userInfo;
			}
		},
		methods: {
			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				try {
					uni.showLoading({
						title: ''
					})
					let res = await this.$cloudApi.getMyAllRecordList({
						pageNum: pageNum,
						pageSize: pageSize,
						user_id: this.loginUserId
					});
					let curPageData = res.data || [];
					curPageData = curPageData.filter(x => x.date !== this.todayStr);
					if(pageNum == 1) this.list = [];
					console.log('curPageData', curPageData)
					this.list = this.list.concat(curPageData);
					this.mescroll.endSuccess(curPageData.length);
					this.isLoading = false;
					uni.hideLoading();
				} catch(err) {
					this.mescroll.endErr()
					this.isLoading = false;
					uni.hideLoading();
				}
			},
			reloadList(){
				this.mescroll.resetUpScroll();
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/record/detail/detail?record_id=' + item._id
				})
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
		padding: 8rpx;
		.item-t {
			width: 100%;
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
				max-width: 80%;
				.name-date {
					display: inline-flex;
					flex-direction: column;
					margin-left: 8rpx;
				}
				.date {
					font-size: 33rpx;
				}
				.name {
					font-size: 28rpx;
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
.body-content {
	width: 100%;
	::v-deep {
		.mescroll-empty {
			align-items: center;
		}
		.downwarp-content {
			align-items: center;
		}
		.mescroll-upwarp > view {
			align-items: center;
		}
	}
}
</style>
