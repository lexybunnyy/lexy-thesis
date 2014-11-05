/**
 * Created by lexy on 2014.11.04..
 *
{code}
 var debug = webPageDebug({
    buttonsIds: ['debug_button', 'debug_button2'],
    debugSpan: $("#debugSpanId")
});
 debug.writeObject('batman');
 debug.setFunctions([
 function(){
        debug.writeObject('batWoman1');
    },
 function(){
        debug.writeObject('batWoman2');
    }
 ]);
 debug.setFunction(0, function(){
    debug.writeObject('batWoman');
});
 {code}

 {code}
 <input type="button" name="debug_button" value="Click Debug">
 <input type="button" name="debug_button2" value="Click Debug2">
 <span id="debugSpanId"/>
 {code}

 * TODO: Use
 */


function webPageDebug (aConfig) {
    var that = this;
    var gEventButtons = [];

    aConfig.buttonsIds.forEach(function(id){
        gEventButtons.push(document.getElementsByName(id)[0]);
    });

    /**
     * Kiiratunk egy String-ben egy Objectet a debug-ra
     * Ez a funkció csak debug módban fog működni.
     * */
    that.writeObject  = function (obj) {
        var debugText = obj ? JSON.stringify(obj) : '';
        aConfig.debugSpan.text(" " + debugText);
    };

    /** Mozilla: Ctrl+Shift+C >Console */
    that.log = function(obj){
        var debugText = obj ? JSON.stringify(obj) : '';
        console.log(debugText);
    };

    function setFunction(back, index) {
        if (typeof back === 'function' && gEventButtons[index]) {
            gEventButtons[index].onclick = back;
        }
    }

    that.setFunction = function(index, back){
        setFunction(back, index);
    };

    that.setFunctions = function(backArray){
        backArray.forEach(function(back, index){
            setFunction(back, index);
        });
    };

    return that;
}