<template>
	<page-bg :headTitle="headTitle">
		<view class="form-content">
			<view class="form-item">
				<view class="item-title">
					<uni-icons custom-prefix="iconfont" type="icon-fit-food" color="#ff9900" size="22"></uni-icons>
					<text class="text">饮食描述</text>
				</view>
				<view class="item-data">
					<uni-easyinput type="textarea" autoHeight v-model="recordData.diet" primaryColor="#72D1A8"
						placeholder="例如：早餐吃了鸡蛋和牛奶"></uni-easyinput>
				</view>
			</view>
			<view class="form-item">
				<view class="item-title">
					<uni-icons custom-prefix="iconfont" type="icon-fit-camera-outline" color="#ff9900" size="22"></uni-icons>
					<text class="text">美食实拍(最多3张)</text>
				</view>
				<view class="item-data">
					<uni-file-picker ref="fileUp" file-mediatype="image" file-extname="jpg,png"
						mode="grid" :limit="3" :auto-upload="false"
						v-model="imageList" :image-styles="imageStyles" dir="plan-records/">
					</uni-file-picker>
				</view>
			</view>
		</view>
		<view class="submit-box">
			<u-button type="primary" :loading="isLoading" color="#72D1A8" @click="submit">提交</u-button>
		</view>
		<record-success-popup :show="showPop" @close-pop="closePop"></record-success-popup>
	</page-bg>
</template>
<script>
import { getTodayStr } from "@/common/util.js";
import {
	store
} from '@/uni_modules/uni-id-pages/common/store.js';
export default {
	data(){
		return {
			headTitle: {
				title: '记录饮食',
				subText: '记录今天的餐食, 让营养更清楚!'
			},
			plan_id:'',
			recordData: {
				diet: '',
				dietImgs: []
			},
			imageList: [],
			imageStyles:{
				width:90,
				height:90
			},
			isLoading: false,
			record_id:'',
			showPop: false,
			oldData: {},
			newDeitImages: []
		}
	},
	onLoad(options) {
		this.plan_id = options.plan_id;
		this.getRecordData();
	},
	computed: {
		userInfo() {
			return store.userInfo;
		}
	},
	methods: {
		async getRecordData() {
			let todayStr = getTodayStr();
			let res = await this.$cloudApi.getDayRecord({
				plan_id: this.plan_id,
				date: todayStr
			});
			if (res.data.length) {
				this.recordData.diet = res.data[0].diet;
				this.recordData.dietImgs = res.data[0].dietImgs;
				this.record_id = res.data[0]._id;
				this.oldData = JSON.parse(JSON.stringify(this.recordData));
				this.imageList = res.data[0].dietImgs.length ? JSON.parse(JSON.stringify(res.data[0].dietImgs)) : []
				console.log('recordData', this.recordData)
			} else {
				let planRes = await this.$cloudApi.getPlanById({
					id: this.plan_id
				});
				if (planRes.data.length) {
					let res1 = await this.$cloudApi.addDayRecord({
						"plan_id": this.plan_id,
						"date": todayStr,
						"sportFinishList": sportCheckList,
						"diet": "",
						"dietImgs": [],
						"getUpTime": '',
						"sleepTime": '',
						"planGetUpTime": planRes.data[0].getUpTime,
						"planSleepTime": planRes.data[0].sleepTime,
						"status": 'running',
						"create_date": Date.now()
					});
					this.record_id = res1.id;
					this.oldData = JSON.parse(JSON.stringify(this.recordData));
				}
			}
		},
		closePop() {
			this.showPop = false;
			setTimeout(() => {
				uni.navigateBack();
			}, 300)
		},
		isImgChange() {
			let files = []
			if (this.$refs.fileUp) {
				files = this.$refs.fileUp.files;
			}
			let oldImageList = this.oldData.dietImgs;
			if (oldImageList.length !== files.length) {
				this.newDeitImages = oldImageList.filter(x => files.find(y => x.url == y.fileID));
				return true;
			} else {
				let images = oldImageList.filter(x => files.find(y => x.url == y.fileID));
				if (images.length !== oldImageList.length) {
					this.newDeitImages = images;
					return true;
				} else {
					return false;
				}
			}
		},
		isModify() {
			return  (this.recordData.diet !== this.oldData.diet) || this.isImgChange();
		},
		submit() {
			if (this.isLoading) return;
			if (!this.recordData.diet) {
				uni.showToast({
					title: '请填写描述内容'
				})
				return;
			}
			let isImgChanged = this.isImgChange();
			if ((this.recordData.diet !== this.oldData.diet) || isImgChanged) {
				if (isImgChanged) {
					console.log('isImgChanged', this.newDeitImages)
					console.log('files', this.$refs.fileUp.files)
					let readyUploadFiles = this.$refs.fileUp.files ? this.$refs.fileUp.files.filter(x => x.status === 'ready' || x.status === 'error') : [];
					console.log('readrUploadFiles', readyUploadFiles)
					if (readyUploadFiles.length) {
						this.$refs.fileUp.upload().then(res => {
							let tmps = res || [];
							console.log('tmps', tmps)
							tmps.forEach(x => {
								this.newDeitImages.push({
									name: x.name,
									extname: x.extname,
									url: x.url
								})
							})
							let addData = {...this.recordData};
							addData.dietImgs = this.newDeitImages.map(x => {
													return {
														name: x.name,
														extname: x.extname,
														url: x.url
													}
												});
							console.log('addData', addData)
							this.doSubmitForm(addData);
						}).catch(e => {
							this.isLoading = false;
						})
					} else {
						console.log('image ---', this.imageList)
						let addData = {...this.recordData};
						addData.dietImgs = this.newDeitImages.map(x => {
											return {
												name: x.name,
												extname: x.extname,
												url: x.url
											}
										});
						this.isLoading = true;
						this.doSubmitForm(addData);
					}
				} else {
					console.log('nochange===', this.imageList)
					console.log('files', this.$refs.fileUp.files)
					let addData = {...this.recordData};
					this.isLoading = true;
					this.doSubmitForm(addData);
				}
			} else {
				this.isLoading = false;
				uni.navigateBack();
				return;
			}
		},
		doSubmitForm(addData) {
			this.$cloudApi.saveCheckRecord({
				id: this.record_id,
				data: addData
			}).then(res => {
				this.showPop = true;
				this.checkDelCloudFiles(addData).then(res => {});
			}).catch(e => {
				uni.showToast({
					title: e.msg || e.message || JSON.stringify(e)
				})
			}).finally(e => {
				this.isLoading = false;
			})
		},
		async checkDelCloudFiles(addData) {
			let delFiles = this.oldData.dietImgs.filter(x => !addData.dietImgs.find(y => y.url == x.url));
			if (delFiles.length) {
				console.log('delCloudFile', delFiles)
				try {
					let res = await this.$cloudApi.delCloudFiles({
						files: delFiles.map(t => t.url)
					})
					return res;
				} catch(e) {
					return { status: 0 };
				}
			} else {
				return { status: 0 };
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.form-content {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 16rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	margin-top: 60rpx;
	min-height: 200px;
	.form-item {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 6px 0;
		.item-title {
			display: flex;
			flex-direction: row;
			align-items: center;
			.text {
				font-size: 16px;
				margin-left: 6px;
			}
		}
		.item-data {
			margin-top: 8px;
		}
	}
}
.submit-box {
	margin: 37rpx 0;
}
</style>
