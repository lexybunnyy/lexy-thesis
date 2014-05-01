/**
 * Created by lexy on 2014.04.29..
 */

var senderData = {
    points: [
        { x: 0, y: [0]},
        { x: 1, y: [1]},
        { x: 3, y: [9]}
    ],
    deriv_num: 0
};


function table(aConfig){
    var aTable = aConfig.table;
    var tableRows = [];
    var numOfDatas = 1;

    function newTable(){
        numOfDatas = 1;
        tableRows[0] = addEmptyRowToTable();
        tableRows[1] = addEmptyRowToTable();

        addFirstCellToRow(tableRows[0], "x");
        addFirstCellToRow(tableRows[1], "y");
        addCellToRow(tableRows[0], 0.00);
        addCellToRow(tableRows[1], 0.00);
    }

    function addEmptyRowToTable(){
        var trow = document.createElement("TR");
        aTable.appendChild(trow);
        return trow;
    };

    function addCellToRow(row, str){
        var cell = document.createElement("TD");
        var textInput = document.createElement("INPUT");
        textInput.setAttribute("type", "text");
        textInput.value = str;
        cell.appendChild(textInput);
        row.appendChild(cell);
        return cell;
    };

    function addFirstCellToRow(row, str){
        var cell = document.createElement("TD");
        var textInput = document.createElement("INPUT");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("disabled", "true");
        textInput.value = str;
        cell.appendChild(textInput);
        row.appendChild(cell);
        return cell;
    };

    function addEmptyColumnToTable(){
        ++numOfDatas;
        tableRows.forEach(function(row){
            addCellToRow(row , "-");
        });
    }

    aConfig.debug.button.onclick = function(){
        result = [];
        var cells = tableRows[0].getElementsByTagName("TD");
        result.push(cells);

        var debugText = JSON.stringify(result);
        aConfig.debug.string.text(" " + debugText);
    }

    aConfig.newTableButton.onclick = function(){
        for(var i = aTable.rows.length; i > 0;i--)
        {
            aTable.deleteRow(i -1);
        }
        tableRows = [];
        newTable();
    }

    aConfig.addRowButton.onclick = function(){
        var index = tableRows.length;
        tableRows[index] = addEmptyRowToTable();
        addFirstCellToRow(tableRows[index], "y("+( index-1 )+")");
        for(var i = 0; i<numOfDatas; i++ ){
            addCellToRow(tableRows[index], "-");
        }
    }

    aConfig.addColumnButton.onclick=function(){
        addEmptyColumnToTable();
    }

    function getDatas(){
    }

    function setDatas(){

    }

    newTable();

}
