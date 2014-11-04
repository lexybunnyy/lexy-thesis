/**
 * Created by lexy on 2014.11.04..
 *
 * TODO: Test Debug Fix Use
 */

function basicTable (aConfig) {
    var that = this;
    that.id =  aConfig.tableId;
    that.reference = document.getElementById(aConfig.tableId);
    var gTableRows = [];

    /**Make New tag
     * @returns Number
     */
    function addNewRowTagToTable () {
        var newRow = document.createElement("TR");
        that.reference.appendChild(newRow);
        var index = gTableRows.length;
        gTableRows[index] = gTableRows.length;
        return index;
    }

    /** Ad  egy cellát a sorhoz  */
    function addCellToRow(row) {
        var cell = document.createElement("TD");
        row.appendChild(cell);
        return cell;
    }

    function setAttributes(object, attributes) {
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

    /** Ad egy üres sort a táblázathoz */
    that.addNewRowToTable = function(data){
        var index = addNewRowTagToTable();
        data = data || [];
        for (var i = 0; i < that.numOfCols() ; i++) {
            var value = data[index] || '-';
            that.addTextCellToRow(gTableRows[index], value)
        }
    };

    /** Ad egy üres Oszlopot a táblázathoz **/
    that.addNewColumnToTable = function(data){
        data = data || [];
        gTableRows.forEach(function(row, index){
            var value = data[index] || '-';
            that.addTextCellToRow(row, value)
        });
    };

    /***/
    that.addTextCellToRow = function (rowReference, textValue, inputAttributes) {
        inputAttributes = inputAttributes || {
            "type" :  "text"
        };
        var cell = addCellToRow(rowReference);
        var textInput = makeTextInput(textValue, inputAttributes);
        cell.insertBefore(textInput, cell.firstChild);
    };

    /**TODO:TEST*/
    that.addCellTextForm = function (i , j, attributes) {
        var cell = that.getRow(i)[j];
        var textInput = cell.firstChild;
        setAttributes(textInput, attributes);
    };

    that.numOfCols = function(){
        if(that.getRow(0)){
            return 0;
        }
        return that.getRow(0).length;
    };

    that.numOfRows = function(){
        return gTableRows.length;
    };

    that.getRow = function(i){
        var tableRow = gTableRows[i].getElementsByTagName("INPUT");
        return tableRow;
    };

    that.getValue = function(i,j){
        var tableRow = gTableRows[i].getElementsByTagName("INPUT");
        return tableRow[j].value;
    };

    that.setValue = function(i, j, value){
        var tableRow = gTableRows[i].getElementsByTagName("INPUT");
        tableRow[j].value = value;
    };

    /** Teljesen törli a táblázatot */
    that.deleteTable = function() {
        for (var i = that.reference.rows.length; i > 0; i--) {
            that.reference.deleteRow(i - 1);
        }
    };

    return that;
}