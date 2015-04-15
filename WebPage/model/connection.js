
var Connection = {};

Connection.request = function (aConfig) {
	console.log(aConfig.params);
	$.support.cors = true;
	$.ajax({
		crossDomain: true,
		dataType: "json",
		type: "GET",
		contentType:  "application/json; charset=utf-8",
		url: 'http://localhost:8086/API',
		data: JSON.stringify(aConfig.params),
	}).done(function(result) {
    	console.log( "success", result, 'dd');
    	alert("Calculate Done!");
    	aConfig.callback(result);
	}).fail(function(info, textstatus) {
	    console.log( "error", info, textstatus);
	}).always(function() {
	    console.log( "end" );
	});
}