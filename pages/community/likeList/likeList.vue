<template>
	<mint-bg :isEmpty="!isLoading && !list.length">
		<view class="note-list-left">
			 <view class="note-item-box" v-for="(item, index) in listLeft" :key="index">
				 <view class="note-item" @tap="goDetail(item)">
					 <view class="note-img">
						 <image mode="widthFix" :src="item.cover_src"></image>
					 </view>
					 <view class="bottom">
						 <view class="note-title">{{ item.content }}</view>
						 <view class="note-date">
							 <uni-icons type="heart-filled" size="17" color="#f3a73f"></uni-icons>
							 <text class="like-num">{{ item.like_count }}</text>
						 </view>
					 </view>
				 </view>
			 </view>
		</view>
		<view class="note-list-left">
			 <view class="note-item-box" v-for="(item2, index) in listRight" :key="index">
				 <view class="note-item" @tap="goDetail(item2)">
					 <view class="note-img">
						 <image mode="widthFix" :src="item2.cover_src"></image>
					 </view>
					 <view class="bottom">
						 <view class="note-title">{{ item2.content }}</view>
						 <view class="note-date">
							 <uni-icons type="heart-filled" size="17" color="#f3a73f"></uni-icons>
							 <text class="like-num">{{ item2.like_count }}</text>
						 </view>
					 </view>
				 </view>
			 </view>
		</view>
	</mint-bg>
</template>

<script>
	import parseImageUrl from "@/common/parseImageUrl.js";
	export default {
		data() {
			return {
				list: [],
				isLoading: true,
				myLikeNotes: []
			}
		},
		computed: {
			loginUserId() {
				return uniCloud.getCurrentUserInfo() ? uniCloud.getCurrentUserInfo().uid : '';
			},
			listLeft() {
				return this.list.filter((x, index) => index % 2 == 0)
			},
			listRight() {
				return this.list.filter((x, index) => index % 2 !== 0)
			},
		},
		onLoad() {
			this.getListData();
			uni.$on('refresh-like-list', this.getListData);
		},
		onUnload() {
			uni.$off('refresh-like-list')
		},
		methods: {
			async getListData() {
				try {
					let likeRes = await this.$cloudApi.getNoteLikesByUser({
						"id": this.loginUserId
					})
					this.myLikeNotes = likeRes.data.length ? likeRes.data.map(x => x.note_id) : [];
					let res = await this.$cloudApi.getLikeNoteList({
						noteIds: this.myLikeNotes
					});
					let notes = res.data || [];
					let images = notes.map(x => x.cover);
					let resImgs = await parseImageUrl(images);
					notes.forEach(x => {
						let img = resImgs.find(y => y.source == x.cover)
						if (img) {
							x.cover_src = img.src;
						}
					});
					this.list = notes;
					console.log(notes)
					this.isLoading = false;
				} catch(e) {
					this.isLoading = false;
				}
			},
			goDetail(item) {
				uni.navigateTo({
					url: '/pages/community/detail/detail?id=' + item._id + '&from=likes'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.note-list-left {
	width: 50%;
}
.note-item-box {
	background: #fff;
	box-shadow: 0 0 5px rgba($color: #8f939c, $alpha: 0.5);
	margin: 12rpx;
	box-sizing: border-box;
	border-radius: 19rpx;
	.note-item {
		.note-img {
			image {
				width: 100%;
				// height: 180px;
				border-radius: 19rpx 19rpx 0 0;
			}
		}
		.bottom {
			position: relative;
			top: -14rpx;
			border-radius: 14rpx;
			background: #fff;
		}
		.note-title {
			margin: 28rpx;
			box-sizing: border-box;
			line-height: 1.5;
			  display: -webkit-box;
			  -webkit-line-clamp: 3;    /* 限制显示行数 */
			  -webkit-box-orient: vertical;
			  overflow: hidden;
			  font-size: 28rpx;
		}
		.note-date {
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 26rpx;
			box-sizing: border-box;
			padding: 0 28rpx 14rpx;r
			.like-num {
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		}
	}
}

</style>
