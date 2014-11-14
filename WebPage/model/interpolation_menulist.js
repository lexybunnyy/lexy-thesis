/** Ebbe kerül bele az oldalt lévõ menü kostans 2 oszloppal:
* az egyik oszlop rejtett tulajdonságot kap nem debug módban TODO
* JSON.parse();
* JSON.stringify();
*/
function interpolationMenulist (aConfig) {
    var that = {};
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
	
	function loadData(index) {
		gActualData = index || gActualData;
		try {
			var loadJSON = gTable.getValue(gActualData, 1);
			var loadObject = JSON.parse(loadJSON);
		} catch (e){
			loadObject = {};
		}
		gInterpTable.setData(loadObject.tableData);
		gInterpPlot.setPlotSettings(loadObject.plotSetting);
		gInterpPlot.refresh(gInterpTable.getData());
	}
	
	function newItem() {
		var newIndex = gTable.addNewRowToTable();

		gTable.setValue(newIndex, 0, 'Uj Interpolacio ' + newIndex, gCellButtonForm);
		gTable.getInputTag(newIndex, 0).onclick = function () {
			loadData(newIndex);
		};
	}
	 
	aConfig.newItemButton.onclick = function () {
		newItem();
	};
	
	gSaveButton.onclick = function () {
		var saveObject = {};
		saveObject.tableData = gInterpTable.getData();
		saveObject.plotSetting = gInterpPlot.getPlotSettings();
		
		var saveJSON = JSON.stringify(saveObject);
		gTable.setValue(gActualData, 1, saveJSON);
	};

	newItem();
	gTable.setValue(1, 1, JSON.stringify(ExampleData.senderOneData));
	loadData();
	 
    return that;
}