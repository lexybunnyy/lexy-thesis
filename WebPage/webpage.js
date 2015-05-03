/**
Result Merge Minta: 
{"tableData":{"name":"xsquared_example","polynomial":[0,0,1],"points":[{"x":0,"y":[0,0,2,0]},{"x":1,"y":[1,2,2,0]},{"x":2,"y":[4,4,2,0]},{"x":3,"y":[9,6,2,0]},{"x":4,"y":[16,8,2,0]},{"x":5,"y":[25,10,2,0]},{"x":6,"y":[36,12,2,0]}],"max_derivate":3,"num_of_points":7,"num_of_rows":5,"num_of_cols":8,"type_of_interpolation":"","inverze":false},"plotSetting":{"xaxis_min":"-1","xaxis_max":"9","yaxis_min":"-1","yaxis_max":"36","derivNum_max":""}}
*/
var bDebug = null;
var plotActionView = null;
var interpPlot = null;
var interpTable = null;
var setInput = null;
var interpMenulist = null;
var init = null;

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
	
	bDebug = webPageDebug({
         buttonsIds: ['debug_button', 'debug_button2'],
         debugSpan: $("#debugSpanId"),
		 debugInput: Base.get('debug_text')
    });
   
	//$("#float_footer").prepend("Flot " + $.plot.version);
});