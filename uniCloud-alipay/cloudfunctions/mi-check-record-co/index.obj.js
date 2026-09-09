// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
const miRecordCollection = db.collection('check-record')
module.exports = {
	_before: function () { // 通用预处理器

	},
	get: async function({id}) {
		const res = await miRecordCollection.doc(id).get();
		return res;
	},
	getList: async function({user_id}) {
		const res = await miRecordCollection.where({
			'user_id': user_id
		}).orderBy('date','desc').get();
		return res;
	},
	getPlanRecords: async function(event) {
		const res = await miRecordCollection.where({
			'plan_id': event.plan_id
		}).orderBy('date','desc').get();
		return res;
	},
	getDayRecord: async function(event) {
		const res = await miRecordCollection.where({
			'plan_id': event.plan_id,
			'date': event.date
		}).get();
		return res;
	},
	addDayRecord: async function(event) {
		let addData = {...event}
		let res = await miRecordCollection.add(addData)
		return res;
	},
	delRecordsByPlanId: async function(event) {
		let res = await miRecordCollection.where({
			'plan_id': event.plan_id
		}).remove()
		if (res.deleted === 1) {
			return {
				status: 0,
				msg: '成功删除'
			}
		} else {
			return {
				status: -2,
				msg: '删除数据失败'
			}
		}
	},
	saveCheckRecord: async function(event) {
		let addData = event.data;
		const res = await miRecordCollection.doc(event.id).update(addData);
		return res;
	},

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
