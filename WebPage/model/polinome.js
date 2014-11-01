/**
 var res_data1 = {
        name: 'data1',
        points: [
            { x: 0, y: [0]},
            { x: 1, y: [1]},
            { x: 3, y: [3]}
        ],
        deriv_num: 0,
        type: 0,
        inverse: false,
        succ: true,
        polinome: [0,1]
    };

 _this.example_datas_some = [{
        data: d4,
        lines: { show: true }
    }, {
        data: d3,
        points: { show: true }
    }];


 * Created by lexy on 2014.03.30..
 *
 * polinome rajzoló: polinome_data segítségével vissza adunk egy
 * olyan tömböt, amely
 */

/** Olyan tömb vissza kapása amely a szeretett polinómot adja vissza
 * @param showerArray
 * @param inData
 * @param numDerivate
 * @param plotFor
 * @returns {*}
 */
function make_plot_data(showerArray, inData, numDerivate, plotFor){
    var dataPoints = [];
    inData.points.forEach(function(point){
        dataPoints.push([point.x, point.y[numDerivate]])
    });

    showerArray.push({
        label: inData.name,
        data: makePolinome(inData.polinome, plotFor),
        lines: { show: true }
    });

    showerArray.push({
        label: inData.name,
        data: dataPoints,
        points: { show: true }
    });

    return showerArray;
}

function makePolinome(inPolinome, plotFor){
    var dataPolinome = [];
    var y, x,i;
    for (x = plotFor.begin; x <= plotFor.end; x += plotFor.step) {
        y = 0;
        for (i = 0; i < inPolinome.length; ++i) {
            y += inPolinome[i]*Math.pow(x,i);
        }
        dataPolinome.push([x,y]);
    }
    return dataPolinome;
}

/**
 * @param polinomesObject
 * @param plotFor
 */
function generateForExamplePolinomes(polinomesObject, plotFor, debugstr){
    plotFor = plotFor || {
        begin: -10,//-1000,
        end: 10,//1000,
        step:  0.5//0.01
    };
    var result = [];
    polinomesObject.forEach(function(polinome){
        var resPlotData = {
            label: polinome.label,
            data: makePolinome(polinome.polinome, plotFor),
            lines: { show: true }
        };
        result.push(resPlotData);
    });
    return result;
}

function push_result_data(name, succ, result){
    var index =  preparing_datas.map(function(e){ return e.name}).indexOf(name);
    if(index >= 0){
        preparing_datas[index].succ = succ;
        preparing_datas[index].polinome = result;
    }
}

function show_reslut(data) {
    var resluts = [];
    for (var i = 0; i < data.length; ++i) {
        resluts.push({
                data:  polinome_data( -50, 50, 0.05, data[i] ),
                label: "polinome_" + i,
                lines: { show: true }
            }
        );
    }
}


