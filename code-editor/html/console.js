function addFunctionsToConsole() {
    var oldLog = console.log;
    console.log = function(...args) {
        oldLog(args);
        top.document.getElementById("console").innerText += "<div class='info'>" + args + "</div>";
    }
    var oldWarn = console.warn;
    console.warn = function(...args) {
        oldWarn(args);
        top.document.getElementById("console").innerText += "<div class='warning'>" + args + "</div>";
    }
    var oldError = console.error;
    console.error = function(...args) {
        oldError(args);
        top.document.getElementById("console").innerText += "<div class='error'>" + args + "</div>";
    }
}

addFunctionsToConsole();

window.addEventListener("error", function(e) {
    console.error(e.error);
})