// for constructing SVG paths

exports.move = function (x, y) {
    return ["M", x, y].join(" ");
}

exports.line = function (x, y) {
    return ["L", x, y].join(" ");
}

exports.arc = function (r, x, y) {
    return ["A", r, r, 0, 0, 0, x, y].join(" ");
}

exports.close = function (x, y) {
    return "Z"
}
