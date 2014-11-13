/** Ebbe kerül bele az oldalt lévõ menü kostans 2 oszloppal:
* az egyik oszlop rejtett tulajdonságot kap nem debug módban TODO
* 
*/
function interpolationMenulist (aConfig) {
    var that = this;
	var gTable = aConfig.table;
	var gInterpPlot = aConfig.interpolationPlot;
	var gInterpTable = aConfig.interpolationTable;
	var gSaveButton = aConfig.save;
	var gActualData = 1;
    var gCellButtonForm = {
        "type" :  "button",
    };
	var gFirstRowForm = {
        "type" :  "text",
        "disabled": "true"
    };
	gTable.addNewTableOneCell('Interpoláció neve', gFirstRowForm);
	gTable.addNewColumnToTable();
	gTable.setCellForm(0, 1, gFirstRowForm);
	
	gTable.addNewRowToTable();
	gTable.setValue(1, 0, 'Új Interpoláció 1', gCellButtonForm);
	
	gSaveButton.onclick = function () {
		var saveObject = {};
		saveObject.tableData = gInterpTable.getData();
		saveObject.plotSetting = gInterpPlot.getPlotSettings();
		
		var saveJSON = JSON.stringify(saveObject);
		gTable.setValue(gActualData, 1, saveJSON);
	};
	
	gTable.getInputTag(1, 0).onclick = function () {
		gActualData = 1;
	};
	
    return that;
}