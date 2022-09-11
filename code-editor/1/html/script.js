function warnLeaveSite() {
    return "";
}

if (document.getElementById("tab-size-range").value == 4) {
    document.getElementById('tab-size-tooltip').innerHTML = '4 (default)'
} else if (document.getElementById("tab-size-range").value == 1) {
    document.getElementById('tab-size-tooltip').innerHTML = '1 (minimum)'
} else if (document.getElementById("tab-size-range").value == 8) {
    document.getElementById('tab-size-tooltip').innerHTML = '8 (maximum)'
} else {
    document.getElementById('tab-size-tooltip').innerHTML = document.getElementById("tab-size-range").value;
}

var automaticUpdatesEnabled = false;
var internetModal = document.getElementById("internet-modal");
var closeInternetModal = document.getElementById("close-internet-modal");
var resetModal = document.getElementById("reset-modal");
var closeResetModal = document.getElementById("close-reset-modal");
var exportModal = document.getElementById("export-modal");
var closeExportModal = document.getElementById("close-export-modal");
var librariesModal = document.getElementById("libraries-modal");
var closeLibrariesModal = document.getElementById("close-libraries-modal");
var i;

document.getElementById("result-size-display").innerHTML = document.getElementById("view").clientWidth + " x " + document.getElementById("view").clientHeight;

setInterval(function() {
    if (!navigator.onLine) {
        document.getElementById("automatic-updates-checkbox").checked = false;
        automaticUpdatesEnabled = false;
    }
}, 1);

document.body.onresize = function() {
    document.getElementById("result-size-display").innerHTML = document.getElementById("view").clientWidth + " x " + document.getElementById("view").clientHeight;
}

function showInternetError() {
    internetModal.style.display = "block";
}

function showResetWarning() {
    resetModal.style.display = "block";
}

function showExportMenu() {
    exportModal.style.display = "block";
}

function showLibraries() {
    librariesModal.style.display = "block";
}

closeInternetModal.onclick = function() {
    internetModal.style.display = "none";
}

closeResetModal.onclick = function() {
    resetModal.style.display = "none";
}

closeExportModal.onclick = function() {
    exportModal.style.display = "none";
}

closeLibrariesModal.onclick = function() {
    librariesModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == internetModal) {
        internetModal.style.display = "none";
    } if (event.target == resetModal) {
        resetModal.style.display = "none";
    } if (event.target == exportModal) {
        exportModal.style.display = "none";
    } if (event.target == librariesModal) {
        librariesModal.style.display = "none";
    }
}

var editor = CodeMirror(document.querySelector('#code'), {
    lineNumbers: true,
    tabSize: 4,
    indentUnit: 4,
    value: "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\t\t<title>Page Title</title>\n\t\t<style>\n\t\t\t/* CSS */\n\t\t\t\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<p>Hello, World!</p>\n\t\t<!-- HTML -->\n\t\t\n\t\t<script>\n\t\t\t// JavaScript\n\t\t\t\n\t\t</script>\n\t</body>\n</html>\n",
    mode: "htmlmixed",
    theme: "ayu-mirage",
    lineWrapping: true,
    smartIndent: true,
    indentLine: true,
    indentAuto: true,
    newlineAndIndent: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    styleActiveLine: true,
    matchBrackets: true,
    matchTags: true,
    showHint: true,
    completeSingle: false
});

editor.setOption("tabSize", Number(document.getElementById("tab-size-range").value));
editor.setOption("indentUnit", Number(document.getElementById("tab-size-range").value));

function autoUpdate() {
    if (automaticUpdatesEnabled) {
        showCode();
    }
}

function showCode() {
    var text = editor.getValue();
    document.getElementById("view").contentWindow.document.open();
    document.getElementById("view").contentWindow.document.writeln(text);
    document.getElementById("view").contentWindow.document.close();
    //document.getElementById("view").src = "data:text/html;charset=utf-8," + encodeURI(text);
}


showCode();

function downloadCode(fileName, text) {
	var data = text;
	var link = document.createElement('a');
	link.download = fileName;
	var blob = new Blob(["" + data + ""], {type: "text/plain"});
	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
}

editor.on("inputRead", function(instance) {
    if (instance.state.completionActive) {
        return;
    }
    var cur = instance.getCursor();
    var token = instance.getTokenAt(cur);
    if (token.type && token.type != "comment") {
        CodeMirror.commands.autocomplete(instance);
    }
});