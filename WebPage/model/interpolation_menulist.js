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
	var gIndexMax = 0;
    var gCellButtonForm = {
        "type" :  "button",
    };
	var gFirstRowForm = {
        "type" :  "text",
        "disabled": "true"
    };
	
	/** Új Lista elem */
	function newItem() {
		var newIndex = gTable.addNewRowToTable();
		gIndexMax = gIndexMax + 1;


		gTable.setValue(newIndex, 0, gIndexMax);
		gTable.setValue(newIndex, 1, 'new_interpolation_' + gIndexMax, gCellButtonForm);
		gTable.getInputTag(newIndex, 1).onclick = function () {
			console
			loadItemSettings(newIndex);
		};

		gTable.setValue(1, 2, JSON.stringify(ExampleData.senderOneData));

		gTable.setValue(newIndex, 3, 'DEL', gCellButtonForm);
		gTable.getInputTag(newIndex, 3).onclick = function () {
			//TODO Fix or remove
			var row = gTable.findValue(1, gIndexMax);
			console.log(gIndexMax);
			gTable.remove(row);
		};
	}

	/** Elmenti az adatokat a táblából (az aktuális Interpolációból) */
	function saveItemSettings () {
		var saveObject = {};
		saveObject.tableData = gInterpTable.getData();
		saveObject.plotSetting = gInterpPlot.getPlotSettings();
		
		var saveJSON = JSON.stringify(saveObject);
		gTable.setValue(gActualData, 2, saveJSON);
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
		gInterpTable.setData(loadObject.tableData);
		gInterpPlot.setPlotSettings(loadObject.plotSetting);
		gInterpPlot.refresh(gInterpTable.getData());
	}
	
	/** Leggenerálja/Elmenti a Listában szereplő összes Interpolációt */
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
				data.sender = gTable.getValue(i, 2);
			}
			saveObject.data_set.push(data);
		}
		gDebug.setInputValue(JSON.stringify(saveObject));
        Base.erlangJSON(saveObject);
	}
	
	/** Betölti az összes Interpolációt az adott adathalmazból */
	function loadAll(loadObject){
		newMenulist();
		loadObject.data_set.forEach(function(data, index){
			newItem();
			var i = 1 + index;
			gTable.setValue(i, 1, data.name);
			gTable.setValue(i, 2, JSON.stringify(data.sender));
		});
	}
	
	function newMenuListHeaderItem(HeaderName) {
		var index = gTable.addNewColumnToTable();
		//console.log(HeaderName, index);
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
	gTable.setValue(1, 2, JSON.stringify(ExampleData.senderOneData));
	loadItemSettings();
    return that;
}