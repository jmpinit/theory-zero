var d3 = require("./d3.min.js");
var $ = require("./jquery.min.js");

exports.model = {
    radius: 5, // TODO rounded bottoms
    white: {
        width: 20,
        height: 100
    },
    black: {
        width: 14,
        height: 60
    }
};

exports.create = function (rootElement) {
    var path = {
        move: function (x, y) {
            return ["M", x, y].join(" ");
        },
        line: function (x, y) {
            return ["L", x, y].join(" ");
        },
        arc: function (r, x, y) {
            return ["A", r, r, 0, 0, 0, x, y].join(" ");
        },
        close: function (x, y) {
            return "Z"
        }
    }

    function makeKeyTemplate (selection, id, r, w, h) {
        var cw = w / 2;
        var ch = h / 2;

        var desc = [
            path.move(-cw, -ch),
            path.line(-cw, ch - r),
            path.arc(r, -(cw - r), ch),
            path.line(cw - r, ch),
            path.arc(r, cw, ch - r),
            path.line(cw, -ch),
            path.close()
        ].join(" ");

        selection
            .append("g")
            .attr("id", id)
                .append("path")
                .attr("d", desc);
    }

    d3.xml("piano.svg", "image/svg+xml", function (xml) {
        var svg = rootElement.append("svg");

        svg.append("defs").call(makeKeyTemplate,
            "white-key",
            exports.model.radius,
            exports.model.white.width,
            exports.model.white.height);

        svg.append("defs").call(makeKeyTemplate,
            "black-key",
            exports.model.radius,
            exports.model.black.width,
            exports.model.black.height);

        var w = $(window).width();
        var h = $(window).height();

        svg.attr("width", w);
        svg.attr("height", h);
        svg.attr("viewBox", "0 0 " + w + " " + h);

        var numWhiteKeys = 52;

        for (var i = 0; i < numWhiteKeys; i++) {
            var type = "white-key";

            svg.append("use")
                .attr("xlink:href", "#" + type)
                .attr("class", type)
                .attr("x", i * exports.model.white.width + exports.model.white.width / 2)
                .attr("y", exports.model.white.height / 2);
        }

        var pattern = [2, 1, 2, 1, 1];
        var numBlackKeys = 36;
        var x = exports.model.white.width;

        for (var i = 0; i < numBlackKeys; i++) {
            var type = "black-key";

            svg.append("use")
                .attr("xlink:href", "#" + type)
                .attr("class", type)
                .attr("x", x)
                .attr("y", exports.model.black.height / 2);

            x += pattern[i % pattern.length] * exports.model.white.width;
        }
    });
};
