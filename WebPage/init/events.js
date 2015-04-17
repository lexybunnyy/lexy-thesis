//events.js

$(function() {
    saveAndReload = function() {
		save();
		load();
	}
	
    Base.get('refreshPlot').onclick = saveAndReload;
    Base.get('minx').onclick = saveAndReload;
    Base.get('maxx').onclick = saveAndReload;
    Base.get('miny').onclick = saveAndReload;
    Base.get('maxy').onclick = saveAndReload;
    Base.get('maxderivnum').onclick = saveAndReload;
    Base.get('precision').onclick = saveAndReload;

    Base.get('addPoint').onclick = function() {
        var x = parseFloat(setInput.x.value);
        var y = parseFloat(setInput.y.value);
        if (!isNaN(x) && !isNaN(y)){
            interpTable.addPoint(x, y, 0);
            interpPlot.refresh(interpTable.getData());
        }
    };

		/** Leggenerálja/Elmenti a Listában szereplő összes Interpolációt */
	function save() {
		interpMenulist.saveItemSettings();
        Base.get('sendServerText').value = JSON.stringify(interpMenulist.getDataArray(true));
        Base.get('saveText').value = JSON.stringify(interpMenulist.getDataObject());
	}

	function load(result) {
		if (result) {
			Base.get('resultLoadText').value = JSON.stringify(result);
		}

		var savedTextJSON = Base.get("saveText").value;
		var savedText = JSON.parse(savedTextJSON);
		var serverResult = {};

		try {
			var serverResultJSON = Base.get("resultLoadText").value
			serverResult = JSON.parse(serverResultJSON);
		} catch (e) {
			serverResult = {};
		}
		interpMenulist.loadAll(savedText, serverResult);
		interpMenulist.loadItemSettings();
	}

	Base.get('saveInMenulist').onclick = save;
	Base.get('saveButton').onclick = save;
	Base.get('resultLoad').onclick = function(){
		load();
	};

	Base.get('sendServer').onclick = function () {
		Connection.request({
			params: interpMenulist.getDataArray(true),
			callback: load
		});
	}
	
	Base.get('loadExample1').onclick = function () {
		var JSONExample = '{"data_set":{"1":{"id":"1","name":"new_interpolation_1","type":"1","inverse":false,"tableData":{"points":[{"x":0,"y":[0,0,2,0]},{"x":1,"y":[1,2,2,0]},{"x":2,"y":[4,4,2,0]},{"x":3,"y":[9,6,2,0]},{"x":4,"y":[16,8,2,0]},{"x":5,"y":[25,10,2,0]},{"x":6,"y":[36,12,2,0]}],"num_of_points":7,"max_derivate":3,"num_of_cols":8,"num_of_rows":5,"polynomial":null},"plotSetting":{"xaxis_min":"-1","xaxis_max":"9","yaxis_min":"-1","yaxis_max":"36","derivNum_max":""}}}}';
		Base.get('saveText').value = JSONExample;
	}

	function init() {
		console.log('hello');
	};
	init();
})