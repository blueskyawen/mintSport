<template>
	<view class="note-view">
		<view class="item" v-if="item">
			<view class="note-img">
				<image class="img-show" mode="widthFix" :src="item.cover_src"></image>
			</view>
			<view class="note-title">{{ item.content }}</view>
			<view class="note-date">
				<view class="date-left">
					 <view class="note-autor" @click="tapAutor">
						{{ item.user_id && item.user_id.length ?  (item.user_id[0].nickname || item.user_id[0].username) : '游客'}}
					 </view>
				 </view>
				 <view class="date-right">
					 <view class="left-action">
						 <u-icon v-if="!isLike" class="a-icon" name="heart" color="#888888" size="20" @click="doLike"></u-icon>
						 <u-icon v-else class="a-icon" name="heart-fill" color="#f3a73f" size="20" @click="doLike"></u-icon>
					 </view>
					 <!-- #ifdef MP -->
					 <button style="border: none" type="default" size="mini" hover-class="none" plain open-type="share">
					 	<u-icon name="share" color="#909399" size="20"></u-icon>
					 </button>
					 <!-- #endif -->
				 </view>
			</view>
		</view>
		<u-empty v-if="!item && !isLoading"></u-empty>
	</view>
</template>

<script>
	import parseImageUrl from "@/common/parseImageUrl.js"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js';
	export default {
		data() {
			return {
				id: '',
				item: null,
				isLoading: true,
				isLike: false,
				myLikeNotes: [],
				isInOper: false,
				from: '',
				saveOldFlag: {
					like: false
				}
			}
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
		},
		onLoad(options) {
			this.id = options.id;
			this.from = options.from;
			if (this.id) {
				this.getData();
			}
		},
		onUnload() {
			this.checkIfUpdate();
		},
		onShareAppMessage(e) {
			if (e.from === 'button') {
			  console.log(e.target)
			}
			return {
				title: this.item.content,
				path: `/pages/community/detail/detail?id=${this.id}`,
				desc: "每日分享",
				imageUrl: this.item.cover_src || 'https://web-assets.dcloud.net.cn/unidoc/zh/share-logo@3.png'
			}
		},
		methods: {
			async getData() {
				this.isLoading = true;
				uni.showLoading();
				if (this.userInfo._id) {
					let likeRes = await this.$cloudApi.getNoteLikesByUser({
						"id": this.userInfo._id
					});
					this.myLikeNotes = likeRes.data.length ? likeRes.data.map(x => x.note_id) : [];
				}
				let res = await this.$cloudApi.getOneNote({ id: this.id })
				let temps = res.data || [];
				if (temps.length) {
					let images = temps.map(x => x.cover);
					let resImgs = await parseImageUrl(images);
					temps.forEach(x => {
						let img = resImgs.find(y => y.source == x.cover)
						if (img) {
							x.cover_src = img.src;
						}
					});
					this.item = temps[0];
					this.isLike = this.myLikeNotes.includes(temps[0]._id);
					this.saveOldFlag.like = this.isLike;
					this.isLoading = false;
					uni.hideLoading();
				}
			},
			checkIfUpdate() {
				if (this.from == 'likes' && this.saveOldFlag.like !== this.isLike) {
					uni.$emit('refresh-like-list',{});
				}
			},
			doLike() {
				if (this.isInOper) return;
				if (!this.hasLogin) {
					uni.showToast({
						title: "请先登录",
						icon: "none"
					});
					return;
				}
				let likeFlag = !this.isLike;
				this.isInOper = true;
				if (likeFlag) {
					this.$cloudApi.addNoteLike({
						"note_id": this.item._id,
						"user_id": this.userInfo._id,
						"create_date": Date.now()
					}).then(res => {
						this.myLikeNotes.push(res.id);
						this.isLike = likeFlag;
						this.$cloudApi.incNoteLikeCount({
							id: this.item._id,
							value: 1
						}).then(res1 => {});
						uni.showToast({
							title: "收藏成功",
							icon: "none"
						});
					}).finally(res => {
						this.isInOper = false
					})
				} else {
					this.$cloudApi.delNoteLike({
						"note_id": this.item._id,
						"user_id": this.userInfo._id,
					}).then(res => {
						if (res.status == 0) {
							let fdIndex = this.myLikeNotes.findIndex(x => x.note_id == this.item._id);
							if (fdIndex !== -1) {
								this.myLikeNotes.splice(fdIndex, 1);
							}
							this.isLike = likeFlag;
							this.$cloudApi.incNoteLikeCount({
								id: this.item._id,
								value: -1
							}).then(res1 => {});
							uni.showToast({
								title: "取消收藏",
								icon: "none"
							});
						}
					}).finally(res => {
						this.isInOper = false;
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.note-view {
	//background-color: #fff;
	padding-bottom: 38rpx;
	.item {
		.note-img {
			.img-show {
				width: 100%;
				min-height: 562rpx;
				height: inherit;
			}
		}
		.note-title {
			padding: 59rpx;
			box-sizing: border-box;
			line-height: 1.6em;
			white-space: pre-wrap;
			font-size: 28rpx;
		}
		.note-date {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 28rpx 24rpx;
			box-sizing: border-box;
			font-size: 33rpx;
			.date-left {
				display: inline-flex;
				flex-direction: column;
				.note-autor {
					display: inline-flex;
					flex-direction: row;
					align-items: center;
				}
				.publish-date {
					color: #8f939c;
					margin-top: 7rpx;
				}
			}
			.date-right {
				display: inline-flex;
				flex-direction: row;
				align-items: center;
				.left-action {
					display: inline-flex;
					flex-direction: row;
					align-items: center;
					::v-deep .u-icon {
						margin-left: 38rpx;
					}
				}
			}
		}
	}
}
</style>
