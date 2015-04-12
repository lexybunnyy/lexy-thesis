//menulist.js

$(function() {
	interpMenulist = interpolationMenulist({
		tableId: 'interpoationSetTable',
		interpolationPlot: interpPlot,
		interpolationTable: interpTable,
		newItemButton: Base.get('addNewMenulistItem')
	});
})