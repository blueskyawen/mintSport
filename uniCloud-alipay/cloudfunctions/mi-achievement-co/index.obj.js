const db = uniCloud.database()
const miAchieveModelCollection = db.collection('achieve-medal');
const miUserAchieveCollection = db.collection('user-achievement');
module.exports = {
	_before: function () { // 通用预处理器

	},
	getModelList: async function({type}) {
		const res = await miAchieveModelCollection.where({
			'type': type
		}).get();
		return res;
	},
	addAchievement: async function(event) {
		let addData = {
			...event
		}
		const res = await miUserAchieveCollection.add(addData)
		return res;
	},
	getAchievement: async function(event) {
		const res = await miUserAchieveCollection.where({
			"user_id": event.user_id,
			"medalName": event.medalName
		}).get();
		return res;
	},
	getMyAchievements: async function(event) {
		const res = await miUserAchieveCollection.where({
			"user_id": event.user_id
		}).orderBy('create_date','desc').get();
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
