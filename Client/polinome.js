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
/**
 Olyan tömb vissza kapása amely a szeretett polinómot adja vissza
 **/

function make_plot_data(showerArray,inData,numDerivate, plotFor){
    var dataPoints = [];
    inData.points.forEach(function(point){
        dataPoints.push([point.x, point.y[numDerivate]])
    });

    var dataPolinome = [];
    var y, x,i;
    for (x = plotFor.begin; x <= plotFor.end; x += plotFor.step) {
        y = 0;
        for (i = 0; i < inData.polinome.length; ++i) {
            y += inData.polinome[i]*Math.pow(x,i);
        }
        dataPolinome.push([x,y]);
    }

    showerArray.push({
        label: inData.name,
        data: dataPolinome,
        lines: { show: true }
    });
    showerArray.push({
        label: inData.name,
        data: dataPoints,
        points: { show: true }
    });

    return showerArray;
}

function push_result_data(name, succ, result){
    var index =  preparing_datas.map(function(e){ return e.name}).indexOf(name);
    if(index >= 0){
        preparing_datas[index].succ = succ;
        preparing_datas[index].polinome = result;
    }
}

function show_reslut(data){
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


