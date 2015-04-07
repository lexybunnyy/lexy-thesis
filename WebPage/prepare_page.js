/**
Result Merge Minta: 
{"tableData":{"name":"xsquared_example","polynomial":[0,0,1],"points":[{"x":0,"y":[0,0,2,0]},{"x":1,"y":[1,2,2,0]},{"x":2,"y":[4,4,2,0]},{"x":3,"y":[9,6,2,0]},{"x":4,"y":[16,8,2,0]},{"x":5,"y":[25,10,2,0]},{"x":6,"y":[36,12,2,0]}],"max_derivate":3,"num_of_points":7,"num_of_rows":5,"num_of_cols":8,"type_of_interpolation":"","inverze":false},"plotSetting":{"xaxis_min":"-1","xaxis_max":"9","yaxis_min":"-1","yaxis_max":"36","derivNum_max":""}}
*/
var plotGenerateSettings = null;
$(function() {
	//-----------------------------------default
	$("<div id='tooltip'></div>").css({
		position: "absolute",
		display: "none",
		border: "1px solid #fdd",
		padding: "2px",
		"background-color": "#fee",
		opacity: 0.80
	}).appendTo("body");
	
	var bDebug = webPageDebug({
         buttonsIds: ['debug_button', 'debug_button2'],
         debugSpan: $("#debugSpanId"),
		 debugInput: Base.get('debug_text')
    });
	
		//-----------------------------------plot
	plotGenerateSettings = {
		xaxis_min : Base.get('minx'),
		xaxis_max : Base.get('maxx'),
		yaxis_min : Base.get('miny'),
		yaxis_max : Base.get('maxy'),
        //TODO: pontosság!
		derivNum_max : Base.get('maxderivnum'),
		defaultType :  gTypePrepare
	};
	
	var plotDefaultSettings = {
		placeholder : $("#resultplot"),
		tooltip : $("#tooltip")
	};
	
	var plotActionView = {
		hoverdata : $("#span_hoverdata"),
		clickdata : $("#span_clickdata")
	};
	
	var setInput = {
		x :  Base.get('input_coord_x'),
		y :  Base.get('input_coord_y')
	};

	var interpPlot = interpolationPlot({
		plotGenerateSettings : plotGenerateSettings,
		plotDefaultSettings : plotDefaultSettings,
		plotActionView : plotActionView,
		setInput : setInput,
		hoverdata : $("#span_hoverdata"),
		clickdata : $("#span_clickdata")
	});
	
		//-----------------------------------table
	var bTable = basicTable({
		tableId: 'interpolationTable',
		debug: bDebug
	});

	var interpTable = interpolationTable({
		table: bTable,
		debug: bDebug,
		addColumnButton: Base.get('addcolumn_button'),
		addRowButton: Base.get('addrow_button'),
		newTableButton: Base.get('refresh_button')
	});

		//-----------------------------------contact
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

    interpPlot.refresh(interpTable.getData());
	
		//-----------------------------------menulist
	var interpMenulist = interpolationMenulist({
		tableId: 'interpoationSetTable',
		interpolationPlot: interpPlot,
		interpolationTable: interpTable,
		newItemButton: Base.get('addNewMenulistItem')
	});

			//-----------------------------------
	/** Leggenerálja/Elmenti a Listában szereplő összes Interpolációt */
	function save() {
		interpMenulist.saveItemSettings();
		//Base.erlangJSON();
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

	$("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});