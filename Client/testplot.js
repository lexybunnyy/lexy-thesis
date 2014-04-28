
$(function() {
    document.getElementsByName("input_coord_x")[0].value = 0;
    document.getElementsByName("input_coord_y")[0].value = 0;

    var placeholder = $("#resultplot");
    var plot = $.plot(placeholder, example_datas_some, my_type_test);
    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 0.80
    }).appendTo("body");

    $("#resultplot").bind("plothover", function (event, pos, item) {
        var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
        $("#hoverdata").text(str);

        if (item) {
           var x = item.datapoint[0].toFixed(2),
                 y = item.datapoint[1].toFixed(2);

                $("#tooltip").html(item.series.label + " of " + x + " = " + y)
                    .css({top: item.pageY+5, left: item.pageX+5})
                    .fadeIn(200);
        } else {
             $("#tooltip").hide();
        }

    });

    $("#resultplot").bind("plotclick", function (event, pos, item) {
        var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
        document.getElementsByName("input_coord_x")[0].value = pos.x.toFixed(2);
        document.getElementsByName("input_coord_y")[0].value = pos.y.toFixed(2);
        $("#clickdata").text(str);
    });

    document.getElementsByName("add_cordinate_button")[0].onclick=function(){
        var str2 = "("+ document.getElementsByName("input_coord_x")[0].value + " , ";
        str2 += document.getElementsByName("input_coord_y")[0].value + ")";
        $("#test_data_show").text(str2);
        $("#json_data_show").text(JSON.stringify(data2));
    }

    // Add the Flot version string to the footer
    $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});