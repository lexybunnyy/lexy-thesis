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
    var numOfDatas = 1; //Colums
    //var numOfDerivates = 0; //Rows-2

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
        //getDatas();
        var data = [parseInt("1000",10).toFixed(2)];
        if(parseFloat("0.00") !== null){
            data.push("null1");
        }
        var debugText = JSON.stringify(getPoints());
        aConfig.debug.string.text(" " + debugText);
    }

    aConfig.newTableButton.onclick = function(){
        aConfig.debug.string.text(" ");
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

    function getPoints(){
        var result = [];
        var result_x = [];
        var result_y = [];
        var i, j, y;
        var tableRow = tableRows[0].getElementsByTagName("INPUT");
        for(j = 0; j < numOfDatas; j++){

            tableRow = tableRows[0].getElementsByTagName("INPUT");
            result_x = parseFloat(tableRow[j+1].value);
            tableRow = tableRows[1].getElementsByTagName("INPUT");
            y = parseFloat(tableRow[j+1].value);
            if(isNaN(result_x) || isNaN(y)){break;}
            result_y = [y];

            for(i = 2; i < tableRows.length; i++){
                tableRow = tableRows[i].getElementsByTagName("INPUT");
                y = parseFloat(tableRow[j+1].value);
                if(isNaN(y)){break;}
                result_y.push(y);
            }
            result.push({
                x: result_x,
                y: result_y
            });
        }
        return result;
    }

    function setDatas(Data){
        aConfig.debug.string.text(" ");
        for(var i = aTable.rows.length; i > 0;i--)
        {
            aTable.deleteRow(i -1);
        }

        tableRows = [];
        numOfDatas = 1;

        tableRows[0] = addEmptyRowToTable();
        tableRows[1] = addEmptyRowToTable();

        addFirstCellToRow(tableRows[0], "x");
        addFirstCellToRow(tableRows[1], "y");
        addCellToRow(tableRows[0], Data.points[0].x);
        addCellToRow(tableRows[1], Data.points[0].y[0]);

        for(var i = 0; i <= Data.deriv_num; i++){
            tableRows[i] = addEmptyRowToTable();
        }

        for(var i = 0; i <= Data.points.length; i++){
            var dp = Data.points[i].x;
        }

    }

    aConfig.debug.string.text(" ");
    newTable();
    setDatas(senderData);

}
