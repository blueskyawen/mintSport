const miPlanDB = uniCloud.importObject('mi-plan-co', {
	customUI: true
});
const miRecordDB = uniCloud.importObject('mi-check-record-co', {
	customUI: true
});
const miNoteDB = uniCloud.importObject('mi-note-co', {
	customUI: true
});

export default {
	getPlanList(event) {
		return miPlanDB.getList(event);
	},
	addPlan(data) {
		return miPlanDB.add(data);
	},
	getActivePlan(event) {
		return miPlanDB.getActivePlan(event);
	},
	getPlanById(event) {
		return miPlanDB.get(event);
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
	}

}
