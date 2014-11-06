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