// Variables
var automaticUpdates = false;
var outputMethod = 0;
var timesRanCode = 0;
var startedPackageLoading = false;
var runButtonActive = true;
var ifr;
var ifrw;
var text;
var scripts;
var i;
var verificationTimeout;
var currentValue;

import {basicSetup} from "https://codemirror.net/try/mods/codemirror.js"
import {EditorState, Compartment} from "https://codemirror.net/try/mods/@codemirror-state.js"
import {EditorView, keymap} from "https://codemirror.net/try/mods/@codemirror-view.js"
import {indentWithTab} from "https://codemirror.net/try/mods/@codemirror-commands.js"
import {indentUnit} from "https://codemirror.net/try/mods/@codemirror-language.js"
import {html} from "https://codemirror.net/try/mods/@codemirror-lang-html.js"

var tabSize = new Compartment(), language = new Compartment();
var state = EditorState.create({
    doc: "<!DOCTYPE html>\n<html>\n\n<head>\n    <title>Document</title>\n</head>\n\n<body>\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n</body>\n\n</html>\n",
    indentUnit: "    ",
    extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        language.of(html()),
        tabSize.of(EditorState.tabSize.of(4))
    ]
});

var editor = new EditorView({
    state,
    parent: document.getElementById("code-editor")
});

/*

// XMLHttpRequest (for templates)
var xhttp = new XMLHttpRequest();

// The editor itself
var editor = CodeMirror(document.querySelector('#code-editor'), {
    lineNumbers: true,
    tabSize: 4,
    indentUnit: 4,
    value: "<!DOCTYPE html>\n<html>\n\n<head>\n    <title>Document</title>\n</head>\n\n<body>\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n</body>\n\n</html>\n",
    mode: {
        name: "htmlmixed",
        globalVars: true
    },
    theme: "drrcraft-light",
    keyMap: "drrcraft",
    htmlMode: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    styleActiveLine: true,
    matchBrackets: true,
    matchTags: {
        bothTags: true
    },
    lint: {
        options: {
            esversion: 2021
        }
    },
    lineWiseCopyCut: false,
    addModeClass: true,
    styleActiveLine: true,
    foldGutter: true,
    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    foldOptions: {
        widget: "...",
        minFoldSize: 1
    },
    placeholder: "Not sure where to start? Right-click to see some templates (type to dismiss)"
});
*/
currentValue = editor.state.doc.toString();

setInterval(function() {
    if (editor.state.doc.toString() != currentValue) {
        document.getElementById('code-editor').style.borderLeft = '5px solid #ff9d2e';
        setTimeout(function() {
            currentValue = editor.state.doc.toString();
            clearTimeout(verificationTimeout);
            verificationTimeout = setTimeout(function() {
                document.getElementById('code-editor').style.borderLeft = '5px solid #a3e3ff';
                if (automaticUpdates) {
                    showOutput(false);
                }
            }, 100);
        }, 10);
    }
}, 10);

// Initialize Bootstrap popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

// Runs when clicking "Run" in navbar or context menu
function showOutput(cooldown) {
    if (runButtonActive) {
        if (navigator.onLine) {
            /*if (ifr) {
                ifrw = (ifr.contentWindow) ? ifr.contentWindow: (ifr.contentDocument.document) ? ifr.contentDocument.document: ifr.contentDocument;
            }
            if (ifrw) {
                if (scripts > 0) {
                    ifr = document.createElement("iframe");
                    ifr.setAttribute("frameborder", "0");
                    ifr.setAttribute("id", "code-output");
                    ifr.setAttribute("name", "code-output");
                    ifr.setAttribute("allowfullscreen", "true");
                    document.getElementById("output-container").innerHTML = "";
                    document.getElementById("output-container").appendChild(ifr);
                }
            }
            try {
                ifr = document.getElementById("code-output");
                ifrw = (ifr.contentWindow) ? ifr.contentWindow: (ifr.contentDocument.document) ? ifr.contentDocument.document: ifr.contentDocument;
                ifrw.document.open();
                ifrw.document.writeln(text);
                ifrw.document.close();
            } catch(err) {
                ifr = document.createElement("iframe");
                ifr.setAttribute("frameborder", "0");
                ifr.setAttribute("id", "code-output");
                ifr.setAttribute("name", "code-output");
                ifr.setAttribute("allowfullscreen", "true");
                document.getElementById("output-container").innerHTML = "";
                document.getElementById("output-container").appendChild(ifr);*/
            ifr = document.createElement("iframe");
            text = editor.state.doc.toString();
            ifr.setAttribute("frameborder", "0");
            ifr.setAttribute("id", "code-output");
            ifr.setAttribute("name", "code-output");
            ifr.setAttribute("allowfullscreen", "true");
            document.getElementById("output-container").innerHTML = "";
            document.getElementById("output-container").appendChild(ifr);
            ifrw = (ifr.contentWindow) ? ifr.contentWindow: (ifr.contentDocument.document) ? ifr.contentDocument.document: ifr.contentDocument;
            ifrw.document.open();
            ifrw.document.writeln(text);
            ifrw.document.close();
            ifrw.document.documentElement.setAttribute("translate", "no");
            if (ifrw.document.body && !ifrw.document.body.isContentEditable) {
                ifrw.document.body.contentEditable = true; // Fix text-selection bug in Firefox
                ifrw.document.body.contentEditable = false; // Prevents content from being editable
            }
        }
        document.getElementById('run-btn').innerHTML = "<div class='spinner-border spinner-border-sm'></div>";
        if (cooldown) {
            runButtonActive = false;
            document.getElementById("run-btn").disabled = true;
            document.getElementById("run-btn-dropdown").disabled = true;
            document.getElementById("run-btn-2").disabled = true;
            document.getElementById("run-btn-dropdown-2").disabled = true;
        }
        setTimeout(function() {
            if (navigator.onLine) {
                document.getElementById('run-btn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>&nbsp;Run';
                document.getElementById('run-btn').classList.add("btn-run");
                document.getElementById('run-btn').classList.remove("btn-drrcraft-danger");
                document.getElementById('run-btn-dropdown').classList.add("btn-run");
                document.getElementById('run-btn-dropdown').classList.remove("btn-drrcraft-danger");
                setTimeout(function() {
                    runButtonActive = true;
                    document.getElementById("run-btn").disabled = false;
                    document.getElementById("run-btn-dropdown").disabled = false;
                    document.getElementById("run-btn-2").disabled = false;
                    document.getElementById("run-btn-dropdown-2").disabled = false;
                }, 500);
            }
        }, 100);
        setTimeout(function() {
            if (!navigator.onLine) {
                document.getElementById('run-btn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wifi-off" viewBox="0 0 16 16"><path d="M10.706 3.294A12.545 12.545 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.448 8.448 0 0 1 3.51-1.27L8 6zm2.596 1.404.785-.785c.63.24 1.227.545 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.462 8.462 0 0 0-1.98-.932zM8 10l.933-.933a6.455 6.455 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.532.532 0 0 1-.611.09A5.478 5.478 0 0 0 8 10zm4.905-4.905.747-.747c.59.3 1.153.645 1.685 1.03a.485.485 0 0 1 .047.737.518.518 0 0 1-.668.05 11.493 11.493 0 0 0-1.811-1.07zM9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A1.99 1.99 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75l10.75-10.75z"></path></svg>&nbsp;&nbsp;Offline';
                document.getElementById('run-btn').classList.remove("btn-run");
                document.getElementById('run-btn').classList.add("btn-drrcraft-danger");
                document.getElementById('run-btn-dropdown').classList.remove("btn-run");
                document.getElementById('run-btn-dropdown').classList.add("btn-drrcraft-danger");
                setTimeout(function() {
                    runButtonActive = true;
                    document.getElementById("run-btn").disabled = false;
                    document.getElementById("run-btn-dropdown").disabled = false;
                    document.getElementById("run-btn-2").disabled = false;
                    document.getElementById("run-btn-dropdown-2").disabled = false;
                }, 500);
            }
        }, 1634);
    }
}

// Run code as soon as page loads
showOutput(true);

// Run code with "Ctrl-Enter" or "Ctrl-S" on Windows, "Cmd-Enter" or "Cmd-S" on macOS
window.onkeydown = function(e) {
    if ((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && (e.key == "Enter" || e.key == "s")) {
        e.preventDefault();
        showOutput(true);
    }
}

// Initialize Bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Show window and navigator properties in "Properties" tab
document.body.onload = function() {
    document.getElementById('window-properties').innerHTML =
    "<h6 style='font-size: 1.125rem;'>Result Size</h6>" +
    "<p class='mb-0'><strong>Result Height:</strong> " + document.getElementById("code-output").clientHeight + " pixels</p>" +
    "<p><strong>Result Width:</strong> " + document.getElementById("code-output").clientWidth + " pixels</p>" +
    "<br/>" +
    "<h6 style='font-size: 1.125rem;'>Navigator Properties</h6>" +
    "<p class='mb-0'><strong>Browser CodeName:</strong> " + navigator.appCodeName + "</p>" +
    "<p class='mb-0'><strong>Browser Name:</strong> " + navigator.appName + "</p>" +
    "<p class='mb-0'><strong>Browser Version:</strong> " + navigator.appVersion + "</p>" +
    "<p class='mb-0'><strong>Cookies Enabled:</strong> " + navigator.cookieEnabled + "</p>" +
    "<p class='mb-0'><strong>Browser Language:</strong> " + navigator.language + "</p>" +
    "<p class='mb-0'><strong>Browser Online:</strong> " + navigator.onLine + "</p>" +
    "<p class='mb-0'><strong>Platform:</strong> " + navigator.platform + "</p>" +
    "<p><strong>User-Agent Header:</strong> " + navigator.userAgent + "</p>" +
    "<br/>" +
    "<h6 style='font-size: 1.125rem;'>Screen Properties</h6>" +
    "<p class='mb-0'><strong>Available Height:</strong> " + screen.availHeight + " pixels</p>" +
    "<p class='mb-0'><strong>Available Width:</strong> " + screen.availWidth + " pixels</p>" +
    "<p class='mb-0'><strong>Color Depth:</strong> " + screen.colorDepth + " bits per pixel</p>" +
    "<p class='mb-0'><strong>Color Resolution:</strong> " + screen.pixelDepth + " bits per pixel</p>" +
    "<p class='mb-0'><strong>Total Height:</strong> " + screen.height + " pixels</p>" +
    "<p><strong>Total Width:</strong> " + screen.width + " pixels</p>";
}

// Update "Properties" tab when window is resized
document.body.onresize = function() {
    document.getElementById('window-properties').innerHTML =
    "<h6 style='font-size: 1.125rem;'>Result Size</h6>" +
    "<p class='mb-0'><strong>Result Height:</strong> " + document.getElementById("code-output").clientHeight + " pixels</p>" +
    "<p><strong>Result Width:</strong> " + document.getElementById("code-output").clientWidth + " pixels</p>" +
    "<br/>" +
    "<h6 style='font-size: 1.125rem;'>Navigator Properties</h6>" +
    "<p class='mb-0'><strong>Browser CodeName:</strong> " + navigator.appCodeName + "</p>" +
    "<p class='mb-0'><strong>Browser Name:</strong> " + navigator.appName + "</p>" +
    "<p class='mb-0'><strong>Browser Version:</strong> " + navigator.appVersion + "</p>" +
    "<p class='mb-0'><strong>Cookies Enabled:</strong> " + navigator.cookieEnabled + "</p>" +
    "<p class='mb-0'><strong>Browser Language:</strong> " + navigator.language + "</p>" +
    "<p class='mb-0'><strong>Browser Online:</strong> " + navigator.onLine + "</p>" +
    "<p class='mb-0'><strong>Platform:</strong> " + navigator.platform + "</p>" +
    "<p><strong>User-Agent Header:</strong> " + navigator.userAgent + "</p>" +
    "<br/>" +
    "<h6 style='font-size: 1.125rem;'>Screen Properties</h6>" +
    "<p class='mb-0'><strong>Available Height:</strong> " + screen.availHeight + " pixels</p>" +
    "<p class='mb-0'><strong>Available Width:</strong> " + screen.availWidth + " pixels</p>" +
    "<p class='mb-0'><strong>Color Depth:</strong> " + screen.colorDepth + " bits per pixel</p>" +
    "<p class='mb-0'><strong>Color Resolution:</strong> " + screen.pixelDepth + " bits per pixel</p>" +
    "<p class='mb-0'><strong>Total Height:</strong> " + screen.height + " pixels</p>" +
    "<p><strong>Total Width:</strong> " + screen.width + " pixels</p>";
}

// Pastes text into editor
document.getElementById("paste-text").onclick = function() {
    navigator.clipboard.readText().then(function(str) {
        var selection = editor.getSelection();
        if (selection.length > 0) {
            editor.replaceSelection(str);
        } else {
            var cursor = editor.getCursor();
            var pos = {
               line: cursor.line,
               ch: cursor.ch
            }
            editor.replaceRange(str, pos);
        }
        document.getElementById('editor-context-menu').classList.add('d-none');
    });
    editor.focus();
}

// Functionality for "Custom Export" tab
function downloadCode(fileName, text) {
	var data = text;
	var link = document.createElement('a');
	link.download = fileName;
	var blob = new Blob(["" + data + ""], {type: "text/plain"});
	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
}

// Automatically adjust theme when color scheme changes
function setSystemDefaultIDE() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        editor.setOption("theme", "drrcraft-dark");
        document.getElementById("editor-context-menu").classList.add("drrcraft-dark");
        document.getElementById("editor-context-menu").classList.remove("drrcraft-light");
        //document.getElementById("code-editor").style.outline = "5px solid rgba(34, 34, 34, 0.5)";
    } else {
        editor.setOption("theme", "drrcraft-light");
        document.getElementById("editor-context-menu").classList.add("drrcraft-light");
        document.getElementById("editor-context-menu").classList.remove("drrcraft-dark");
        //document.getElementById("code-editor").style.outline = "5px solid rgba(255, 255, 255, 0.5)";
    }
}

// Keeps checking for color scheme changes
setInterval(function() {
    if (document.getElementById("system-default-ide-theme").checked) {
        //setSystemDefaultIDE();
    }
}, 1);

// Hide context menu when main content is moused down
document.getElementsByClassName("container-fluid")[0].onmousedown = function() {
    document.getElementById("editor-context-menu").classList.add("d-none");
}

// Hide context menu when navbar is moused down
document.getElementById("master-navbar").onmousedown = function() {
    document.getElementById("editor-context-menu").classList.add("d-none");
}

// Hide context menu when editor is moused down
document.getElementById('code-editor').onmousedown = function() {
    document.getElementById("editor-context-menu").classList.add("d-none");
    editor.focus();
}

// Hide context menu when window is resized
window.onresize = function() {
    document.getElementById("editor-context-menu").classList.add("d-none");
}

// Show context menu when editor is right-clicked
document.getElementById('code-editor').oncontextmenu = function(e) {
    e.preventDefault();
    document.getElementById("editor-context-menu").classList.remove("d-none");
    document.getElementById("editor-context-menu").style.left = `${e.clientX}px`;
    if (e.clientY > innerHeight / 2) {
        document.getElementById("editor-context-menu").style.top = `${e.clientY - document.getElementById("editor-context-menu").offsetHeight - 2}px`;
    } else {
        document.getElementById("editor-context-menu").style.top = `${e.clientY - 2}px`;
    }
}

// Loads packages in "Packages" tab
function loadPackages() {
    if (!startedPackageLoading) {
        startedPackageLoading = true;
        var packagesLoading = setInterval(function() {
            if (Number(document.getElementById("packages-loader").ariaValueNow) < 200) {
                document.getElementById("packages-loader").ariaValueNow = Number(document.getElementById("packages-loader").ariaValueNow) + 1;
                document.getElementById("packages-loader").style.width = document.getElementById("packages-loader").ariaValueNow + "%";
            } else {
                document.getElementById("packages-loader-container").style.display = "none";
                document.getElementById("packages-offcanvas-content").style.display = "";
                clearInterval(packagesLoading);
            }
        }, 10);
    }
}

// Opens Image Gallery template ("Templates" tab)
function openImageGalleryTemplate() {
    xhttp.onload = function() {
        editor.setValue(this.responseText);
    }
    xhttp.open("GET", "image_gallery_example.htm");
    xhttp.send();
}

// Opens Navbar template ("Templates" tab)
function openNavbarTemplate() {
    xhttp.onload = function() {
        editor.setValue(this.responseText);
    }
    xhttp.open("GET", "navbar_example.htm");
    xhttp.send();
}

// Opens Canvas Game Step 1 template ("Templates" tab)
function openCanvasGameStep1() {
    xhttp.onload = function() {
        editor.setValue(this.responseText);
    }
    xhttp.open("GET", "game_example_step_1.htm");
    xhttp.send();
}

// Opens Canvas Game Step 2 template ("Templates" tab)
function openCanvasGameStep2() {
    xhttp.onload = function() {
        editor.setValue(this.responseText);
    }
    xhttp.open("GET", "game_example_step_2.htm");
    xhttp.send();
}

// Opens Canvas Game Step 3 template ("Templates" tab)
function openCanvasGameStep3() {
    xhttp.onload = function() {
        editor.setValue(this.responseText);
    }
    xhttp.open("GET", "game_example_step_3.htm");
    xhttp.send();
}

// Old template (may be deleted soon)
function openMediaQueriesExample() {
    editor.setValue(
        "<!DOCTYPE html>" +
        "\n<html>" +
        "\n" +
        "\n<head>" +
        "\n\t<style>" +
        "\n\t\tbody {" +
        "\n\t\t\tbackground-color: pink;" +
        "\n\t\t}" +
        "\n" +
        "\n\t\t@media screen and (min-width: 480px) {" +
        "\n\t\t\tbody {" +
        "\n\t\t\t\tbackground-color: lightgreen;" +
        "\n\t\t\t}" +
        "\n\t\t}" +
        "\n\t</style>" +
        "\n</head>" +
        "\n" +
        "\n<body>" +
        "\n\t<h1>Media Queries</h1>" +
        "\n\t<p>When the viewport is greater than 480px wide, it turns light green. Otherwise, it turns pink.</p>" +
        "\n</body>" +
        "\n" +
        "\n</html>"
    );
}

// Automatically import files ("Import" tab)
document.getElementById("import-file-input").addEventListener("change", importFileHandler, false);

function importFileHandler(e) {
    var reader = new FileReader();
    reader.onload = (function(e) {
        editor.setValue(e.target.result);
    });
    reader.readAsText(e.target.files[0])
}

// Estimated file size for "Export" tab
function getFileSize() {
    var codeLength = editor.state.doc.toString().length;
    if (codeLength > 1000000000000) {
        document.getElementById("export-file-size").innerHTML = Number((codeLength / 1000000000000).toFixed(2)) + " TB";
    } else if (codeLength > 1000000000) {
        document.getElementById("export-file-size").innerHTML = Number((codeLength / 1000000000).toFixed(2)) + " GB";
    } else if (codeLength > 1000000) {
        document.getElementById("export-file-size").innerHTML = Number((codeLength / 1000000).toFixed(2)) + " MB";
    } else if (codeLength > 1000) {
        document.getElementById("export-file-size").innerHTML = Number((codeLength / 1000).toFixed(2)) + " KB";
    } else if (codeLength >= 0) {
        document.getElementById("export-file-size").innerHTML = codeLength + " bytes";
    }
}

// Validate form in "Export" tab before exporting code
(function() {
    'use strict';
    var forms = document.querySelectorAll('.needs-export-validation');
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                downloadCode(document.getElementById('custom-filename').value + '.' + document.getElementById('custom-file-extension').value, editor.state.doc.toString())
            }
            form.classList.add('was-validated');
        }, false);
    })
})()
