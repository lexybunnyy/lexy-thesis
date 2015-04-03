/**
 * Created by oem on 2014.11.06..
 */

var Base = {};

Base.get = function (name, by) {
    switch (by) {
        case 'id':
            return document.getElementById(name);
        case 'name':
            return document.getElementsByName(name)[0];
        default :
            return document.getElementsByName(name)[0];
    }
};

Base.erlangJSON = function (Obj) {
    var JsonObj = JSON.stringify(Obj, function(key, value){
        return value;
    });
    var res = JsonObj.replace(/"/g, '\\"');
    console.log(res);
};

Base.forEach = function(object, callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            callback(key, object[key]);
        } 
    }
}
