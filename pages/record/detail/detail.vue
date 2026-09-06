<template>
	<page-bg :headTitle="headTitle">
		<view class="form-content">

		</view>
	</page-bg>
</template>

<script>
	const weekMap = ['日','一','二','三','四','五','六']
	export default {
		data() {
			return {
				headTitle: {
					title: '',
					subText: ''
				},
				plan_id:'',
				recordData: {}
			}
		},
		onLoad(options) {
			this.plan_id = options.plan_id;
			this.getRecordData();
		},
		methods: {
			async getRecordData() {
				let planRes = await this.$cloudApi.getPlanById({
					id: this.plan_id
				});
				let plan = planRes.data[0];
				this.headTitle.title = plan.name;
				let now = new Date();
				let planCreateTime = new Date(plan.create_date);
				let planStart = planCreateTime.toJSON().split('T').shift() + ' 00:00:00'
				let planStartTime = new Date(planStart).valueOf();
				let num = Math.ceil((now.valueOf() - planCreateTime) / 86400000)
				this.headTitle.subText = '今天周' + weekMap[now.getDay()] + ' · ' + '第 ' + num + ' 天';
				let todayStr = getTodayStr();
				let res = await this.$cloudApi.getDayRecord({
					plan_id: this.plan_id,
					date: todayStr
				});
				this.recordData = res.data[0] || {};
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
}
</style>
