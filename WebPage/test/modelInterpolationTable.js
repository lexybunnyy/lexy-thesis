/**
 * Created by oem on 2014.11.03..
 */
function testRefactor() {

    /**Vissza adja a táblázat egy elemének az értékét*/
    function getTableValue(row, column) {
        if (!tableRows[row]) {
            false;
        }
        var tableRow = tableRows[row].getElementsByTagName("INPUT");
        if (!column) {
            return tableRow;
        }
        return tableRow[column].value;
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


    /**Felveszünk egy sort, ha még nincs olyan, és az a következő*/
    function addNewRowAndLabel(index) {
        if (tableRows[index] || index !== tableRows.length) {
            return false;
        }
        tableRows[index] = addNewRowTagToTable();
        addCellToRow(tableRows[index], getRowLabel(index), true);
        return index;
    }

    /** Ad egy üres sort a táblázathoz
     *  Megadhatunk egy magasabb derivált értéket a pontokhoz
     * */
    function addNewRowToTable() {
        var index = tableRows.length;
        addNewRowAndLabel(index);
        for (var i = 0; i < numOfColumns; i++) {
            addCellToRow(tableRows[index], "-");
        }
    }


    /**
     * Megkapjuk a táblázatban leírt pontok tömbjét
     *
     * @returns {Object} Default in JSON: [{"x":0,"y":[0]}]
     */
    function getData() {
        var derivNum = 0;
        var resultPoints = [];
        var result_x = null;
        var result_y = [];
        var i, j, y;

        for (j = 0; j < numOfColumns; j++) {
            result_x = parseFloat(getTableValue(0)[j + 1].value);
            y = parseFloat(getTableValue(1)[j + 1].value);
            if (isNaN(result_x) || isNaN(y)) {
                break;
            }

            result_y = [y];
            for (i = 2; i < tableRows.length; i++) {
                y = parseFloat(getTableValue(i)[j + 1].value);
                if (isNaN(y)) {
                    break;
                }
                result_y.push(y);
            }
            if (derivNum <= result_y.length - 1) {
                derivNum = result_y.length - 1;
            }
            resultPoints.push({
                x: result_x,
                y: result_y
            });
        }
        return {
            points: getPoints(),
            deriv_num : derivNum
        };
    }
}