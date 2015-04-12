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
    max_derivate: 3,
    num_of_points: 7,
    num_of_rows : 5,
    num_of_cols : 8
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
    var that = {};
    var gTable = aConfig.table;
    var gDebug = aConfig.debug;
    var gFirstCellForm = {
        "type" :  "text",
        "disabled": "true"
    };

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

    /** Létrehoz egy új táblázatot az alapértelmezett értékekkel */
    function newTable(){
        setPoints();
    }

    /**
     * Megkapjuk a pontokat és az adatokat
     * @returns {Object}
     */
    function getData(notCheckY) {
        var points = [];
        var result_x = null;
        var result_y = [];
        var i, j, y;
        var maxDerivate = 0;

        for (j = 0; j <= gTable.getNumOfCols(); j++) {
            result_x = parseFloat(gTable.getValue(0, j + 1));
            y = parseFloat(gTable.getValue(1, j + 1));
            if ( isNaN(result_x) || (!notCheckY && isNaN(y)) ) {
                break;
            }
            result_y = [y];

            for (i = 2; i < gTable.getNumOfRows(); i++) {
                y = parseFloat(gTable.getValue(i, j + 1));
                if (!notCheckY && (isNaN(y))) {
                    break;
                }
                result_y.push(y);
            }
            if (maxDerivate < result_y.length - 1) {
                maxDerivate = result_y.length - 1;
            }
            points.push({
                x: result_x,
                y: result_y
            });
        }
        return {
            points : points,
            num_of_points: points.length,
            max_derivate: maxDerivate,
            num_of_cols: gTable.getNumOfCols(),
            num_of_rows: gTable.getNumOfRows()
        };
    }

    /** Feltölti a táblázatot egy adott tömb értékeivel
     * @param {Array} [tableArray] Default in JSON: [{"x":0,"y":[0]}]
     * @param {number} [aNumOfRows]
     * @param {number} [aNumOfCols]
     */
    function setPoints(tableArray, aNumOfRows, aNumOfCols) {
        var defaultArray = [{
            x: 0,
            y: [0]
        }];
        tableArray = tableArray || defaultArray;
        var numOfPoints = aNumOfCols ? aNumOfCols - 1 : tableArray.length;

        gTable.addNewTableOneCell(getRowLabel(0));
        gTable.setCellForm(0,0, gFirstCellForm);
        for (var i = 0; i < numOfPoints; i++) {
            var point = tableArray[i];
            gTable.addNewColumnToTable();
            if (point && !isNaN(Number(point.x))) {
                gTable.setValue(0, i + 1,  point.x);
            }
            var numOfY = aNumOfRows ? aNumOfRows - 1 : point.y.length;
            for (var j = 0; j < numOfY; j++) {
                if (!gTable.getRow(j + 1)) {
                    gTable.addNewRowToTable();
                    gTable.setValue(j + 1, 0, getRowLabel(j + 1), gFirstCellForm);
                }
                var checkY = point && point.y && !isNaN(Number(point.y[j]));
                if (checkY) {
                    gTable.setValue(j + 1, i + 1,  point.y[j]);
                }
            }
        }
    }

    function addPoint(x, y, drN) {
        drN = drN | 0;
        var updateData = getData(true);
        var isNewX = true;
        updateData.points.forEach(function(data){
            if(data.x === x) {
                data.y[drN] = y;
                isNewX = false;
            }
        });

        if (isNewX) {
            var newPoint = {};
            newPoint.x = x;
            newPoint.y = [];
            newPoint.y[drN] = y;
            updateData.points.push(newPoint);
        }

        setPoints(updateData.points);
    }

    /**Gombok eseményeinek lekezelése*/
    function configButtons() {
        gDebug.setFunction(0,function(){
            gDebug.writeObject(that.getData());
        });
        aConfig.newTableButton.onclick = function(){
            newTable();
        };
        aConfig.addColumnButton.onclick=function(){
            gTable.addNewColumnToTable();
        };

        aConfig.addRowButton.onclick = function(){
            var newRowIndex = gTable.addNewRowToTable();
            gTable.setValue(newRowIndex, 0, getRowLabel(newRowIndex), gFirstCellForm);
        };
    }

    /** getPoints public */
    that.getPoints = function () {
        return getData().points;
    };

    /** getData public */
    that.getData = function () {
        return getData();
    };

    that.setData = function (data) {
        if (!data) {
            setPoints();
            return;
        }
        setPoints(data.points, data.num_of_rows, data.num_of_cols);
    };

    /** setPoints public */
    that.setPoints = function (tableArray) {
        setPoints(tableArray);
    };

    that.addPoint = function (x, y, dn) {
        addPoint(x, y, dn);
    };

    configButtons();
    that.setData();

    return that;
}
