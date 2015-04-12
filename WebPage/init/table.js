//table.js

$(function() {
	var bTable = basicTable({
		tableId: 'interpolationTable',
		debug: bDebug
	});

	interpTable = interpolationTable({
		table: bTable,
		debug: bDebug,
		addColumnButton: Base.get('addcolumn_button'),
		addRowButton: Base.get('addrow_button'),
		newTableButton: Base.get('refresh_button')
	});
})