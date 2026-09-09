<template>
	<mint-bg :isEmpty="!isLoading && !list.length">
		<view class="medal-items">
			<view class="item-box" v-for="(item, index) in list" :key="index">
				<view class="item">
					<image class="img" :src="item.medalUrl"></image>
					<text class="name">{{ item.medalName }}</text>
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
		computed: {
			loginUserId() {
				return uniCloud.getCurrentUserInfo() ? uniCloud.getCurrentUserInfo().uid : '';
			}
		},
		onLoad() {
			this.getListData();
		},
		methods: {
			getListData() {
				this.$cloudApi.getAchievementByUserId({
					'user_id': this.loginUserId
				}).then(res2 => {
					this.list = res2.data || [];
				}).finally(e => {
					this.isLoading = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.medal-items {
	width: 100%;
	float: left;
	.item-box {
		width: 248rpx;
		box-sizing: border-box;
		padding: 7rpx;
		float: left;
		.item {
			background-color: #fff;
			border-radius: 24rpx;
			box-sizing: border-box;
			padding: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.img {
				width: 187rpx;
				height: 187rpx;
			}
			.name {
				font-size: 33rpx;
				margin-top: 12rpx;
			}
		}
	}
}
</style>
