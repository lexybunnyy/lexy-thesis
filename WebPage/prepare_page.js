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
         debugSpan: $("#debugSpanId")
    });
	
		//-----------------------------------plot
	var plotGenerateSettings = {
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

    //interpTable.getData();
    //interpTable.setData(ExampleData.senderOneData);
    //interpPlot.refresh(interpTable.getData());

		//-----------------------------------contact
    Base.get('refreshPlot').onclick = function() {
        //interpPlot.refresh(ExampleData.senderOneData, ExampleData.receiverOneData);
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
	var menuListTable = basicTable({
		tableId: 'interpoationSetTable',
		debug: bDebug
	});
	
	var interpMenulist = interpolationMenulist({
		table: menuListTable,
		debug: bDebug,
		interpolationPlot: interpPlot,
		interpolationTable: interpTable,
		save: Base.get('saveInMenulist')
	});
	$("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});