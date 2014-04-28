/**
 * Created by lexy on 2014.03.30..
 *
 * polinome rajzoló: polinome_data segítségével vissza adunk egy
 * olyan tömböt, amely
 */
function drawpolinome(x, poliarray) {
    var res = 0;
    for (var i = 0; i < poliarray.length; ++i) {
        res += poliarray[i]*Math.pow(x,i);
    }
    return res;
}

/**
Olyan tömb vissza kapása amely a szeretett polinómot adja vissza
**/
function polinome_data(begin, end, step, poliarray){
    var d1 = [];
    for (var x = begin; x <= end; x += step) {
        d1.push( [x, drawpolinome(x, poliarray)] );
    }
    return d1;
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
                data:  polinome_data( -50, 50, 0.05, data.[i] ),
                label: "polinome_" + i,
                lines: { show: true }
            }
        );
    }
}


