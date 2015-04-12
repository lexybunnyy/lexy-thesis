/** Ebbe ker�l bele az oldalt l�v� men� kostans 2 oszloppal:
* az egyik oszlop rejtett tulajdons�got kap nem debug m�dban TODO
* JSON.parse();
* JSON.stringify();
*/
function interpolationMenulist (aConfig) {
    var that = {};
	var gInterpPlot = aConfig.interpolationPlot;
	var gInterpTable = aConfig.interpolationTable;
	var gActualData = 1;
	var gIndexMax = 0;
    var gCellButtonForm = {
        "type" :  "button",
    };
    var gCurrentPoly = null;
	var gFirstRowForm = {
        "type" :  "text",
        "disabled": "true"
    };
    var gTable = basicTable({
		tableId: aConfig.tableId,
		debug: null
	});
	
	/** Új Lista elem */
	that.newItem = function() {
		var newIndex = gTable.addNewRowToTable();
		gIndexMax = gIndexMax + 1;

		gTable.setValue(newIndex, 0, gIndexMax);
		gTable.setValue(newIndex, 1, 'new_interpolation_' + gIndexMax, gCellButtonForm);
		gTable.getInputTag(newIndex, 1).onclick = function () {
			loadItemSettings(newIndex);
		};

		//gTable.setValue(1, 2, JSON.stringify(ExampleData.senderOneData));
		var ID = gTable.getValue(newIndex, 0);

		gTable.setValue(newIndex, 3, 'DEL', gCellButtonForm);
		gTable.getInputTag(newIndex, 3).onclick = function () {
			var row = gTable.findValue(0, ID);
			if (row && row > 0) {
				gTable.remove(row+1);
			}
		};
		return newIndex;
	}
	
	/** Betölti az egyik indexből az adatokat a táblába */
	function loadItemSettings(index) {
		gActualData = index || gActualData;
		try {
			var loadJSON = gTable.getValue(gActualData, 2);
			var loadObject = JSON.parse(loadJSON);
		} catch (e){
			loadObject = {};
		}
		var tableData = loadObject.tableData;
		var gCurrentPoly = tableData ? tableData.polynomial : null;
		gInterpTable.setData(tableData);

		gInterpPlot.setPlotSettings(loadObject.plotSetting);
		gInterpPlot.refresh(gInterpTable.getData(), gCurrentPoly);
	}
	
	function newMenuListHeaderItem(HeaderName) {
		var index = gTable.addNewColumnToTable();
		gTable.setValue(0, index-1, HeaderName);
		gTable.setCellForm(0, index-1, gFirstRowForm);
	}

	/** Új menülista: régi menü kitörlése, és egy új generálása */
	function newMenulist(){
		gTable.newTable();
		newMenuListHeaderItem('Id');
		newMenuListHeaderItem('Name');
		newMenuListHeaderItem('JSON');
		newMenuListHeaderItem('Delete');
	}
	
	/** Gombok Inicializálása */
	aConfig.newItemButton.onclick = function () {
		that.newItem();
	};

	function getData(i){
		var data = {};
		data.id = gTable.getValue(i, 0);
		data.name = gTable.getValue(i, 1);
		var JSONStr = gTable.getValue(i, 2);
		try {
			var Sender = JSON.parse(JSONStr);
			Base.forEach(Sender, function(key, value) {
				data[key] = value;
			});
		} catch (e) {
			data.sender = JSONStr;
		}
		return data;
	}

	/** Betölti az összes Interpolációt az adott adathalmazból */
	that.loadAll = function(loadObject) {
		newMenulist();
		Base.forEach(loadObject.data_set, function(id, value){
			var i = newItem();
			gTable.setValue(i, 0, value.id);
			gTable.setValue(i, 1, value.name);
			gTable.setValue(i, 2, JSON.stringify({
				tableData: value.tableData,
				inverse: value.inverse,
				type: value.type
			}));
		});
	}

	/** Elmenti az adatokat a táblából (az aktuális Interpolációból) */
	that.saveItemSettings = function() {
		var saveObject = {};
		saveObject.type = Base.get("type").value;
		saveObject.inverse = Base.get("inverse").checked;
		saveObject.tableData = gInterpTable.getData();
		saveObject.tableData.polynomial = gCurrentPoly || null;
		saveObject.plotSetting = gInterpPlot.getPlotSettings();
		
		var saveJSON = JSON.stringify(saveObject);
		gTable.setValue(gActualData, 2, saveJSON);
	}

	that.getDataObject = function() {
		var saveObject = {};
		saveObject.data_set = {};
        var i;
		for (i = 1; i < gTable.getNumOfRows(); i++) {
			var data = getData(i)
			saveObject.data_set[data.id] = data;
		}
		return saveObject;
	}

	that.getDataArray = function() {
		var saveObject = {};
		saveObject.data_set = [];
        var i;
		for (i = 1; i < gTable.getNumOfRows(); i++) {
			saveObject.data_set.push(getData(i));
		}
		return saveObject;
	}

	newMenulist();

    return that;
}