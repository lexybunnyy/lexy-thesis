
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
	}).done(function(param1) {
    	console.log( "success", param1, 'dd');
    	Base.get('resultLoadText').value = JSON.stringify(param1);
    	alert("Calculate Done!");
	}).fail(function(info, textstatus) {
	    console.log( "error", info, textstatus);
	}).always(function() {
	    console.log( "end" );
	});
}