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
			that.loadItemSettings(newIndex);
		};

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

	function getDataValueOp(sender, key, value) {
		if (sender && key === 'tableData') {
			return {
				points: value.points
			}
		}
		return value;
	}

	function getData(i, sender){
		var data = {};
		data.id = gTable.getValue(i, 0);
		data.name = gTable.getValue(i, 1);
		var JSONStr = gTable.getValue(i, 2);
		try {
			var Sender = JSON.parse(JSONStr);
			Base.forEach(Sender, function(key, value) {
				if (sender && key === 'plotSetting') {
					return;
				}
				data[key] = getDataValueOp(sender, key, value);
			});
		} catch (e) {
			data.sender = JSONStr;
		}
		return data;
	}

	function getPolyStr(aCurrentPoly) {
		if(!aCurrentPoly) {
			return '';
		}
		var i = 0;
		var poli = [];
		for (i = 0; i < aCurrentPoly.length; i++) {
			poli.push(aCurrentPoly[i] + '*x^' + i);
		}
		return poli.join(' + ');
	}

	that.loadItemSettings = function(index) {
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

		Base.get("type").value = loadObject.type || '0';
		Base.get("inverse").checked = loadObject.inverse || false;
		Base.get("polynomial").value = getPolyStr(gCurrentPoly);
		
		if (Base.get("type").value === '2') {
			Base.get("inverse").disabled = true;
			Base.get("inverse").checked = false;
		} else {
			Base.get("inverse").removeAttribute("disabled");
		}
	}

	/** Betölti az összes Interpolációt az adott adathalmazból */
	that.loadAll = function(savedObject, resultObject) {
		newMenulist();
		Base.forEach(savedObject.data_set, function(id, value) {
			var i = that.newItem();

			var tableData = value.tableData;
			tableData.polynomial = resultObject[value.id];

			gTable.setValue(i, 0, value.id);
			gTable.setValue(i, 1, value.name);
			gTable.setValue(i, 2, JSON.stringify({
				tableData: value.tableData,
				inverse: value.inverse,
				type: value.type,
				plotSetting: value.plotSetting
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

	that.getDataArray = function(server) {
		var saveObject = {};
		saveObject.data_set = [];
        var i;
		for (i = 1; i < gTable.getNumOfRows(); i++) {
			saveObject.data_set.push(getData(i, server));
		}
		saveObject.nodenumber = Base.get("nodenumber").value;
		return saveObject;
	}

	newMenulist();

    return that;
}