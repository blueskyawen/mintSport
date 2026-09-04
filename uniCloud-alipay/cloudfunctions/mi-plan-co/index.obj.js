// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
const cmiPlanCollection = db.collection('plan')
const userDBName = 'uni-id-users'
module.exports = {
	_before: function () { // 通用预处理器

	},
	get: async function({id}) {
		const res = await cmiPlanCollection.where({
			'_id': id
		}).get();
		return res;
	},
	getList: async function({user_id}) {
		const res = await cmiPlanCollection.where({
			'user_id': user_id
		}).get();
		return res;
	},
	add: async function(event) {
		let addData = {
			...event
		}
		// 将旧进行中的计划改为已完成
		await cmiPlanCollection.where({
					user_id: event.user_id,
					status: 'running'
				}).update({ status: 'finish' })
		// 新增新计划
		const res = await cmiPlanCollection.add(addData)
		return res;
	},
	getActivePlan: async function(event) {
		const res = await cmiPlanCollection.where({
			user_id: event.user_id,
			status: 'running'
		}).orderBy('create_date desc').get();
		return res;
	}
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/*
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑

		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
}
