/**
 * Created by lexy on 2014.04.28..
 */
function interpolationPlot(aConfig) {
    var that = this;

    var setInput = aConfig.setInput;
    var placeHolder = aConfig.plotDefaultSettings.placeholder;
    var tooltip = aConfig.plotDefaultSettings.tooltip;
    var gSettings = aConfig.plotGenerateSettings;

    var generaleMinMaxes = [
        ['xaxis','min'],
        ['xaxis','max'],
        ['yaxis','min'],
        ['yaxis','max']
    ];
	
	function setDefaultSettings() {
	    setInput.x.value = 0;
		setInput.y.value = 0;
		generaleMinMaxes.forEach(function(gen){
			var key = gen[0] + '_' + gen[1];
			gSettings[key].value = gen[1] === 'min' ? -2 : 2;
		});
        gSettings.precision.value = 0.1;
        gSettings.derivNum_max.value = 2;
	}

    function generateType(){
        var type = gSettings.defaultType || gTypePrepare;

        generaleMinMaxes.forEach(function(gen){
            var key = gen[0] + '_' + gen[1];
            var value = parseFloat(gSettings[key].value);
            if (! isNaN(value)) {
                type[gen[0]][gen[1]] = value;
            }
        });
        return type;
    }

    /** Legenerálja az adott pontokat, az interpolációs táblázatból
     *
     */
    function generatePointSet(tableArray, derivNum) {
        var resultArray = [];
        tableArray.forEach(function(point){
            resultArray.push([point.x, point.y[derivNum]]);
        });
        return {
            label: 'point (deriv : ' + derivNum + ')',
            data: resultArray,
            points: { show: true }
        }
    }

    function generateData(senderData, polynomial){
        var resultArray = [];
        var settings = aConfig.plotGenerateSettings;
        if (!senderData || (!settings.derivNum_max && !senderData.max_derivate)) {
            resultArray.push({
                label: 'point (deriv : 0)',
                data: [],
                points: { show: true }
            });
            return resultArray;
        }

        if (polynomial) {
            var begin = parseFloat(gSettings.xaxis_min.value);
            var end = parseFloat(gSettings.xaxis_max.value);
            var precision = parseFloat(gSettings.precision.value);            

            var plotFor = {
                begin: isNaN(begin) ? -3 : (begin - 1),
                end: isNaN(end) ? 3 : (end + 1),
                step: isNaN(precision) || precision <= 0 ? 0.1 : (precision)
            };

            resultArray.push({
                label: 'Eredmény polinm',
                data: makePolinome(polynomial, plotFor),
                lines: { show: true }
            });
        }

        var derivnumMax = senderData.max_derivate + 1;

        if (settings.derivNum_max){
            derivnumMax = parseFloat(settings.derivNum_max.value);
            if (isNaN(derivnumMax)) {
                derivnumMax = senderData.max_derivate;
            }
        }

        for (var i = 0; i < derivnumMax + 1; ++i){
            resultArray.push(generatePointSet(senderData.points, i));
        }

        return resultArray;
    }

    placeHolder.bind("plothover", function (event, pos, item) {
        var str = "* (" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ") *";
        aConfig.plotActionView.hoverdata.text(str);

        if (item) {
            var x = item.datapoint[0].toFixed(2),
                y = item.datapoint[1].toFixed(2);

            tooltip.html(item.series.label + " of " + x + " = " + y)
                .css({top: item.pageY+5, left: item.pageX+5})
                .fadeIn(200);
        } else {
            tooltip.hide();
        }
    });

    placeHolder.bind("plotclick", function (event, pos, item) {
        setInput.x.value = pos.x.toFixed(2);
        setInput.y.value = pos.y.toFixed(2);
    });

    //Frissíti a plotot a megadott értékek alapján
    that.refresh = function (points, polinomials) {
        $.plot(
            placeHolder,
            generateData(points, polinomials),
            generateType()
        );
    };
	
	that.getPlotSettings = function () {
		var result = {};
		generaleMinMaxes.forEach(function(gen){
			var key = gen[0] + '_' + gen[1];
			result[key] = gSettings[key].value;
		});
		result.derivNum_max = gSettings.derivNum_max.value;
        result.precision = gSettings.precision.value;
		return result;
	};
	
	that.setPlotSettings = function (setterValues) {
		setDefaultSettings();
		if (!setterValues) {
			return;
		}
		generaleMinMaxes.forEach(function(gen){
			var key = gen[0] + '_' + gen[1];
			gSettings[key].value = setterValues[key];
		});
		gSettings.derivNum_max.value = setterValues.derivNum_max;
        gSettings.precision.value = setterValues.precision;
	};
	
    return that;
}