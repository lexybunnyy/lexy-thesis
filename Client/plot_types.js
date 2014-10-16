/**
 *
 * */

var gTypeZoomer =  {
    series: {
        lines: {
            show: true
        },
        shadowSize: 0
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
    }
};

var gTypeInteract = {
    series: {
        lines: {
            show: true
        },
        points: {
            show: true
        }
    },
    grid: {
        hoverable: true,
        clickable: true
    },
    yaxis: {
        min: -1.2,
        max: 1.2
    }
};

var gTypeInterpolationPlot =  {
    series: {
        line: { show: true }
    },
    xaxis: {
        zoomRange: [0.1, 1],
        panRange: [0, 1000]
    },
    yaxis: {
        zoomRange: [0.1, 100],
        panRange: [0, 1000]
    },
    zoom: {
        //interactive: true
    },
    pan: {
        //interactive: true
    },
    grid: {
        hoverable: true,
        clickable: true
    }
};
