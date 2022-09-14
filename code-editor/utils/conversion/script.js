function convertUnit(defaultSize, conversionSize) {
    if (defaultSize.endsWith("px") && conversionSize.endsWith("px") && defaultSize.replace("px", "") == parseFloat(defaultSize.replace("px", "")) && conversionSize.replace("px", "") == parseFloat(conversionSize.replace("px", "")) && defaultSize.replace("px", "") == defaultSize.replace("px", "").trim() && conversionSize.replace("px", "") == conversionSize.replace("px", "").trim()) {
        defaultSize = parseFloat(defaultSize.replace("px", ""));
        conversionSize = parseFloat(conversionSize.replace("px", ""));
        document.getElementById("unit-px").textContent = Number(conversionSize.toFixed(4)) + "px";
        document.getElementById("unit-pt").textContent = Number((conversionSize * 0.75).toFixed(4)) + "pt";
        document.getElementById("unit-cm").textContent = Number(((conversionSize / 96) * 2.54).toFixed(4)) + "cm";
        document.getElementById("unit-in").textContent = Number((conversionSize / 96).toFixed(4)) + "in";
        document.getElementById("unit-em").textContent = Number((conversionSize / defaultSize).toFixed(4)) + "em";
        document.getElementById("unit-percent").textContent = Number(((conversionSize / defaultSize) * 100).toFixed(2)) + "%";
    } else if (defaultSize.endsWith("px") && conversionSize.endsWith("pt") && defaultSize.replace("px", "") == parseFloat(defaultSize.replace("px", "")) && conversionSize.replace("pt", "") == parseFloat(conversionSize.replace("pt", "")) && defaultSize.replace("px", "") == defaultSize.replace("px", "").trim() && conversionSize.replace("pt", "") == conversionSize.replace("pt", "").trim()) {
        defaultSize = parseFloat(defaultSize.replace("px", ""));
        conversionSize = parseFloat(conversionSize.replace("pt", ""));
        document.getElementById("unit-px").textContent = Number((conversionSize / 0.75).toFixed(4)) + "px";
        document.getElementById("unit-pt").textContent = Number(conversionSize.toFixed(4)) + "pt";
        document.getElementById("unit-cm").textContent = Number(((conversionSize / 72) * 2.54).toFixed(4)) + "cm";
        document.getElementById("unit-in").textContent = Number((conversionSize / 72).toFixed(4)) + "in";
        document.getElementById("unit-em").textContent = Number((conversionSize / defaultSize / 0.75).toFixed(4)) + "em";
        document.getElementById("unit-percent").textContent = Number(((conversionSize / defaultSize / 0.75) * 100).toFixed(2)) + "%";
    } else if (defaultSize.endsWith("px") && conversionSize.endsWith("cm") && defaultSize.replace("px", "") == parseFloat(defaultSize.replace("px", "")) && conversionSize.replace("cm", "") == parseFloat(conversionSize.replace("cm", "")) && defaultSize.replace("px", "") == defaultSize.replace("px", "").trim() && conversionSize.replace("cm", "") == conversionSize.replace("cm", "").trim()) {
        defaultSize = parseFloat(defaultSize.replace("px", ""));
        conversionSize = parseFloat(conversionSize.replace("in", ""));
        document.getElementById("unit-px").textContent = Number(((conversionSize * 96) / 2.54).toFixed(4)) + "px";
        document.getElementById("unit-pt").textContent = Number(((conversionSize * 72) / 2.54).toFixed(4)) + "pt";
        document.getElementById("unit-cm").textContent = Number(conversionSize.toFixed(4)) + "cm";
        document.getElementById("unit-in").textContent = Number((conversionSize / 2.54).toFixed(4)) + "in";
        document.getElementById("unit-em").textContent = Number((((conversionSize / defaultSize) * 96) / 2.54).toFixed(4)) + "em";
        document.getElementById("unit-percent").textContent = Number((((conversionSize / defaultSize) * 9600) / 2.54).toFixed(2)) + "%";
    } else if (defaultSize.endsWith("px") && conversionSize.endsWith("in") && defaultSize.replace("px", "") == parseFloat(defaultSize.replace("px", "")) && conversionSize.replace("in", "") == parseFloat(conversionSize.replace("in", "")) && defaultSize.replace("px", "") == defaultSize.replace("px", "").trim() && conversionSize.replace("in", "") == conversionSize.replace("in", "").trim()) {
        defaultSize = parseFloat(defaultSize.replace("px", ""));
        conversionSize = parseFloat(conversionSize.replace("in", ""));
        document.getElementById("unit-px").textContent = Number((conversionSize * 96).toFixed(4)) + "px";
        document.getElementById("unit-pt").textContent = Number((conversionSize * 72).toFixed(4)) + "pt";
        document.getElementById("unit-cm").textContent = Number((conversionSize * 2.54).toFixed(4)) + "cm";
        document.getElementById("unit-in").textContent = Number(conversionSize.toFixed(4)) + "in";
        document.getElementById("unit-em").textContent = Number(((conversionSize / defaultSize) * 96).toFixed(4)) + "em";
        document.getElementById("unit-percent").textContent = Number(((conversionSize / defaultSize) * 9600).toFixed(2)) + "%";
    } else if (defaultSize.endsWith("px") && conversionSize.endsWith("em") && defaultSize.replace("px", "") == parseFloat(defaultSize.replace("px", "")) && conversionSize.replace("em", "") == parseFloat(conversionSize.replace("em", "")) && defaultSize.replace("px", "") == defaultSize.replace("px", "").trim() && conversionSize.replace("em", "") == conversionSize.replace("em", "").trim()) {
        defaultSize = parseFloat(defaultSize.replace("px", ""));
        conversionSize = parseFloat(conversionSize.replace("em", ""));
        document.getElementById("unit-px").textContent = Number((conversionSize * defaultSize).toFixed(4)) + "px";
        document.getElementById("unit-pt").textContent = Number((conversionSize * defaultSize * 0.75).toFixed(4)) + "pt";
        document.getElementById("unit-cm").textContent = Number((((conversionSize * defaultSize) / 96) * 2.54).toFixed(4)) + "cm";
        document.getElementById("unit-in").textContent = Number(((conversionSize * defaultSize) / 96).toFixed(4)) + "in";
        document.getElementById("unit-em").textContent = Number(conversionSize.toFixed(4)) + "em";
        document.getElementById("unit-percent").textContent = Number((conversionSize * 100).toFixed(2)) + "%";
    } else if (defaultSize.endsWith("px") && conversionSize.endsWith("%") && defaultSize.replace("px", "") == parseFloat(defaultSize.replace("px", "")) && conversionSize.replace("%", "") == parseFloat(conversionSize.replace("%", "")) && defaultSize.replace("px", "") == defaultSize.replace("px", "").trim() && conversionSize.replace("%", "") == conversionSize.replace("%", "").trim()) {
        defaultSize = parseFloat(defaultSize.replace("px", ""));
        conversionSize = parseFloat(conversionSize.replace("%", ""));
        document.getElementById("unit-px").textContent = Number(((conversionSize / 100) * defaultSize).toFixed(4)) + "px";
        document.getElementById("unit-pt").textContent = Number(((conversionSize / 100) * defaultSize * 0.75).toFixed(4)) + "pt";
        document.getElementById("unit-cm").textContent = Number((((conversionSize / 9600) * defaultSize) * 2.54).toFixed(4)) + "cm";
        document.getElementById("unit-in").textContent = Number(((conversionSize / 9600) * defaultSize).toFixed(4)) + "in";
        document.getElementById("unit-em").textContent = Number((conversionSize / 100).toFixed(4)) + "em";
        document.getElementById("unit-percent").textContent = Number(conversionSize.toFixed(2)) + "%";
    } else {
        document.getElementById("unit-px").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("unit-pt").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("unit-cm").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("unit-in").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("unit-em").innerHTML = "<span class='text-danger'>Wrong Input</span>";
        document.getElementById("unit-percent").innerHTML = "<span class='text-danger'>Wrong Input</span>";
    }
}