<template>
	<view class="page" :style="{ height: heighth + 'px' }">
		<image class="bg-img" mode="widthFix" src="/static/bg/home.jpg"></image>
		<view class="content">
			<view class="user-bar">
				<view class="user" @click.capture="toUserInfo">
					<image v-if="avatorSrc" :src="avatorSrc" class="avatar"></image>
					<text class="name" v-if="hasLogin">{{ userInfo ? (userInfo.nickname || userInfo.username) : '匿名用户' }}</text>
					<text class="uer-login" v-else>请登录</text>
				</view>
				<view class="right-set">
					<uni-icons type="gear" color="#888888" size="28" @click.capture="toUserSeting"></uni-icons>
				</view>
			</view>
			<view class="data-row">
				<view class="chenhao">Lv.12 习惯实践者</view>
				<view class="text">
					<text>完成计划 1 个</text>
					<text>累计坚持 15 天</text>
				</view>
			</view>
			<view class="card-box">
				<view class="list-item" v-for="item in ucenterList" :key="item.id">
					<view class="item-left">
						<view class="icon-box" :style="{ 'background-color': item.bgColor }">
							<uni-icons custom-prefix="iconfont" :type="item.icon" :color="item.color" size="20"></uni-icons>
						</view>
						<text class="name">{{ item.title }}</text>
					</view>
					<text class="item-right">
						<uni-icons type="right" color="#888888" size="20"></uni-icons>
					</text>
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

export default {
	computed:{
		userInfo() {
			return store.userInfo;
		},
		hasLogin() {
			return store.hasLogin
		},
		nameText() {
			let nameT = this.userInfo ? (this.userInfo.nickname || this.userInfo.username || this.userInfo.mobile) : '无';
			return this.avatorImg ? '' : nameT ? nameT[0] : '';
		}
	},
	data(){
		return {
			avatorSrc: '/static/logo.png',
			avatorUrl: '',
			heighth: 500,
			ucenterList: [
				{
					"id": 1,
					"title": '我的计划',
					"to": '/pages/plan/list/list',
					"icon": "icon-fit-jihua",
					"color": "#ff9900",
					"bgColor": "#fdf6ec"
				},
				{
					"id": 2,
					"title": '成就勋章',
					"to": '/pages/plan/list/list',
					"icon": "icon-fit-jiangpai",
					"color": "#2979ff",
					"bgColor": "#ecf5ff"
				},
				{
					"id": 3,
					"title": '打卡记录',
					"to": '/pages/plan/list/list',
					"icon": "icon-fit-log-t",
					"color": "#ff9900",
					"bgColor": "#fdf6ec"
				},
				{
					"id": 4,
					"title": '我的分享',
					"to": '/pages/plan/list/list',
					"icon": "icon-fit-edit-note",
					"color": "#19be6b",
					"bgColor": "#dbf1e1"
				},
				{
					"id": 5,
					"title": '我的收藏',
					"to": '/pages/plan/list/list',
					"icon": "icon-fit-star-outline",
					"color": "#8f939c",
					"bgColor": "#e9e9eb"
				},
				{
					"id": 6,
					"title": '问题与反馈',
					"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
					"icon": "icon-fit-help",
					"color": "#e43d33",
					"bgColor": "#fad8d6"
				}
			]
		}
	},
	onLoad() {
		this.heighth = uni.getWindowInfo().windowHeight;
	},
	onShow() {
		this.loadData();
		this.getAvatorImg();
	},
	methods:{
		loadData() {},
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
		toUserInfo() {
			uni.navigateTo({
				url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
			})
		},
		toUserSeting() {
			uni.navigateTo({
				url: '/pages/mine/settings/settings'
			})
		},
		goCalendar(){
			uni.navigateTo({url:'/pages/plan/calendar'})
		},
		goMyPost(){
			uni.navigateTo({url:'/pages/mine/myPost'})
		}
	}
}
</script>
<style lang="scss" scoped>
.page {
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
			justify-content: space-between;
			margin-bottom: 23rpx;
			.user {
				display: inline-flex;
				align-items: center;
				.avatar{
					width:100rpx;
					height:100rpx;
					border-radius:50%;
					border: solid 1px #e9e9eb;
				}
				.name {
					font-size: 45rpx;
					margin-left: 14rpx;
				}
			}
		}
		.data-row {
			display: flex;
			flex-direction: column;
			line-height: 2;
			margin-bottom: 46rpx;
			.chenhao {
				font-size: 66rpx;
				font-weight: bolder;
			}
			.text {
				font-size: 33rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
			}
		}
		.card-box {
			box-sizing: border-box;
			padding: 24rpx;
			border-radius: 24rpx;
			background-color: #fff;
			margin-bottom: 18rpx;
			width: 100%;
			//height: 674rpx;
			box-shadow: 0 0 5px rgba($color: #d8d8d8, $alpha: 0.5);
			.list-item {
				display: flex;
				box-sizing: border-box;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 18rpx;
				&:not(:last-of-type) {
					border-bottom: solid 1px #e9e9eb;
				}
				.item-left {
					display: inline-flex;
					align-items: center;
					.icon-box {
						border-radius: 50%;
						height: 60rpx;
						width: 60rpx;
						padding: 5px;
						display: inline-flex;
						justify-content: center;
						align-items: center;
						background-color: red;
					}
					.name {
						font-size: 32rpx;
						margin-left: 8px;
					}
				}
			}
		}
	}
}
</style>
