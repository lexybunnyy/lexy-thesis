
var Connection = {};

Connection.request = function (aConfig) {
	console.log(aConfig.params);
	$.support.cors = true;
	$.ajax({
		crossDomain: true,
		dataType: "json",
		type: "GET",
		contentType:  "application/json; charset=utf-8",
		url: '/API',
		data: JSON.stringify(aConfig.params),
	}).done(function(result) {
    	console.log( "success", result);
    	alert("Számítás Befejeződött!\nIdő: " + result['time'] + "ms");
    	aConfig.callback(result);
	}).fail(function(info, textstatus) {
	    console.log( "error", info, textstatus);
	    alert("Hiba a kapcsolatban!");
	});
}