

var zoomer_flot =  {
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

var interactive_flot =
{
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

var my_type_test =  {
    series: {
        line: { show: true }
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

function zoomer_flot_rows(placeholder,plot){

 // show pan/zoom messages to illustrate events
 placeholder.bind("plotpan", function (event, plot) {
 var axes = plot.getAxes();
 $(".message").html("Panning to x: "  + axes.xaxis.min.toFixed(2)
 + " &ndash; " + axes.xaxis.max.toFixed(2)
 + " and y: " + axes.yaxis.min.toFixed(2)
 + " &ndash; " + axes.yaxis.max.toFixed(2));
 });

 placeholder.bind("plotzoom", function (event, plot) {
 var axes = plot.getAxes();
 $(".message").html("Zooming to x: "  + axes.xaxis.min.toFixed(2)
 + " &ndash; " + axes.xaxis.max.toFixed(2)
 + " and y: " + axes.yaxis.min.toFixed(2)
 + " &ndash; " + axes.yaxis.max.toFixed(2));
 });
 // add zoom out button

 $("<div class='button' style='right:20px;top:20px'>zoom out</div>")
 .appendTo(placeholder)
 .click(function (event) {
 event.preventDefault();
 plot.zoomOut();
 });

 // and add panning buttons

 // little helper for taking the repetitive work out of placing
 // panning arrows

 function addArrow(dir, right, top, offset) {
 $("<img class='button' src='pictures/arrow-" + dir + ".gif' style='right:" + right + "px;top:" + top + "px'>")
 .appendTo(placeholder)
 .click(function (e) {
 e.preventDefault();
 plot.pan(offset);
 });
 }

 addArrow("left", 55, 60, { left: -100 });
 addArrow("right", 25, 60, { left: 100 });
 addArrow("up", 40, 45, { top: -100 });
 addArrow("down", 40, 75, { top: 100 });
}