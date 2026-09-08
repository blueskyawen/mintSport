const miPlanDB = uniCloud.importObject('mi-plan-co', {
	customUI: true
});
const miRecordDB = uniCloud.importObject('mi-check-record-co', {
	customUI: true
});
const miNoteDB = uniCloud.importObject('mi-note-co', {
	customUI: true
});
const miUserDB = uniCloud.importObject('mi-user-co', {
	customUI: true
});
const noteLikeDB = uniCloud.importObject('note-like-co', {
	customUI: true
});

export default {
	getPlanList(event) {
		return miPlanDB.getList(event);
	},
	addPlan(data) {
		return miPlanDB.add(data);
	},
	updatePlan(data, id) {
		return miPlanDB.update(data, id);
	},
	getActivePlan(event) {
		return miPlanDB.getActivePlan(event);
	},
	getPlanById(event) {
		return miPlanDB.get(event);
	},
	incFinishRecordCount(event) {
		return miPlanDB.incFinishRecordCount(event);
	},
	addDayRecord(event) {
		return miRecordDB.addDayRecord(event);
	},
	getDayRecord(event) {
		return miRecordDB.getDayRecord(event);
	},
	getPlanRecords(event) {
		return miRecordDB.getPlanRecords(event);
	},
	saveCheckRecord(event) {
		return miRecordDB.saveCheckRecord(event);
	},
	delCloudFiles(event) {
		return miUserDB.delCoverFiles(event);
	},
	getNoteList(event) {
		return miNoteDB.getList(event);
	},
	getMyNoteList(event) {
		return miNoteDB.getMyNoteList(event);
	},
	getLikeNoteList(event) {
		return miNoteDB.getLikeNoteList(event);
	},
	addNote(event) {
		return miNoteDB.add(event);
	},
	getNoteById(event) {
		return miNoteDB.get(event);
	},
	getOneNote(event) {
		return miNoteDB.getOne(event);
	},
	delNote(event) {
		return miNoteDB.delete(event);
	},
	updateNote(event, id) {
		return miNoteDB.update(event, id);
	},
	incNoteLikeCount(event) {
		return miNoteDB.incLikeCount(event);
	},
	getNoteLikesByUser(event) {
		return noteLikeDB.getList(event);
	},
	addNoteLike(event) {
		return noteLikeDB.add(event);
	},
	delNoteLike(event) {
		return noteLikeDB.delete(event);
	},

}
