/*var htmlExample = CodeMirror(document.querySelector("#html-example"), {
    tabSize: 4,
    indentUnit: 4,
    value: "<!DOCTYPE html>\n<html>\n\n<title>Page Title</title>\n\n<body>\n\t<h1>My First Heading</h1>\n\t<p>My first paragraph.</p>\n</body>\n\n</html>",
    mode: "text/html",
    theme: "drrcraft-light",
    htmlMode: true,
    lineWrapping: true,
    viewportMargin: 10
});*/
CodeMirror.runMode("<!DOCTYPE html>\n<html>\n\n<title>Page Title</title>\n\n<body>\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n</body>\n\n</html>", "text/html", document.getElementById("html-example"));
CodeMirror.runMode("if 4 > 3:\n    print(\"Four is greater than three!\")", "python", document.getElementById("python-example"));

setInterval(function() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.getElementById("html-example").classList.add("cm-s-drrcraft-dark");
        document.getElementById("html-example").classList.remove("cm-s-drrcraft-light");
        document.getElementById("python-example").classList.add("cm-s-drrcraft-dark");
        document.getElementById("python-example").classList.remove("cm-s-drrcraft-light");
    } else {
        document.getElementById("html-example").classList.add("cm-s-drrcraft-light");
        document.getElementById("html-example").classList.remove("cm-s-drrcraft-dark");
        document.getElementById("python-example").classList.add("cm-s-drrcraft-light");
        document.getElementById("python-example").classList.remove("cm-s-drrcraft-dark");
    }
}, 500);