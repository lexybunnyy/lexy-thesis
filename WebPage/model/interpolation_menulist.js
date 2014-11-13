/** Ebbe kerül bele az oldalt lévõ menü kostans 2 oszloppal:
* az egyik oszlop rejtett tulajdonságot kap nem debug módban TODO
* 
*/
function interpolationMenulist (aConfig) {
    var that = this;
	var gTable = aConfig.table;
    var gCellButtonForm = {
        "type" :  "button",
    };
	var gFirstRowForm = {
        "type" :  "text",
        "disabled": "true"
    };
	gTable.addNewTableOneCell('hello', gFirstRowForm);
	gTable.addNewColumnToTable();

    return that;
}