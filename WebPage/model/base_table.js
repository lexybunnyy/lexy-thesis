/**
 * Created by lexy on 2014.11.04..
 *
 *
 * {code}

var table = basicTable({
    tableId: 'myTable',
    debug: debug
});
 table.newTableOneCell('hello');

 config.addColumnOndRowButton.onclick=function(){
    table.addNewColumnToTable();
    table.addNewRowToTable();
};

 var inputAttr = {
    "type" :  "text",
    "disabled": "true"
};
 table.addCellForm(0,0, inputAttr);

 * {code}
 *
 * TODO: Use
 */


function basicTable (aConfig) {
    var that = this;
    that.id =  aConfig.tableId;
    that.reference = document.getElementById(aConfig.tableId);
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
    that.addTextCellToRow = function (rowIndex, textValue, inputAttributes) {
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

    /** Ad egy új sort a táblázathoz */
    that.addNewRowToTable = function(data){
        data = data || [];
        var index = addNewRowTagToTable();
        for (var i = 0; i < that.numOfCols() ; i++) {
            var value = data[index] || '-';
            that.addTextCellToRow(index, value)
        }
    };

    /** Ad egy új oszlopot a táblázathoz **/
    that.addNewColumnToTable = function(data){
        data = data || [];
        gTableRows.forEach(function(row, index){
            var value = data[index] || '-';
            that.addTextCellToRow(index, value)
        });
    };

    /** Egy adott cella megformázása */
    that.addCellForm = function (i , j, attributes) {
        var cell = that.getRow(i)[j];
        setAttributes(cell, attributes);
    };

    /** Oszlopok száma */
    that.numOfCols = function(){
        if (!that.getRow(0)) {
            return 0;
        }
        return that.getRow(0).length;
    };

    /** Sorok száma */
    that.numOfRows = function(){
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
    that.getValue = function(i,j){
        var tableRow = gTableRows[i].getElementsByTagName("INPUT");
        return tableRow[j].value;
    };

    /** Egy adott cella érték beállítása*/
    that.setValue = function(i, j, value){
        var tableRow = gTableRows[i].getElementsByTagName("INPUT");
        tableRow[j].value = value;
    };

    /** Teljesen törli a táblázatot */
    that.deleteTable = function() {
        for (var i = that.reference.rows.length; i > 0; i--) {
            that.reference.deleteRow(i - 1);
        }
        addNewRowTagToTable();
        gTableRows = [];
    };

    /** Törli a táblázatot, majd létrehoz egy cellát (Egy sor egy oszlop)*/
    that.newTableOneCell = function(value) {
        that.deleteTable();
        addNewRowTagToTable();
        that.addTextCellToRow(0, value);
    };

    return that;
}