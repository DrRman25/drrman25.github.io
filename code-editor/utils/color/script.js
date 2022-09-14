var c;

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

function convertColor(color) {
    c = w3color(color.replace(/;/g, ","));
    if (c.valid && color != "") {
        document.getElementById("color-input-text").value = color;
        document.getElementById("color-input-html").value = c.toHexString();
        document.getElementById("color-name").innerHTML = c.toName();
        if (!c.toName()) {
            document.getElementById("color-name").innerHTML = "No Name";
        }
        if (((color.indexOf("rgba") > -1 || color.indexOf("hsla") > -1) && color.split(",").length == 4)) {
            document.getElementById("type-rgb").innerHTML = "RGBA";
            document.getElementById("color-rgb").innerHTML = c.toRgbaString();
            document.getElementById("color-hex").innerHTML = c.toHexString();
            document.getElementById("type-hsl").innerHTML = "HSLA";
            document.getElementById("color-hsl").innerHTML = c.toHslaString();
        } else {
            document.getElementById("type-rgb").innerHTML = "RGB";
            document.getElementById("color-rgb").innerHTML = c.toRgbString();
            document.getElementById("color-hex").innerHTML = c.toHexString();
            document.getElementById("type-hsl").innerHTML = "HSL";
            document.getElementById("color-hsl").innerHTML = c.toHslString();
        }
        document.getElementById("sample-accent-color").style.accentColor = c.toRgbaString();
        document.getElementById("sample-background-color").style.backgroundColor = c.toRgbaString();
        document.getElementById("sample-border-color").style.borderColor = c.toRgbaString();
        document.getElementById("sample-color").style.color = c.toRgbaString();
        document.getElementById("sample-caret-color").style.caretColor = c.toRgbaString();
        document.getElementById("sample-outline-color").style.outlineColor = c.toRgbaString();
        document.getElementById("sample-text-decoration-color").style.textDecorationColor = c.toRgbaString();
    } else {
        document.getElementById("color-name").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("type-rgb").innerHTML = "RGB";
        document.getElementById("color-rgb").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("color-hex").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("type-hsl").innerHTML = "HSL";
        document.getElementById("color-hsl").innerHTML = "<span class='text-danger'>Wrong Input</span>";
    }
}

convertColor("rgb(255, 0, 0)");

setInterval(function() {
    if (document.getElementById("sample-background-color").style.color == "white") {
        document.getElementById("sample-background-color").style.color = "black";
    } else {
        document.getElementById("sample-background-color").style.color = "white";
    }
    if (document.getElementById("sample-border-color").style.borderStyle == "dotted") {
        document.getElementById("sample-border-color").style.borderStyle = "dashed";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "dashed") {
        document.getElementById("sample-border-color").style.borderStyle = "solid";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "solid") {
        document.getElementById("sample-border-color").style.borderStyle = "double";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "double") {
        document.getElementById("sample-border-color").style.borderStyle = "groove";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "groove") {
        document.getElementById("sample-border-color").style.borderStyle = "ridge";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "ridge") {
        document.getElementById("sample-border-color").style.borderStyle = "inset";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "inset") {
        document.getElementById("sample-border-color").style.borderStyle = "outset";
    } else if (document.getElementById("sample-border-color").style.borderStyle == "outset") {
        document.getElementById("sample-border-color").style.borderStyle = "dotted solid double dashed";
    } else {
        document.getElementById("sample-border-color").style.borderStyle = "dotted";
    }
    if (document.getElementById("sample-outline-color").style.outlineStyle == "dotted") {
        document.getElementById("sample-outline-color").style.outlineStyle = "dashed";
    } else if (document.getElementById("sample-outline-color").style.outlineStyle == "dashed") {
        document.getElementById("sample-outline-color").style.outlineStyle = "solid";
    } else if (document.getElementById("sample-outline-color").style.outlineStyle == "solid") {
        document.getElementById("sample-outline-color").style.outlineStyle = "double";
    } else if (document.getElementById("sample-outline-color").style.outlineStyle == "double") {
        document.getElementById("sample-outline-color").style.outlineStyle = "groove";
    } else if (document.getElementById("sample-outline-color").style.outlineStyle == "groove") {
        document.getElementById("sample-outline-color").style.outlineStyle = "ridge";
    } else if (document.getElementById("sample-outline-color").style.outlineStyle == "ridge") {
        document.getElementById("sample-outline-color").style.outlineStyle = "inset";
    } else if (document.getElementById("sample-outline-color").style.outlineStyle == "inset") {
        document.getElementById("sample-outline-color").style.outlineStyle = "outset";
    } else {
        document.getElementById("sample-outline-color").style.outlineStyle = "dotted";
    }
    if (document.getElementById("sample-color").style.backgroundColor == "white") {
        document.getElementById("sample-color").style.backgroundColor = "black";
    } else {
        document.getElementById("sample-color").style.backgroundColor = "white";
    }
    if (document.getElementById("sample-text-decoration-color").style.textDecorationLine == "underline") {
        document.getElementById("sample-text-decoration-color").style.textDecorationLine = "overline";
    } else if (document.getElementById("sample-text-decoration-color").style.textDecorationLine == "overline") {
        document.getElementById("sample-text-decoration-color").style.textDecorationLine = "line-through";
    } else {
        document.getElementById("sample-text-decoration-color").style.textDecorationLine = "underline";
    }
}, 1000);

setInterval(function() {
    if (document.getElementById("sample-background-color").style.textShadow == "rgb(68, 68, 68) 1px 1px 0px") {
        document.getElementById("sample-background-color").style.textShadow = "none";
    } else {
        document.getElementById("sample-background-color").style.textShadow = "rgb(68, 68, 68) 1px 1px 0px";
    }
}, 2000);

setInterval(function() {
    if (document.getElementById("sample-text-decoration-color").style.textDecorationStyle == "dotted") {
        document.getElementById("sample-text-decoration-color").style.textDecorationStyle = "dashed";
    } else if (document.getElementById("sample-text-decoration-color").style.textDecorationStyle == "dashed") {
        document.getElementById("sample-text-decoration-color").style.textDecorationStyle = "solid";
    } else if (document.getElementById("sample-text-decoration-color").style.textDecorationStyle == "solid") {
        document.getElementById("sample-text-decoration-color").style.textDecorationStyle = "double";
    } else if (document.getElementById("sample-text-decoration-color").style.textDecorationStyle == "double") {
        document.getElementById("sample-text-decoration-color").style.textDecorationStyle = "wavy";
    } else {
        document.getElementById("sample-text-decoration-color").style.textDecorationStyle = "dotted";
    }
}, 3000);