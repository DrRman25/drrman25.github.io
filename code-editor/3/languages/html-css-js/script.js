import {EditorState, StateEffect} from "https://codemirror.net/try/mods/@codemirror-state.js";
import {search, highlightSelectionMatches, searchKeymap} from "https://codemirror.net/try/mods/@codemirror-search.js";
import {EditorView, keymap, placeholder, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine} from "https://codemirror.net/try/mods/@codemirror-view.js";
import {defaultKeymap, history, historyKeymap} from "https://codemirror.net/try/mods/@codemirror-commands.js";
import {tags} from "https://codemirror.net/try/mods/@lezer-highlight.js";
import {indentUnit, syntaxHighlighting, HighlightStyle, foldGutter, indentOnInput, bracketMatching, foldKeymap} from "https://codemirror.net/try/mods/@codemirror-language.js";
import {closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap} from "https://codemirror.net/try/mods/@codemirror-autocomplete.js";
import {lintKeymap} from "https://codemirror.net/try/mods/@codemirror-lint.js";
import {vscodeKeymap} from '../node-modules/@replit/codemirror-vscode-keymap/dist/index.js';
import interact from '../node-modules/@replit/codemirror-interact/dist/index.js';
import {indentationMarkers} from '../node-modules/@replit/codemirror-indentation-markers/dist/index.js';
import {html} from "https://codemirror.net/try/mods/@codemirror-lang-html.js";
import {abbreviationTracker} from '../node-modules/@emmetio/codemirror6-plugin/dist/plugin.js';
import {colorPicker} from '../node-modules/@replit/codemirror-css-color-picker/dist/index.js';

if (!localStorage.getItem("code-editor-editor-tabSize")) {
    localStorage.setItem("code-editor-editor-tabSize", 4);
}

if (!localStorage.getItem("code-editor-editor-indentUnit")) {
    localStorage.setItem("code-editor-editor-indentUnit", "    ");
}

if (!localStorage.getItem("code-editor-editor-vscodeKeymap")) {
    localStorage.setItem("code-editor-editor-vscodeKeymap", false);
}

if (!localStorage.getItem("code-editor-editor-colorPicker")) {
    localStorage.setItem("code-editor-editor-colorPicker", true);
}

if (!localStorage.getItem("code-editor-editor-indentationMarkers")) {
    localStorage.setItem("code-editor-editor-indentationMarkers", true);
}

if (!localStorage.getItem("code-editor-editor-interact")) {
    localStorage.setItem("code-editor-editor-interact", false);
}

if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

let frame, frameDoc, frameContainer, titleBar;
let editor;
let canRunCode = true;
const urlCodeQuery = /[?&]c=([^&]+)/.exec(document.location.search);
const urlMyProgramQuery = /[?&]prog=([^&]+)/.exec(document.location.search);
const urlFilenameQuery = /[?&]file=([^&]+)/.exec(document.location.search);
const urlDataVersionQuery = /[?&]dv=([^&]+)/.exec(document.location.search);
const urlExampleQuery = /[?&]example=([^&]+)/.exec(document.location.search);

const universalTheme = HighlightStyle.define([
    {tag: tags.link, textDecoration: "underline"},
    {tag: tags.heading, textDecoration: "underline", fontWeight: "bold"},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"},
]);

const lightTheme = HighlightStyle.define([
    {tag: tags.keyword, color: "#005cb8"},
    {tag: tags.atom, color: "#005cb8"},
    {tag: tags.bool, color: "#004182"},
    {tag: tags.labelName, color: "#736000"},
    {tag: tags.inserted, color: "#736000"},
    {tag: tags.deleted, color: "#964b00"},
    {tag: tags.literal, color: "#736000"},
    {tag: [tags.string, tags.special(tags.string)], color: "#964b00"},
    {tag: tags.number, color: "#466900"},
    {tag: [tags.regexp, tags.escape], color: "#ab2980"},
    {tag: tags.definition(tags.propertyName), color: "#004182"},
    {tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#736000"},
    {tag: tags.typeName, color: "#005cb8"},
    {tag: tags.className, color: "#005cb8"},
    {tag: tags.propertyName, color: "#004182"},
    {tag: tags.operator, color: "#004182"},
    {tag: tags.comment, color: "#98999c"},
    {tag: tags.meta, color: "#005cb8"},
    {tag: tags.angleBracket, color: "#5c5f66"}
]);

const darkTheme = HighlightStyle.define([
    {tag: tags.keyword, color: "#57abff"},
    {tag: tags.atom, color: "#57abff"},
    {tag: tags.bool, color: "#b2d9ff"},
    {tag: tags.labelName, color: "#f2e088"},
    {tag: tags.inserted, color: "#f2e088"},
    {tag: tags.deleted, color: "#ffbd7a"},
    {tag: tags.literal, color: "#f2e088"},
    {tag: [tags.string, tags.special(tags.string)], color: "#ffbd7a"},
    {tag: tags.number, color: "#c4e581"},
    {tag: [tags.regexp, tags.escape], color: "#ff70cf"},
    {tag: tags.definition(tags.propertyName), color: "#b2d9ff"},
    {tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#f2e088"},
    {tag: tags.typeName, color: "#57abff"},
    {tag: tags.className, color: "#57abff"},
    {tag: tags.propertyName, color: "#b2d9ff"},
    {tag: tags.operator, color: "#b2d9ff"},
    {tag: tags.comment, color: "#009118"},
    {tag: tags.meta, color: "#57abff"},
    {tag: tags.angleBracket, color: "#9da2a6"}
]);

const spookyTheme = HighlightStyle.define([
    {tag: tags.keyword, color: "#7fbfff"},
    {tag: tags.atom, color: "#7fbfff"},
    {tag: tags.bool, color: "#b2d9ff"},
    {tag: tags.labelName, color: "#fff2b2"},
    {tag: tags.inserted, color: "#fff2b2"},
    {tag: tags.deleted, color: "#ffd9b2"},
    {tag: tags.literal, color: "#fff2b2"},
    {tag: [tags.string, tags.special(tags.string)], color: "#ffd9b2"},
    {tag: tags.number, color: "#c4e581"},
    {tag: [tags.regexp, tags.escape], color: "#ff8ad8"},
    {tag: tags.definition(tags.propertyName), color: "#b2d9ff"},
    {tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#fff2b2"},
    {tag: tags.typeName, color: "#7fbfff"},
    {tag: tags.className, color: "#7fbfff"},
    {tag: tags.propertyName, color: "#b2d9ff"},
    {tag: tags.operator, color: "#b2d9ff"},
    {tag: tags.comment, color: "#36b24a"},
    {tag: tags.meta, color: "#7fbfff"},
    {tag: tags.angleBracket, color: "#9da2a6"}
]);

function injectExtension(extension) {
    editor.dispatch({
        effects: StateEffect.appendConfig.of(extension)
    });
}

function loadCode(code) {
    let state = EditorState.create({
        doc: code,
        extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter({
                openText: "⌄",
                closedText: "⌄"
            }),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            EditorState.phrases.of({
                "next": "↓",
                "previous": "↑",
                "all": "Find all",
                "match case": "Match case",
                "regexp": "RegExp",
                "by word": "By word",
                "replace": "Replace",
                "replace all": "Replace all",
            }),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            highlightSelectionMatches(),
            highlightActiveLine(),
            EditorView.clickAddsSelectionRange.of(e => e.altKey),
            keymap.of([
                {key: "Mod-Enter", run: run},
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap
            ]),
            EditorView.lineWrapping,
            placeholder("Not sure where to start? Look at some examples above (this message will be dismissed after typing)"),
            html(),
            abbreviationTracker(),
            search({
                top: true
            }),
            EditorState.tabSize.of(localStorage.getItem("code-editor-editor-tabSize")),
            indentUnit.of(localStorage.getItem("code-editor-editor-indentUnit")),
            syntaxHighlighting(universalTheme)
        ]
    });
    if (editor) {
        editor.setState(state);
    } else {
        editor = new EditorView({
            state,
            parent: document.getElementById("editor")
        });
    }
    if (localStorage.getItem("code-editor-editor-vscodeKeymap") != "false") {
        injectExtension(keymap.of([...vscodeKeymap]));
    }
    if (localStorage.getItem("code-editor-editor-colorPicker") != "false") {
        injectExtension(colorPicker);
    }
    if (localStorage.getItem("code-editor-editor-indentationMarkers") != "false") {
        injectExtension(indentationMarkers());
    }
    if (localStorage.getItem("code-editor-editor-interact") != "false") {
        injectExtension(interact({
            rules: [
                // Number changer
                {
                    regexp: /-?\b\d+\.?\d*\b/g,
                    cursor: 'ew-resize',
                    onDrag: (text, setText, e) => {
                        let newVal = Number(text) + e.movementX;
                        if (isNaN(newVal)) return;
                        setText(newVal.toString());
                    }
                },
                // Boolean toggler
                {
                    regexp: /true|false/g,
                    cursor: 'pointer',
                    onClick: (text, setText) => {
                        switch (text) {
                            case 'true': return setText('false');
                            case 'false': return setText('true');
                        }
                    }
                },
                // Kaboom.js vec2()
                {
                    regexp: /vec2\(-?\b\d+\.?\d*\b\s*(,\s*-?\b\d+\.?\d*\b)?\)/g,
                    cursor: "move",
                    onDrag: (text, setText, e) => {
                        let res = /vec2\((?<x>-?\b\d+\.?\d*\b)\s*(,\s*(?<y>-?\b\d+\.?\d*\b))?\)/.exec(text);
                        let x = Number(res?.groups?.x);
                        let y = Number(res?.groups?.y);
                        if (isNaN(x)) return;
                        if (isNaN(y)) y = x;
                        setText(`vec2(${x + e.movementX}, ${y + e.movementY})`);
                    },
                },
                // URL Clicker
                {
                    regexp: /https?:\/\/[^ "]+/g,
                    cursor: "pointer",
                    onClick: (text) => {
                        window.open(text);
                    },
                },
            ],
        }));
    }
    if (localStorage.getItem("code-editor-site-theme") == "light") {
        injectExtension(syntaxHighlighting(lightTheme));
    }
    if (localStorage.getItem("code-editor-site-theme") == "dark") {
        injectExtension(syntaxHighlighting(darkTheme));
    }
    if (localStorage.getItem("code-editor-site-theme") == "spooky") {
        injectExtension(syntaxHighlighting(spookyTheme));
    }
}

function getDefaultCode() {
    return `<!DOCTYPE html>
<html>

<head>
${localStorage.getItem("code-editor-editor-indentUnit")}<title>My Web Site</title>
</head>

<body>
${localStorage.getItem("code-editor-editor-indentUnit")}<h1>My First HTML Page</h1>
${localStorage.getItem("code-editor-editor-indentUnit")}<p>Hello, world!</p>
</body>

</html>
`;
}

function getExamples() {
    return {
        "Minimal HTML": `<!DOCTYPE html>
<html>

<head>
    <title>Minimal HTML</title>
</head>

<body>
    <p>My paragraph.</p>
</body>

</html>
`,
        "Simple CSS": `<!DOCTYPE html>
<html>

<head>
    <title>Simple CSS</title>
    <style>
        body {
            background-color: red;
            color: white;
        }

        .heading {
            text-decoration: overline;
            font-family: fantasy;
        }

        #my-paragraph {
            font-style: italic;
        }
    </style>
</head>

<body>
    <h1 class="heading">My Simple CSS</h1>
    <p id="my-paragraph">Hello, world!</p>
</body>

</html>
`,
        "Basic JavaScript": `<!DOCTYPE html>
<html>

<head>
    <title>Basic JavaScript</title>
</head>

<body>
    <h1>My Basic JavaScript</h1>
    <button id="date-button">Show date and time</button>
    <p id="date-time"></p>
    <script>
        let dateButton = document.getElementById("date-button");
        let dateParagraph = document.getElementById("date-time");

        dateButton.onclick = showDate;

        function showDate() {
            dateParagraph.textContent = Date();
        }
    </script>
</body>

</html>
`
    }
}

let examples = getExamples();

for (let exampleName of Object.keys(examples)) {
    document.getElementById("examples").appendChild(document.createElement("option")).textContent = exampleName;
}

function encodeParameter(code) {
    return btoa(code.replace(/[\xff-\uffff]/g, ch => `\xff${String.fromCharCode(ch.charCodeAt(0) & 0xff, ch.charCodeAt(0) >> 8)}`));
}

function decodeParameter(param) {
    return atob(param).replace(/\xff[^][^]/g, m => String.fromCharCode(m.charCodeAt(1) + (m.charCodeAt(2) << 8)));
}

document.getElementById("examples").addEventListener("change", function() {
    let exampleValue = document.getElementById("examples").value;
    if (examples.hasOwnProperty(exampleValue)) {
        window.history.pushState({}, "", document.location.toString().replace(/[#?].*/, "") + "?example=" + encodeURIComponent(exampleValue));
        loadCode(examples[exampleValue]);
        run(false);
    }
    document.getElementById("examples").selectedIndex = 0;
});

import files from "./scripts/files.js";
import myPrograms from "./scripts/my-programs.js";

loadCode(
    (urlCodeQuery && urlDataVersionQuery && parseInt(urlDataVersionQuery[1]) == 6) ? decodeParameter(urlCodeQuery[1])
    : (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) ? myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["program"]
    : (urlFilenameQuery && files.hasOwnProperty(urlFilenameQuery[1])) ? files[urlFilenameQuery[1]]
    : (urlExampleQuery && examples.hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) ? examples[decodeURIComponent(urlExampleQuery[1])]
    : getDefaultCode()
);

if (urlCodeQuery && (!urlDataVersionQuery || parseInt(urlDataVersionQuery[1]) != 6)) {
    document.getElementById("modal-invalid-dv").showModal();
    document.getElementById("data-version").textContent = (
        !urlDataVersionQuery ? "3.0.0.8 or earlier"
        : (parseInt(urlDataVersionQuery[1]) == 1) ? "3.0.0.9"
        : (parseInt(urlDataVersionQuery[1]) == 2) ? "3.0.0.10"
        : (parseInt(urlDataVersionQuery[1]) == 3) ? "3.0.0.11"
        : (parseInt(urlDataVersionQuery[1]) == 4) ? "3.0.0.12"
        : (parseInt(urlDataVersionQuery[1]) == 5) ? "3.0.0.13"
        : (parseInt(urlDataVersionQuery[1]) > 6) ? "(future version - 3.0.0.15+)"
        : "unknown"
    );
}

function run(coolDown = true) {
    if (canRunCode) {
        if (innerWidth < 1200) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
        }
        document.getElementById("output").textContent = "";
        titleBar = document.createElement("div");
        titleBar.setAttribute("id", "output-title-bar");
        document.getElementById("output").appendChild(titleBar);
        frameContainer = document.createElement("div");
        frameContainer.setAttribute("id", "output-iframe-container");
        document.getElementById("output").appendChild(frameContainer);
        frame = document.createElement("iframe");
        frameContainer.appendChild(frame);
        frameDoc = frame.contentDocument || frame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(editor.state.doc.toString());
        frameDoc.close();
        titleBar.textContent = `${frameDoc.title || "Untitled document"} (${frameDoc.characterSet})`;
        titleBar.style.backgroundColor = "transparent";
        if (coolDown) {
            canRunCode = false;
            document.getElementById("run").textContent = ". . .";
            setTimeout(function() {
                canRunCode = true;
                document.getElementById("run").textContent = "Run";
            }, 500);
        }
    }
    return true;
}

function displayNotification(relativeElement, parentElement, messageText, notificationTime) {
    let notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    let notificationCoords = relativeElement.getBoundingClientRect();
    notificationElement.style.left = notificationCoords.left + "px";
    notificationElement.style.top = (notificationCoords.bottom + 3) + "px";
    parentElement.appendChild(notificationElement);
    setTimeout(function() {
        notificationElement.remove();
    }, notificationTime);
}

function prepareShareModal() {
    document.getElementById("share-export-filesize").textContent = 
    editor.state.doc.toString().length >= 1125899906842624 ? `${(editor.state.doc.toString().length / 1125899906842624).toFixed(2)} petabytes`
    : editor.state.doc.toString().length >= 1099511627776 ? `${(editor.state.doc.toString().length / 1099511627776).toFixed(2)} terabytes`
    : editor.state.doc.toString().length >= 1073741824 ? `${(editor.state.doc.toString().length / 1073741824).toFixed(2)} gigabytes`
    : editor.state.doc.toString().length >= 1048576 ? `${(editor.state.doc.toString().length / 1048576).toFixed(2)} megabytes`
    : editor.state.doc.toString().length >= 1024 ? `${(editor.state.doc.toString().length / 1024).toFixed(2)} kilobytes`
    : `${editor.state.doc.toString().length} bytes`;
    document.getElementById("share-link").value = document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=6";
}

function prepareSaveModal() {
    if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) {
        document.getElementById("save-name").value = decodeURIComponent(urlMyProgramQuery[1]);
    }
}

document.getElementById("run").addEventListener("click", function() {
    run(true);
});

document.getElementById("share").addEventListener("click", function() {
    document.getElementById("modal-share").showModal();
    prepareShareModal();
});

document.getElementById("save").addEventListener("click", function() {
    document.getElementById("modal-save").showModal();
    prepareSaveModal();
});

document.getElementById("share-link-copy").addEventListener("click", function(e) {
    navigator.clipboard.writeText(document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=6");
    displayNotification(e.target, document.getElementById("modal-share"), "Link successfully copied!", 2000);
});

let link, blob;

document.getElementById("share-export-html").addEventListener("click", function() {
    link = document.createElement("a");
    link.download = "index.html";
    blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("share-export-plain-text").addEventListener("click", function() {
    link = document.createElement("a");
    link.download = "prog.txt";
    blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("modal-share-close").addEventListener("click", function() {
    document.getElementById("modal-share").close();
});

document.getElementById("save-to-programs").addEventListener("click", function(e) {
    myPrograms[document.getElementById("save-name").value] = {};
    myPrograms[document.getElementById("save-name").value]["language"] = "html-css-js";
    myPrograms[document.getElementById("save-name").value]["program"] = editor.state.doc.toString();
    displayNotification(e.target, document.getElementById("modal-save"), "Program successfully saved!", 2000);
    localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
});

document.getElementById("modal-save-close").addEventListener("click", function() {
    document.getElementById("modal-save").close();
});

document.getElementById("invalid-dv-load-anyway").addEventListener("click", function() {
    loadCode(decodeParameter(urlCodeQuery[1]));
    run(false);
    document.getElementById("modal-invalid-dv").close();
});

document.getElementById("invalid-dv-load-default").addEventListener("click", function() {
    document.getElementById("modal-invalid-dv").close();
});

document.getElementById("clear").addEventListener("click", function() {
    frame = document.createElement("iframe");
    document.getElementById("output").textContent = "";
    document.getElementById("output").appendChild(frame);
    frameDoc = frame.contentDocument || frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write("");
    frameDoc.close();
});

run(false);

addEventListener("load", function() {
    if (innerWidth < 1200) {
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("tab-output").classList.add("active");
    } else {
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
        document.getElementById("tab-editor").classList.add("active");
    }
});

addEventListener("resize", function() {
    if (innerWidth < 1200) {
        if (document.getElementById("tab-editor").classList.contains("active")) {
            document.getElementById("editor").style.display = "block";
            document.getElementById("output").style.display = "none";
        } else if (document.getElementById("tab-output").classList.contains("active")) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
        }
    } else {
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
    }
});

document.getElementById("tab-editor").addEventListener("click", function() {
    document.getElementById("tab-editor").classList.add("active");
    document.getElementById("tab-output").classList.remove("active");
    document.getElementById("editor").style.display = "block";
    document.getElementById("output").style.display = "none";
});

document.getElementById("tab-output").addEventListener("click", function() {
    document.getElementById("tab-editor").classList.remove("active");
    document.getElementById("tab-output").classList.add("active");
    document.getElementById("editor").style.display = "none";
    document.getElementById("output").style.display = "block";
});
