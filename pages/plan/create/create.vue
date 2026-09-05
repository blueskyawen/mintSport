<template>
	<page-bg :headTitle="headTitle">
		<view class="form-content">
			<view class="from-item">
				<view class="item-title">计划名称</view>
				<view class="item-data">
					<uni-easyinput inputBorder :clearable="false" placeholder="请输入" primaryColor="#72D1A8"
						maxlength="30" v-model.number="form.name"></uni-easyinput>
				</view>
			</view>
			<view class="from-item">
				<view class="item-title">选择周期</view>
				<view class="item-data">
					<view class="options">
						<text class="option" v-for="option in timeOptions" :key="option.value"
							:class="{ active: form.daysType == option.value }" @click="selectDays(option.value)">
							{{ option.title }}
						</text>
					</view>
					<view class="input" v-if="form.daysType === 0">
						<uni-easyinput type="number" inputBorder :clearable="false"
							placeholder="输入天数" primaryColor="#72D1A8" v-model.number="form.totalDay"></uni-easyinput>
					</view>

				</view>
			</view>
			<view class="from-item">
				<view class="item-title">
					<text>运动项目</text>
					<text class="icon">
						<u-icon name="plus-circle" color="#72D1A8" size="20" @click="addSport"></u-icon>
					</text>
				</view>
				<view class="item-data">
					<view class="sport-item" v-for="(item, index) in sportList" :key="index">
						<uni-easyinput inputBorder :clearable="false" placeholder="运动名称" primaryColor="#72D1A8"
							maxlength="10" v-model.number="item.name"></uni-easyinput>
						<uni-easyinput class="time-input" type="number" inputBorder :clearable="false"
							placeholder="时长" primaryColor="#72D1A8" v-model.number="item.time">
						</uni-easyinput>分钟
						<u-icon class="del-icon" name="minus-circle" color="#f29e99" size="20" @click="delSport(index)"></u-icon>
					</view>
				</view>
			</view>
			<view class="from-item">
				<view class="item-title">饮食目标</view>
				<view class="item-data">
					<uni-easyinput type="textarea" autoHeight v-model="form.dietTip" primaryColor="#72D1A8"
						placeholder="例如：清淡少油，多吃蛋白质"></uni-easyinput>
				</view>
			</view>
			<view class="from-item">
				<view class="item-title">作息目标</view>
				<view class="item-data">
					<view class="sleep-item">
						<text class="title">早起时间</text>
						<text v-if="form.getUpTime" class="time"> {{ form.getUpTime }} </text>
						<u-icon class="clock" name="clock" color="#72D1A8" size="18" @click="openSelectTime('getUpTime')"></u-icon>
						<u-datetime-picker :show="showGetUp"
								v-model="form.getUpTime"
								mode="time"
								@confirm="showGetUp = false"
								@cancel="showGetUp = false"
						></u-datetime-picker>
					</view>
					<view class="sleep-item">
						<text class="title">早睡时间</text>
						<text v-if="form.sleepTime" class="time"> {{ form.sleepTime }} </text>
						<u-icon class="clock" name="clock" color="#72D1A8" size="18" @click="openSelectTime('sleepTime')"></u-icon>
						<u-datetime-picker :show="showSleep"
								v-model="form.sleepTime"
								mode="time"
								@confirm="showSleep = false"
								@cancel="showSleep = false"
						></u-datetime-picker>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-box">
			<u-button type="primary" :loading="isLoading" color="#72D1A8" @click="submit">生成专属计划</u-button>
		</view>
	</page-bg>
</template>
<script>
import {
	store
} from '@/uni_modules/uni-id-pages/common/store.js';
export default {
	data(){
		return {
			headTitle: {
				title: '定制我的计划',
				subText: '选择目标, 生成专属每日安排'
			},
			timeOptions: [
				{
					value: 7,
					title: '7天'
				},
				{
					value: 14,
					title: '14天'
				},
				{
					value: 21,
					title: '21天'
				},
				{
					value: 30,
					title: '30天'
				},
				{
					value: 0,
					title: '自定义'
				}
			],
			showGetUp:false,
			showSleep:false,
			form:{
				name: '',
				daysType: 7,
				totalDay: 0,
				customDay:'',
				dietTip:'',
				getUpTime:'',
				sleepTime:''
			},
			sportList:[],
			isLoading: false
		}
	},
	computed: {
		userInfo() {
			return store.userInfo;
		}
	},
	methods:{
		selectDays(v) {
			this.form.daysType = v;
			this.form.totalDay = v;
		},
		addSport(){
			this.sportList.push({ name:'', time: 30 })
		},
		delSport(index){
			this.sportList.splice(index,1)
		},
		openSelectTime(v) {
			if (v == 'getUpTime') {
				this.showGetUp = true;
			} else {
				this.showSleep = true;
			}
		},
		valider() {
			if(!this.form.name){
				uni.showToast({
					title:'请输入计划名称',
					icon:'none'
				})
				return false;
			}
			let dayNum = Number(this.form.totalDay);
			if(!dayNum){
				uni.showToast({
					title:'请选择或输入计划周期',
					icon:'none'
				})
				return false;
			}
			let tmpSports = this.sportList.filter(x => x.name.trim() && x.time);
			if(!tmpSports.length){
				uni.showToast({
					title:'至少填写一项运动项目',
					icon:'none'
				})
				return false;
			}
			let dietTip = this.form.dietTip.trim();
			if(!dietTip){
				uni.showToast({
					title:'请填写饮食目标',
					icon:'none'
				})
				return false;
			}
			if(!this.form.getUpTime || !this.form.sleepTime){
				uni.showToast({
					title:'请设置作息时间',
					icon:'none'
				})
				return false;
			}

			return {
				totalDay: dayNum,
				sportList: tmpSports,
				dietTip: dietTip
			}
		},
		submit () {
			if (this.isLoading) return;
			let result = this.valider();
			if(result) {
				let tempData = {
					...result,
					name: this.form.name,
					user_id: this.userInfo._id,
					getUpTime: this.form.getUpTime,
					sleepTime: this.form.sleepTime,
					status: 'running',
					create_date: Date.now()
				}
				this.isLoading = true;
				this.$cloudApi.addPlan(tempData).then(res => {
					uni.showToast({
						title:'计划创建成功'
					})
					setTimeout(()=> {
						this.isLoading = false;
						uni.navigateBack();
					},1000)
				}).catch(e => {
					this.isLoading = false;
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.form-content {
	background-color: #fff;
	border-radius: 14rpx;
	padding: 14rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.from-item {
		display: flex;
		flex-direction: column;
		margin-bottom: 42rpx;
		.item-title {
			font-size: 38rpx;
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			line-height: 1;
			.icon {
				margin-left: 14rpx;
			}
		}
		.item-data {
			box-sizing: border-box;
			width: 100%;
			padding: 0 18rpx ;
			.input {
				width: 100%;
				margin-top: 14rpx;
			}
			.sport-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				.time-input {
					margin: 0 3px;
				}
				.del-icon {
					margin-left: 3px;
				}
				&:not(:last-of-type) {
					margin-bottom: 9rpx;
				}
			}
			.sleep-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				line-height: 2;
				.title {
					font-size: 33rpx;
				}
				.time {
					font-size: 32rpx;
					margin-left: 18rpx;
				}
				.clock {
					margin-left: 18rpx;
				}
			}
			.options {
				display: flex;
				flex-direction: row;
				align-items: center;
				.option {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 98rpx;
					height: 98rpx;
					border: solid 1px #e9e9eb;
					border-radius: 50%;
					&:not(:last-of-type) {
						margin-right: 16rpx;
					}
					&.active {
						background-color: $main-color;
						border-color: $main-color;
						color: #fff;
					}
				}
			}
		}
	}
}
.submit-box {
	margin: 37rpx 0;
}


</style>
