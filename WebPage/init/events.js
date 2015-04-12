//events.js

$(function() {

    Base.get('refreshPlot').onclick = function() {
        interpPlot.refresh(interpTable.getData());
    };

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
        Base.get('sendServerText').value = JSON.stringify(interpMenulist.getDataArray());
        Base.get('saveText').value = JSON.stringify(interpMenulist.getDataObject());
	}

	Base.get('saveInMenulist').onclick = save;
	Base.get('saveButton').onclick = save;

	Base.get('resultLoad').onclick = function () {
		console.log(Base.get("sendServerText").value);
		// TODO: interpMenulist.loadLabel();
	}
	
	Base.get('filePicker').onclick = function () {
		console.log(Base.get('filePicker').value);
	}

	Base.get('sendServer').onclick = function () {
		Connection.request({
			params: interpMenulist.getDataArray()
		});
	}
	init(); 
})