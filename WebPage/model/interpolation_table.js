/**
 * Created by lexy on 2014.04.29..
 *
 * Interpolációs Táblázat
 *
 {code}
     var config = {};
     config.debug = {};
     config.debug.string = $("#json_debug");
     config.debug.button = document.getElementsByName("debug_button")[0];
     config.addRowButton = document.getElementsByName("addcolumn_button")[0];
     config.addColumnButton = document.getElementsByName("addrow_button")[0];
     config.newTableButton = document.getElementsByName("refresh_button")[0];
     config.table = document.getElementById("myTable");
     table(config);
 {code}
 */

var senderData = {
    points: [
        { x: 0, y: [0]},
        { x: 1, y: [1]},
        { x: 3, y: [9]}
    ],
    deriv_num: 0
};

/** Interpolációs Táblázat logikája
 * @param aConfig
 * @aConfig debug : opcionális kiiratás
 * @aConfig addRowButton : input button hivatkozás : Új sor felvétele gomb
 * @aConfig addColumnButton : input button tag hivatkozás : Új oszlop felvétele gomb
 * @aConfig newTableButton : input button tag hivatkozás : Új táblázat felvétele gomb
 * @aConfig table : table tag hivatkozás : maga a táblázat
 * @returns {interpolationTable}
 */
function interpolationTable(aConfig){
    var that = this;
    var aTable = aConfig.table;
    var tableRows = [];
    var numOfPoints = 1; //TODO
    var numOfDerivates = 0; //TODO

    /**
     * Kiiratunk egy String-ben egy Objectet a debug-ra
     * Ez a funkció csak debug módban fog működni.
     * */
    function debugWriteObject(obj) {
        var debugText = obj ? JSON.stringify(obj) : '';
        aConfig.debug.string.text(" " + debugText);
    }

    /** Megadjuk az első cella értékét (sor címkéje)
     * @param rowIndex a sor indexe (hányadik sorban vagyunk)
     * @returns {string}
     */
    function getRowLabel(rowIndex) {
        var firstCellLabel = "y(" + ( rowIndex - 1 ) + ")";
        if (rowIndex === 0) {
            firstCellLabel = 'x'
        }
        if (rowIndex === 1) {
            firstCellLabel = 'y'
        }
        return firstCellLabel;
    }

    /** Teljesen törli a táblázatot */
    function deleteTable() {
        for (var i = aTable.rows.length; i > 0; i--) {
            aTable.deleteRow(i - 1);
        }
        tableRows = [];
        numOfPoints = 0;
        numOfDerivates = 0;
    }

    /** Létrehoz egy új táblázatot az alapértelmezett értékekkel
     *  TODO addNewRowToTable call*/
    function newTable(){
        deleteTable();
        numOfPoints = 1;
        numOfDerivates = 0;
        tableRows[0] = addNewRowTagToTable();
        tableRows[1] = addNewRowTagToTable();

        addCellToRow(tableRows[0], "x", true);
        addCellToRow(tableRows[1], "y", true);
        addCellToRow(tableRows[0], 0.00);
        addCellToRow(tableRows[1], 0.00);
    }

    /**Make New tag
     * @returns {HTMLElement}
     */
    function addNewRowTagToTable() {
        var newRow = document.createElement("TR");
        aTable.appendChild(newRow);
        return newRow;
    }

    /** Ad egy üres sort a táblázathoz
     *  Megadhatunk egy magasabb derivált értéket a pontokhoz
     *  TODO: általánosítás értékre és az első sorok felvételére
     * */
    function addNewRowToTable() {
        var index = tableRows.length;
        var variableLabel = "y(" + ( index - 1 ) + ")";
        tableRows[index] = addNewRowTagToTable();
        addCellToRow(tableRows[index], variableLabel, true);
        for (var i = 0; i < numOfPoints; i++) {
            addCellToRow(tableRows[index], "-");
        }
    }

    /** Add egy üres cellát a sorhoz  */
    function addCellToRow(row, str, firstCell) {
        var cell = document.createElement("TD");
        var textInput = document.createElement("INPUT");
        textInput.setAttribute("type", "text");
        if (firstCell) {
            textInput.setAttribute("disabled", "true");
        }
        textInput.value = str;
        cell.appendChild(textInput);
        row.appendChild(cell);
        return cell;
    }

    /** Ad egy üres oszlopot a táblázathoz
     *  Megadunk egy új pontot
     **/
    function addEmptyColumnToTable(){
        ++numOfPoints;
        tableRows.forEach(function(row){
            addCellToRow(row , "-");
        });
    }

    /**Gombok eseményeinek lekezelése*/
    function configButtons() {
        aConfig.debug.button.onclick = function(){
            debugWriteObject(that.getPoints());
        };
        aConfig.newTableButton.onclick = function(){
            debugWriteObject();
            newTable();
        };
        aConfig.addColumnButton.onclick=function(){
            addEmptyColumnToTable();
        };

        aConfig.addRowButton.onclick = function(){
            addNewRowToTable();
        };
    }

    /**
     * Megkapjuk a táblázatban leírt pontok tömbjét
     *
     * @returns {Array} Default in JSON: [{"x":0,"y":[0]}]
     */
    that.getPoints = function () {
        var result = [];
        var result_x = [];
        var result_y = [];
        var i, j, y;
        var tableRow = tableRows[0].getElementsByTagName("INPUT");

        for (j = 0; j < numOfPoints; j++) {
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

    /**
     * TODO, ez még nem működik! Javítani + refaktor
     * Beállítjuk a Táblázatot egy adathalmaz alapján
     * {Array} Default in JSON: [{"x":0,"y":[0]}]
     */
    that.setPoints = function (tableArray) {
        deleteTable();
        var defaultArray = [{
            x : 0,
            y : [0]
        }];
        tableArray = tableArray || defaultArray;

        numOfPoints = tableArray.length;
        tableRows[0] = addNewRowTagToTable();
        addCellToRow(tableRows[0], getRowLabel(0), true);

        tableRows[1] = addNewRowTagToTable();
        addCellToRow(tableRows[1], getRowLabel(1), true);
        var tableRow = null;
        for (var j = 0; j < numOfPoints; j++) {
            for (var i = 0; i < numOfPoints; i++) {
                if (!tableRows[i]) {
                    tableRows[i] = addNewRowTagToTable();
                    addCellToRow(tableRows[i], getRowLabel(i), true);
                    numOfDerivates = i - 1;
                }
                tableRow = tableRows[i].getElementsByTagName("INPUT");
                if(i === 0){
                    tableRow[i+1].value = parseFloat(defaultArray[j].y[i]);

                }else {
                    tableRow[j+1].value = parseFloat(defaultArray[j].x);
                }
            }
        }
    }

    configButtons();
    newTable();
    //that.setPoints();
    return that;

}
