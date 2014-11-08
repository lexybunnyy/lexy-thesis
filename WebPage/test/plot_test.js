/**
 * Created by lexy on 2014.04.28..
 */


function interpolationPlot(aConfig) {
	var that = this;
    var examples = example_datas();
    var setInput = aConfig.setInput;
    var placeHolder = aConfig.plotDefaultSettings.placeholder;
    var tooltip = aConfig.plotDefaultSettings.tooltip;
    setInput.x.value = 0;
    setInput.y.value = 0;

    var showerArray = [];
    var plotFor = {
        begin: -3.5,//-1000,
        end: 3.5,//1000,
        step: 0.01//0.01
    };
	
	function generateType(){
		var settings = aConfig.plotGenerateSettings;
		var type = settings.defaultType || gTypePrepare;
		
		var generale = [
			['xaxis','min'],
			['xaxis','max'],
			['yaxis','min'],
			['yaxis','max']
		];
		generale.forEach(function(gen){
			var key = gen[0] + '_' + gen[1];
			var value = parseFloat(settings[key].value);
			if (! isNaN(value)) {
				type[gen[0]][gen[1]] = value;
			}
		})
		return type;
	}

    //var result = generateForExamplePolinomes(examples.polinomesObject1, plotFor);
    //var result2 = make_plot_data(showerArray, examples.proj_res_data[1], 0, plotFor);

	/*
    result.push({
        label: 'points',
        data: [[0,0], [1,1], [-1,1],[-3,9],[3,9]],
        points: { show: true }
    });*/

	var points = [];

	//When hover show (from Flot example)
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
	
	/** Legenerálja az adott pontokat, az interpolációs táblázatból
	 *
	 */
	function generatePointSet(tableArray, derivNum) {
		resultArray = [];
		tableArray.forEach(function(point){
			resultArray.push([point.x, point.y[derivNum]]);
		});
		return {
			label: 'point (deriv : ' + derivNum + ')',
			data: resultArray,
			points: { show: true }
		}
	}

	function generateData(senderData){
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
	
	//Frissíti a plotot a megadott értékek alapján
	that.refresh = function (points) {
	    $.plot( 
			placeHolder,
			generateData(points), 
			generateType()
		);
	};
	that.refresh(senderData);
	
	return that;
};
