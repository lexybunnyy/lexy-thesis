/**
 * @param Array polynom - The polynom (eg: 2x+1 : [1,2], 2x^3 : [0,0,0,2])
 * @param Object plotFor
 *    @plotFor Number begin - The start of the polinome's grafic
 *    @plotFor Number end - The end of polinome graphic
 *    @plotFor Number step - The steps the point (precision)
 * @returns {Array}
 */
function make_plot_data(polinome, plotFor) {
    var polinome = polinome || [];
    //...
    var y, x, i;
    for (x = plotFor.begin; x <= plotFor.end; x += plotFor.step) {
        y = 0;
        for (i = 0; i < inData.polinome.length; ++i) {
            y += inData.polinome[i] * Math.pow(x, i);
        }
        dataPolinome.push([x, y]);
    }
    //...

    polinome.push({
        label: inData.name,
        data: dataPolinome,
        lines: { show: true }
    });

    return polinome;
}

var gTypePolinomePlot = {
    series: {
        line: { show: true }
        //I can show lines and points too
    },
    xaxis: {
        zoomRange: [0.1, 1],
        panRange: [-1000, 1000]
    },
    yaxis: {
        zoomRange: [0.1, 100],
        panRange: [-1000, 1000]
    },
    zoom: {
        interactive: true
    },
    pan: {
        interactive: true
    },
    grid: {
        hoverable: true,
        clickable: true
    }
};