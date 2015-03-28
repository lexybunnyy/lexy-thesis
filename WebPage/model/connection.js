
function connection(aConfig) {
	$.support.cors = true;
	$.ajax({
		crossDomain: true,
		dataType: "json",
		type: "GET",
		contentType:  "application/json; charset=utf-8",
		url: 'http://localhost:8086/API',
		data: JSON.stringify(aConfig),
	}).done(function(param1) {
    	console.log( "success", param1, 'dd');
	}).fail(function(info, textstatus) {
	    console.log( "error", info, textstatus);
	}).always(function() {
	    console.log( "end" );
	});
}