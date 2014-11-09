$(function() {
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
	
	var plotGenerateSettings = {
		xaxis_min : Base.get('minx'),
		xaxis_max : Base.get('maxx'),
		yaxis_min : Base.get('miny'),
		yaxis_max : Base.get('maxy'),
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
	}

	var plot = interpolationPlot({
		plotGenerateSettings : plotGenerateSettings,
		plotDefaultSettings : plotDefaultSettings,
		plotActionView : plotActionView,
		setInput : setInput,
		hoverdata : $("#span_hoverdata"),
		clickdata : $("#span_clickdata")
	});
	
	Base.get('refresh').onclick=function(){
		plot.refresh(ExampleData.senderData);
	}
	
	//Table: 
	var bTable = basicTable({
		tableId: 'interpolationTable',
		debug: bDebug
	});

	interpolationTable({
		table: bTable,
		debug: bDebug,
		addColumnButton: Base.get('addcolumn_button'),
		addRowButton: Base.get('addrow_button'),
		newTableButton: Base.get('refresh_button')
	});
	
	$("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});