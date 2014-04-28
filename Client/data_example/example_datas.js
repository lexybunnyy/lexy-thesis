/**
 * Created by lexy on 2014.03.31..
 */

//-----------------------------------example_sincos
var example_sincos = [];
var i;

var sin = [],
    cos = [];
for (i = 0; i < 14; i += 0.5) {
    sin.push([i, Math.sin(i)]);
    cos.push([i, Math.cos(i)]);
}
example_sincos.push(sin);
example_sincos.push(cos);

//-----------------------------------example_datas_some, example_datas
var d1 = [];
for (i = 0; i < 14; i += 0.5) {
    d1.push([i, Math.sin(i)]);
}

var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

var d3 = [];
for (i = 0; i < 14; i += 0.5) {
    d3.push([i, Math.cos(i)]);
}

var d4 = [];
for (i = 0; i < 14; i += 0.1) {
    d4.push([i, Math.sqrt(i * 10)]);
}

var d5 = [];
for (i = 0; i < 14; i += 0.5) {
    d5.push([i, Math.sqrt(i)]);
}

var d6 = [];
for (i = 0; i < 14; i += 0.5 + Math.random()) {
    d6.push([i, Math.sqrt(2*i + Math.sin(i) + 5)]);
}



var example_datas_some = [{
    data: d4,
    lines: { show: true }
}, {
    data: d3,
    points: { show: true }
}];

var example_datas = [{
    data: d1,
    lines: { show: true, fill: true }
}, {
    data: d2,
    bars: { show: true }
}, {
    data: d3,
    points: { show: true }
}, {
    data: d4,
    lines: { show: true }
}, {
    data: d5,
    lines: { show: true },
    points: { show: true }
}, {
    data: d6,
    lines: { show: true, steps: true }
}];


//-------------------------------example_prepare(interpolation_data)
var interpolation_data = []; // = [data1,data2];

var data1 = {
    name: 'data1',
    points: [
        { x: 0, y: [0]},
        { x: 1, y: [1]},
        { x: 3, y: [3]}
    ],
    deriv_num: 0,
    type: 0,
    inverse: false
};

var data2 = {
    name: 'data2',
    points: [
        { x: 0, y: [0]},
        { x: 1, y: [1]},
        { x: 3, y: [9]}
    ],
    derivative_num: 0,
    type: 0,
    inverse: false
};

interpolation_data.push(data1);
interpolation_data.push(data2);

//-------------------------------example_result(interpolation_data)
push_result_data('data1', true, [0,1]);
push_result_data('data2', true, [0,0,1]);
var result_data = [];
result_data.push(data1);
result_data.push(data2);

//JSON.stringify(result_data,null,2);