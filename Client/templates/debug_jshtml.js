/**
 * Created by lexy on 2014.04.29..
 */

function table(aConfig){

    aConfig.debug.button.onclick=function(ebla){

        var myObject = {
            event: ebla,
            msg: "Hello"
        };
        var debugText = JSON.stringify(myObject);
        aConfig.debug.string.text(" " + debugText);

    }

}
