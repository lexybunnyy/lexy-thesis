/**
 * Created by lexy on 2014.05.02..
 */
function prepare_datalist(aConfig){
    aConfig.debug.button.onclick=function(ebla){

        var myObject = {
            event: ebla,
            msg: "Hello"
        };
        var debugText = JSON.stringify(myObject);
        aConfig.debug.string.text(" " + debugText);

    }


}