var d3 = require("./d3.min.js");
var $ = require("./jquery.min.js");
var _ = require("./underscore-min.js");

function PianoModel (width, height) {
    this.radius = 5;

    this.white = {
        keys: [
            "A0", "B0", "C1", "D1", "E1", "F1", "G1", "A1", "B1", "C2",
            "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3",
            "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4",
            "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6",
            "F6", "G6", "A6", "B6", "C7", "D7", "E7", "F7", "G7", "A7",
            "B7", "C8"
        ],
        width: 1,
        height: height
    };

    this.white.width = width / this.white.keys.length;

    this.black = {
        sharps: [
            "A#0", "C#1", "D#1", "F#1", "G#1",
            "A#1", "C#2", "D#2", "F#2", "G#2",
            "A#2", "C#3", "D#3", "F#3", "G#3",
            "A#3", "C#4", "D#4", "F#4", "G#4",
            "A#4", "C#5", "D#5", "F#5", "G#5",
            "A#5", "C#6", "D#6", "F#6", "G#6",
            "A#6", "C#7", "D#7", "F#7", "G#7",
            "A#7"
        ],
        flats: [
            "B_0", "D_1", "E_1", "G_1", "A_1",
            "B_1", "D_2", "E_2", "G_2", "A_2",
            "B_2", "D_3", "E_3", "G_3", "A_3",
            "B_3", "D_4", "E_4", "G_4", "A_4",
            "B_4", "D_5", "E_5", "G_5", "A_5",
            "B_5", "D_6", "E_6", "G_6", "A_6",
            "B_6", "D_7", "E_7", "G_7", "A_7",
            "B_7"
        ],
        width: this.white.width / 2,
        height: height * 0.6
    };

    this.pattern = [2, 1, 2, 1, 1];

    this.keys = [];

    var hasBlack = [true, false, true, true, false, true, true];
    var bi = 0;

    for (var i = 0; i < this.white.keys.length * 2-1; i++) {
        if (i % 2 == 0) {
            this.keys.push(this.white.keys[i/2]);
        } else {
            if (hasBlack[(i - 1) / 2 % hasBlack.length]) {
                this.keys.push(this.black.sharps[bi++]);
            }
        }
    }
}

exports.create = function (rootElement, notes) {
    var model = new PianoModel($(window).width(), 100);

    var activeKeys = _.filter(model.keys, function (key) {
        return _.filter(notes, function (note) {
            return key.indexOf(note) !== -1;
        }).length > 0;
    });

    function isActive (key) {
        return activeKeys.indexOf(key) !== -1;
    }

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
            model.radius,
            model.white.width,
            model.white.height);

        svg.append("defs").call(makeKeyTemplate,
            "black-key",
            model.radius,
            model.black.width,
            model.black.height);

        var w = $(window).width();
        var h = $(window).height();

        svg.attr("width", w);
        svg.attr("height", h);
        svg.attr("viewBox", "0 0 " + w + " " + h);

        for (var i = 0; i < model.white.keys.length; i++) {
            var type = "white-key";

            var key = model.white.keys[i];

            var x = i * model.white.width + model.white.width / 2;
            var y = model.white.height / 2;

            svg.append("use")
                .attr("xlink:href", "#" + type)
                .attr("class", type + (isActive(key)? " active" : ""))
                .attr("x", x)
                .attr("y", y);
        }

        var x = model.white.width;

        for (var i = 0; i < model.black.sharps.length; i++) {
            var type = "black-key";

            var sharpKey = model.black.sharps[i];
            var flatKey = model.black.flats[i];

            svg.append("use")
                .attr("xlink:href", "#" + type)
                .attr("class", type + (isActive(sharpKey) || isActive(flatKey))? " active" : ""))
                .attr("x", x)
                .attr("y", model.black.height / 2);

            x += model.pattern[i % model.pattern.length] * model.white.width;
        }
    });
};
