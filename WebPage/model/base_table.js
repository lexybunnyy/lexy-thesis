/**
 * Created by lexy on 2014.11.04..
 *
 *
 * {code}

var table = basicTable({
    tableId: 'myTable',
    debug: debug
});
 table.addNewTableOneCell('hello');

 config.addColumnAndRowButton.onclick=function(){
    table.addNewColumnToTable();
    table.addNewRowToTable();
};

 //Add functions:
 table.addNewTableOneCell('hello');
 table.addNewColumnToTable([1,2,3]);
 table.addNewRowToTable([1,2,3]);
 table.addNewCellToRow(0, 'hello');

 //get and set
 var inputAttr = {
    "type" :  "text",
    "disabled": "true"
};
 table.setCellForm(0, 0, inputAttr);
 table.getNumOfCols();
 table.getNumOfRows();
 table.getRow(0);
 table.getValue(0, 0);
 table.setValue(0, 0, 'hallo')

 table.deleteTable();

 * {code}
 *
 * TODO: Use
 */


function basicTable (aConfig) {
    var that = {};
    that.id =  aConfig.tableId;
    that.reference = Base.get(aConfig.tableId, 'id');
    var gTableRows = [];

    /** Ad egy új sort a táblázathoz
     * @returns Number Sor Indexe */
    function addNewRowTagToTable () {
        var newRow = document.createElement("TR");
        that.reference.appendChild(newRow);
        var index = gTableRows.length;
        gTableRows[index] = newRow;
        return index;
    }

    /** Ad  egy cellát a sorhoz  */
    function addCellToRow(index) {
        if (!gTableRows[index]) {
            return null;
        }
        var cell = document.createElement("TD");
        gTableRows[index].appendChild(cell);
        return cell;
    }

    /**Beállítja egy objektum tulajdonságait
     * Ennek segítségével tudunk formázást készíteni egy cellához
     * */
    function setAttributes(object, attributes) {
        if (!object){
            return;
        }
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                var attrValue = attributes[attr];
                object.setAttribute(attr, attrValue);
            }
        }
    }

    /** TextInput hozzáadása a sorhoz*/
    function makeTextInput (value,  attributes) {
        var textInput = document.createElement("INPUT");
        setAttributes(textInput, attributes);
        textInput.value = value;
        return textInput;
    }

    /** Ad egy új cellát a sorhoz
     *  ??? Lehet hogy ez nem kell publicba?
     * */
    that.addNewCellToRow = function (rowIndex, textValue, inputAttributes) {
        inputAttributes = inputAttributes || {
            "type" :  "text"
        };
        var cell = addCellToRow(rowIndex);
        var textInput = makeTextInput(textValue, inputAttributes);
        if (!cell || !textInput){
            return;
        }
        cell.insertBefore(textInput, cell.firstChild);
    };

    /** Ad egy új sort a táblázathoz
     * TODO: data nem jól működik
     * */
    that.addNewRowToTable = function(data){
        data = data || [];
        var index = addNewRowTagToTable();
        for (var i = 0; i < that.getNumOfCols() ; i++) {
            var value = data[index] || '-';
            that.addNewCellToRow(index, value)
        }
        return index;
    };

    /** Ad egy új oszlopot a táblázathoz
     * TODO: data nem jól működik
     * **/
    that.addNewColumnToTable = function(data) {
        data = data || [];
        gTableRows.forEach(function(row, index){
            var value = data[index] || '-';
            that.addNewCellToRow(index, value)
        });
        return that.getNumOfCols();
    };

    that.newTable = function() {
        that.deleteTable();
        addNewRowTagToTable();
    }

    /** Törli a táblázatot, majd létrehoz egy cellát (Egy sor egy oszlop)*/
    that.addNewTableOneCell = function(value, inputAttributes) {
        that.newTable();
        that.addNewCellToRow(0, value, inputAttributes);
    };

    /** Egy adott cella megformázás beállítása */
    that.setCellForm = function (i , j, attributes) {
        var cell = that.getRow(i)[j];
        setAttributes(cell, attributes);
    };

    /** Oszlopok száma */
    that.getNumOfCols = function(){
        if (!that.getRow(0)) {
            return 0;
        }
        return that.getRow(0).length;
    };

    /** Sorok száma */
    that.getNumOfRows = function(){
        return gTableRows.length;
    };

    /** Sor lekérése, ha nincs: Üres */
    that.getRow = function(i){
        if (!gTableRows[i]){
            return false;
        }
        return gTableRows[i].getElementsByTagName("INPUT");
    };

	/** Egy adott cella érték lekérdezése */
    that.getInputTag = function(i, j){
        var tableRow = that.getRow(i);
        if (!tableRow || !tableRow[j]) {
            return false;
        }
        return tableRow[j];
    };

    /** Egy adott cella érték lekérdezése */
    that.getValue = function(i, j){
		var inputTag = that.getInputTag(i, j);
		if (!inputTag) {
		    return false;
		}
        return inputTag.value;
    };

    /** findValue() */
    that.findValue = function(column, value) {
        for(var i = 0; i < that.reference.rows.length; i++) {
            var currentValue = that.getValue(i, column);
            if(value === currentValue){
                return i;
            };
        }
        return null;
    };

    /** Egy adott cella érték beállítása*/
    that.setValue = function(i, j, value, form) {
        if (!gTableRows[i]) {
            throw 'setValue Invalid Index: ' + i;
        }
        var tableRow = gTableRows[i].getElementsByTagName("INPUT");
        tableRow[j].value = value;
        if (form){
            that.setCellForm(i, j, form);
        }
    };

    /** Teljesen törli a táblázatot */
    that.deleteTable = function() {
        for (var i = that.reference.rows.length; i > 0; i--) {
            that.reference.deleteRow(i - 1);
        }
        addNewRowTagToTable();
        gTableRows = [];
    };

    that.remove = function(row) {
        gTableRows.splice(row-1, 1);
        that.reference.deleteRow(row);
    }

    return that;
}