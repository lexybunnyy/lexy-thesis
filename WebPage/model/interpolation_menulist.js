/** Ebbe ker�l bele az oldalt l�v� men� kostans 2 oszloppal:
* az egyik oszlop rejtett tulajdons�got kap nem debug m�dban TODO
* JSON.parse();
* JSON.stringify();
*/
function interpolationMenulist (aConfig) {
    var that = {};
	var gTable = aConfig.table;
	var gDebug = aConfig.debug;
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
	
	function newItem() {
		var newIndex = gTable.addNewRowToTable();

		gTable.setValue(newIndex, 0, 'Uj Interpolacio ' + newIndex, gCellButtonForm);
		gTable.getInputTag(newIndex, 0).onclick = function () {
			loadItemSettings(newIndex);
		};
	}

	function saveItemSettings () {
		var saveObject = {};
		saveObject.tableData = gInterpTable.getData();
		saveObject.plotSetting = gInterpPlot.getPlotSettings();
		
		var saveJSON = JSON.stringify(saveObject);
		gTable.setValue(gActualData, 1, saveJSON);
	}
	
	function loadItemSettings(index) {
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
	
	function saveAll() {
		var saveObject = {};
		saveObject.data_set = [];
        var i;
		for (i = 1; i < gTable.getNumOfRows(); i++) {
			var data = {};
			data.name = gTable.getValue(i, 0);
			try {
				data.sender = JSON.parse(gTable.getValue(i, 1));
			} catch (e) {
				data.sender = gTable.getValue(i, 1);
			}
			saveObject.data_set.push(data);
		}
		gDebug.setInputValue(JSON.stringify(saveObject));
        Base.erlangJSON(saveObject);
	}
	
	function loadAll(loadObject){
		loadObject.data_set.forEach(function(data, index){
			newItem();
			var i = 1 + index;
			gTable.setValue(i, 0, data.name);
			gTable.setValue(i, 1, JSON.stringify(data.sender));
		});
	}
	
	function newMenulist(){
		gTable.deleteTable();
		gTable.addNewTableOneCell('Interpolacio neve', gFirstRowForm);
		gTable.addNewColumnToTable();
		gTable.setCellForm(0, 1, gFirstRowForm);
	}
	 
	aConfig.newItemButton.onclick = function () {
		newItem();
	};

	aConfig.loadFromDebug.onclick = function() {
		var loadJSON = gDebug.getInputValue();
		try {
			var loadObject = JSON.parse(loadJSON);
			loadAll(loadObject);
		} catch (e) {
			console.log('invalid JSON');
			return false;
		}
	};
	
	gSaveButton.onclick = function () {
		saveItemSettings();
		saveAll();
	};

	newMenulist();
	newItem();
	gTable.setValue(1, 1, JSON.stringify(ExampleData.senderOneData));
	loadItemSettings();
    return that;
}