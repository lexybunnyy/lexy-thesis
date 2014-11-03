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
        { x: 0, y: [0, 0, 2, 0]},
        { x: 1, y: [1, 2, 2, 0]},
        { x: 2, y: [4, 4, 2, 0]},
        { x: 3, y: [9, 6, 2, 0]},
        { x: 4, y: [16, 8, 2, 0]},
        { x: 5, y: [25, 10, 2, 0]},
        { x: 6, y: [36, 12, 2, 0]}
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
    var numOfPoints = 1; //TODO???
    var numOfDerivates = 0; //TODO???

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

    /** Létrehoz egy új táblázatot az alapértelmezett értékekkel */
    function newTable(){
        deleteTable();
        setPoints();
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
     *  TODO???: általánosítás értékre és az első sorok felvételére
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

    /**
     * Megkapjuk a táblázatban leírt pontok tömbjét
     *
     * @returns {Array} Default in JSON: [{"x":0,"y":[0]}]
     */
    function getPoints() {
        var result = [];
        var result_x = [];
        var result_y = [];
        var i, j, y;
        var tableRow = tableRows[0].getElementsByTagName("INPUT");

        for (j = 0; j < tableRow[1].length; j++) {
            tableRow = tableRows[0].getElementsByTagName("INPUT");
            result_x = parseFloat(tableRow[j + 1].value);
            tableRow = tableRows[1].getElementsByTagName("INPUT");
            y = parseFloat(tableRow[j + 1].value);
            if (isNaN(result_x) || isNaN(y)) {
                break;
            }
            result_y = [y];

            for (i = 2; i < tableRows.length; i++) {
                tableRow = tableRows[i].getElementsByTagName("INPUT");
                y = parseFloat(tableRow[j + 1].value);
                if (isNaN(y)) {
                    break;
                }
                result_y.push(y);
            }
            result.push({
                x: result_x,
                y: result_y
            });
        }
        return result;
    }


    /**Felveszünk egy sort, ha még nincs olyan, és az a következő*/
    function addNewRowAndLabel(index) {
        if (tableRows[index] || index !== tableRows.length) {
            return false;
        }
        tableRows[index] = addNewRowTagToTable();
        addCellToRow(tableRows[index], getRowLabel(index), true);
        return index;
    }

    /**
     * Feltölti a táblázatot egy adott tömb értékeivel
     * @param {Array || null} tableArray Default in JSON: [{"x":0,"y":[0]}]
     */
    function setPoints(tableArray) {
        deleteTable();
        var defaultArray = [{
            x: 0,
            y: [0]
        }];
        tableArray = tableArray || defaultArray;
        var numOfPoints = tableArray.length;

        addNewRowAndLabel(0);
        addNewRowAndLabel(1);
        for (var i = 0; i < numOfPoints; i++) {
            var point = tableArray[i];
            addCellToRow(tableRows[0], point.x);
            for (var j = 0; j < point.y.length; j++) {
                addNewRowAndLabel(j+1);
                addCellToRow(tableRows[j+1], point.y[j]);
            }
        }
    }


    /**Gombok eseményeinek lekezelése*/
    function configButtons() {
        aConfig.debug.button.onclick = function(){
            debugWriteObject(getPoints());
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

    /** getPoints public */
    that.getPoints = function () {
        return getPoints();
    };

    /** setPoints public */
    that.setPoints = function (tableArray) {
        setPoints(tableArray);
    };

    configButtons();
    setPoints(senderData.points);
    return that;

}
