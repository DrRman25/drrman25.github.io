/**
Import all required CodeMirror and Lezer modules.
*/
import {EditorState, StateEffect} from "https://codemirror.net/try/mods/@codemirror-state.js";
import {search, highlightSelectionMatches, searchKeymap} from "https://codemirror.net/try/mods/@codemirror-search.js";
import {EditorView, keymap, placeholder, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, rectangularSelection, crosshairCursor} from "https://codemirror.net/try/mods/@codemirror-view.js";
import {defaultKeymap, history, historyKeymap} from "https://codemirror.net/try/mods/@codemirror-commands.js";
import {tags} from "https://codemirror.net/try/mods/@lezer-highlight.js";
import {indentUnit, syntaxHighlighting, HighlightStyle, foldGutter, indentOnInput, bracketMatching, foldKeymap} from "https://codemirror.net/try/mods/@codemirror-language.js";
import {closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap} from "https://codemirror.net/try/mods/@codemirror-autocomplete.js";
import {linter, lintKeymap} from "https://codemirror.net/try/mods/@codemirror-lint.js";
import {html} from "https://codemirror.net/try/mods/@codemirror-lang-html.js";
import {javascriptLanguage, scopeCompletionSource, esLint} from "https://codemirror.net/try/mods/@codemirror-lang-javascript.js";

/**
Import all required Replit and Emmet modules.
*/
import {vscodeKeymap} from '../node-modules/@replit/codemirror-vscode-keymap/dist/index.js';
import interact from '../node-modules/@replit/codemirror-interact/dist/index.js';
import {indentationMarkers} from '../node-modules/@replit/codemirror-indentation-markers/dist/index.js';
import {colorPicker} from '../node-modules/@replit/codemirror-css-color-picker/dist/index.js';
import {abbreviationTracker} from '../node-modules/@emmetio/codemirror6-plugin/dist/plugin.js';

/**
Add 'eslint' to globalThis.
*/
import '../node-modules/eslint-linter-browserify/linter.js';

/**
Set the editor's default tab size to 4, for new users.
*/
if (!localStorage.getItem("code-editor-editor-tabSize")) {
    localStorage.setItem("code-editor-editor-tabSize", 4);
}

/**
Set the default number of spaces a block (whatever that means depending on the language) should be indented in the editor to 4, for new users.
*/
if (!localStorage.getItem("code-editor-editor-indentUnit")) {
    localStorage.setItem("code-editor-editor-indentUnit", "    ");
}

/**
Disable the Visual Studio Code key bindings by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-vscodeKeymap")) {
    localStorage.setItem("code-editor-editor-vscodeKeymap", false);
}

/**
Disable the Emmet abbreviation tracker by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-abbreviationTracker")) {
    localStorage.setItem("code-editor-editor-abbreviationTracker", false);
}

/**
Enable the CSS color picker by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-colorPicker")) {
    localStorage.setItem("code-editor-editor-colorPicker", true);
}

/**
Enable indentation markers in the editor by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-indentationMarkers")) {
    localStorage.setItem("code-editor-editor-indentationMarkers", true);
}

/**
Disable the interact feature by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-interact")) {
    localStorage.setItem("code-editor-editor-interact", false);
}

/**
Disable rectangular selection by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-rectangularSelection")) {
    localStorage.setItem("code-editor-editor-rectangularSelection", false);
}

/**
Set the site theme by default to light, for new users.
*/
if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

/**
Set the seasonal extras preference by default to false, for new users.
*/
if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

/**
Add the site theme and seasonal extras attributes to the body element.
*/
document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

/**
Declare the editor variable, to use later.
*/
let editor;

/**
Make the code 'run-able', to run the code as soon as the page loads.
*/
let canRunCode = true;

/**
Get URL queries for use later.
*/
const urlCodeQuery = /[?&]c=([^&]+)/.exec(document.location.search);
const urlMyProgramQuery = /[?&]prog=([^&]+)/.exec(document.location.search);
const urlFilenameQuery = /[?&]file=([^&]+)/.exec(document.location.search);
const urlDataVersionQuery = /[?&]dv=([^&]+)/.exec(document.location.search);
const urlExampleQuery = /[?&]example=([^&]+)/.exec(document.location.search);

/**
Define a universal highlight style, for use in the editor.
*/
const universalTheme = HighlightStyle.define([
    {tag: tags.link, textDecoration: "underline"},
    {tag: tags.heading, textDecoration: "underline", fontWeight: "bold"},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"},
]);

/**
Define a highlight style, for use with the light site theme.
*/
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

/**
Define a highlight style, for use with the dark site theme.
*/
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

/**
Define a highlight style, for use with the spooky site theme.
*/
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

/**
Helper function that 'injects' an extension into the CodeMirror editor.
*/
function injectExtension(extension) {
    editor.dispatch({
        effects: StateEffect.appendConfig.of(extension)
    });
}

/**
Helper function that loads some code (a string) into the editor.
*/
function loadCode(code) {
    /**
    Create a new editor state, to be used later.
    */
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
            javascriptLanguage.data.of({autocomplete: scopeCompletionSource(document.getElementById("completion-source-frame").contentWindow.globalThis)}),
            linter(esLint(new eslint.Linter())),
            search({
                top: true
            }),
            EditorState.tabSize.of(localStorage.getItem("code-editor-editor-tabSize")),
            indentUnit.of(localStorage.getItem("code-editor-editor-indentUnit")),
            syntaxHighlighting(universalTheme)
        ]
    });
    if (editor) {
        /**
        If the editor already exists, replace its state.
        */
        editor.setState(state);
    } else {
        /**
        Otherwise, create a whole new editor with the state.
        */
        editor = new EditorView({
            state,
            parent: document.getElementById("editor")
        });
    }
    if (localStorage.getItem("code-editor-editor-vscodeKeymap") !== "false") {
        /**
        If the Visual Studio key bindings are enabled in the preferences, inject the keymap as an extension.
        */
        injectExtension(keymap.of([...vscodeKeymap]));
    }
    if (localStorage.getItem("code-editor-editor-abbreviationTracker") !== "false") {
        /**
        If the Emmet abbreviation tracker is enabled in the preferences, inject it as an extension.
        */
        injectExtension(abbreviationTracker());
    }
    if (localStorage.getItem("code-editor-editor-colorPicker") !== "false") {
        /**
        If the CSS color picker is enabled in the preferences, inject it as an extension.
        */
        injectExtension(colorPicker);
    }
    if (localStorage.getItem("code-editor-editor-indentationMarkers") !== "false") {
        /**
        If indentation markers are enabled in the preferences, inject the markers as an extension.
        */
        injectExtension(indentationMarkers());
    }
    if (localStorage.getItem("code-editor-editor-interact") !== "false") {
        /**
        If the interact feature is enabled in the preferences, inject it as an extension.
        */
        injectExtension(interact({
            rules: [
                {
                    regexp: /-?\b\d+\.?\d*\b/g,
                    cursor: 'ew-resize',
                    onDrag: (text, setText, e) => {
                        let newVal = Number(text) + e.movementX;
                        if (isNaN(newVal)) return;
                        setText(newVal.toString());
                    }
                },
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
                {
                    regexp: /https?:\/\/[^ "]+/g,
                    cursor: "pointer",
                    onClick: text => window.open(text),
                },
            ],
        }));
    }
    if (localStorage.getItem("code-editor-editor-rectangularSelection") !== "false") {
        /**
        If rectangular selection is enabled in the preferences, inject it as an extension. Also, inject the crosshair cursor extension, to serve as a visual hint that rectangular selection is going to happen.
        */
        injectExtension(rectangularSelection());
        injectExtension(crosshairCursor());
    } else {
        /**
        Otherwise, add selections when clicking with the Alt key held down.
        */
        injectExtension(EditorView.clickAddsSelectionRange.of(e => e.altKey));
    }
    if (localStorage.getItem("code-editor-site-theme") === "light") {
        /**
        If the current site theme is light, inject the light highlight style.
        */
        injectExtension(syntaxHighlighting(lightTheme));
    } else if (localStorage.getItem("code-editor-site-theme") === "dark") {
        /**
        Otherwise, if the current site theme is dark, inject the dark highlight style.
        */
        injectExtension(syntaxHighlighting(darkTheme));
    } else if (localStorage.getItem("code-editor-site-theme") === "spooky") {
        /**
        Otherwise, if the current site theme is spooky, inject the spooky highlight style.
        */
        injectExtension(syntaxHighlighting(spookyTheme));
    }
}

/**
Helper function which returns the default code, which shows up in the editor when you open it for the first time.
*/
function getDefaultCode() {
    return `<!DOCTYPE html>
<html>

<head>
${localStorage.getItem("code-editor-editor-indentUnit")}<title>My Web Site</title>
</head>

<body>
${localStorage.getItem("code-editor-editor-indentUnit")}<h1>My First HTML Page</h1>
${localStorage.getItem("code-editor-editor-indentUnit")}<p>Hello, world!</p>

${localStorage.getItem("code-editor-editor-indentUnit")}<!--
${localStorage.getItem("code-editor-editor-indentUnit")}This below script adds a badge, to show that you are using the DrRcraft Code Editor.
${localStorage.getItem("code-editor-editor-indentUnit")}You can modify the "data-drrcraft-theme" attribute of the script to change the color theme to dark, light, red, orange, yellow, lime, green, teal, blue, blurple, purple, magenta, or pink!
${localStorage.getItem("code-editor-editor-indentUnit")}-->
${localStorage.getItem("code-editor-editor-indentUnit")}<script src="${location.origin}/code-editor/3/scripts/editor-badge.js" defer="true" data-drrcraft-theme="blue"></script>
</body>

</html>
`;
}

/**
Helper function which returns all the examples, which can be accessed by opening the 'Select example...' dropdown at the top.
*/
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

/**
Get all of the examples.
*/
let examples = getExamples();

for (let exampleName of Object.keys(examples)) {
    /**
    Add each example to the 'Select example...' dropdown.
    */
    document.getElementById("examples").appendChild(document.createElement("option")).textContent = exampleName;
}

/**
Helper function that encodes a parameter.
*/
function encodeParameter(code) {
    return btoa(code.replace(/[\xff-\uffff]/g, ch => `\xff${String.fromCharCode(ch.charCodeAt(0) & 0xff, ch.charCodeAt(0) >> 8)}`));
}

/**
Helper function that decodes a parameter.
*/
function decodeParameter(param) {
    return atob(param).replace(/\xff[^][^]/g, m => String.fromCharCode(m.charCodeAt(1) + (m.charCodeAt(2) << 8)));
}

/**
Automatically select an example when a user selects one from the dropdown list.
*/
document.getElementById("examples").addEventListener("change", () => {
    let exampleValue = document.getElementById("examples").value;
    if (examples.hasOwnProperty(exampleValue)) {
        window.history.pushState({}, "", document.location.toString().replace(/[#?].*/, "") + "?example=" + encodeURIComponent(exampleValue));
        loadCode(examples[exampleValue]);
        run(false);
    }
    document.getElementById("examples").selectedIndex = 0;
});

/**
Get all of the files in the files directory.
*/
import files from "./scripts/files.js";

/**
Get all of the user's saved programs.
*/
import myPrograms from "./scripts/my-programs.js";

/**
Load code, depending on the URL query and the user's saved programs.
*/
loadCode(
    (urlCodeQuery && urlDataVersionQuery && parseInt(urlDataVersionQuery[1]) === 10) ? decodeParameter(urlCodeQuery[1])
    : (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) ? myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["program"]
    : (urlFilenameQuery && files.hasOwnProperty(urlFilenameQuery[1])) ? files[urlFilenameQuery[1]]
    : (urlExampleQuery && examples.hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) ? examples[decodeURIComponent(urlExampleQuery[1])]
    : getDefaultCode()
);

/**
If the data version parameter is not the current data version, open the 'Invalid Data Version' modal.
*/
if (urlCodeQuery && (!urlDataVersionQuery || parseInt(urlDataVersionQuery[1]) !== 10)) {
    document.getElementById("modal-invalid-dv").showModal();
    document.getElementById("data-version").textContent = (
        !urlDataVersionQuery ? "3.0.0.8 or earlier"
        : (parseInt(urlDataVersionQuery[1]) === 1) ? "3.0.0.9"
        : (parseInt(urlDataVersionQuery[1]) === 2) ? "3.0.0.10"
        : (parseInt(urlDataVersionQuery[1]) === 3) ? "3.0.0.11"
        : (parseInt(urlDataVersionQuery[1]) === 4) ? "3.0.0.12"
        : (parseInt(urlDataVersionQuery[1]) === 5) ? "3.0.0.13"
        : (parseInt(urlDataVersionQuery[1]) === 6) ? "3.0.0.14"
        : (parseInt(urlDataVersionQuery[1]) === 7) ? "3.0.0.15"
        : (parseInt(urlDataVersionQuery[1]) === 8) ? "3.0.0.16"
        : (parseInt(urlDataVersionQuery[1]) === 9) ? "3.0.0.17"
        : (parseInt(urlDataVersionQuery[1]) > 10) ? "(future version - 3.0.0.19+)"
        : "unknown"
    );
}

/**
Helper function which runs the code in the Output tab.
*/
function run(coolDown = true) {
    if (canRunCode) {
        if (innerWidth < 1200) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
        }
        document.getElementById("output").textContent = "";
        let titleBar = document.createElement("div");
        titleBar.setAttribute("id", "output-title-bar");
        document.getElementById("output").appendChild(titleBar);
        let frameContainer = document.createElement("div");
        frameContainer.setAttribute("id", "output-iframe-container");
        document.getElementById("output").appendChild(frameContainer);
        let frame = document.createElement("iframe");
        frameContainer.appendChild(frame);
        let frameDoc = frame.contentDocument || frame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(editor.state.doc.toString());
        frameDoc.close();
        titleBar.textContent = `${frameDoc.title || "Untitled document"} (${frameDoc.characterSet})`;
        titleBar.style.backgroundColor = "transparent";
        if (coolDown) {
            canRunCode = false;
            document.getElementById("run").textContent = ". . .";
            setTimeout(() => {
                canRunCode = true;
                document.getElementById("run").textContent = "Run";
            }, 500);
        }
        document.getElementById("clear").disabled = false;
    }
    return true;
}

/**
Helper function that displays a notification, and removes it after a specified time.
*/
function displayNotification(relativeElement, parentElement, messageText, notificationTime) {
    let notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    let notificationCoords = relativeElement.getBoundingClientRect();
    notificationElement.style.left = `${notificationCoords.left}px`;
    notificationElement.style.top = `${notificationCoords.bottom + 3}px`;
    parentElement.appendChild(notificationElement);
    setTimeout(() => {
        notificationElement.remove();
    }, notificationTime);
}

/**
Helper function that prepares the share modal when it is opened.
*/
function prepareShareModal() {
    document.getElementById("share-export-filesize").textContent = 
    editor.state.doc.toString().length >= 1125899906842624 ? `${(editor.state.doc.toString().length / 1125899906842624).toFixed(2)} petabytes`
    : editor.state.doc.toString().length >= 1099511627776 ? `${(editor.state.doc.toString().length / 1099511627776).toFixed(2)} terabytes`
    : editor.state.doc.toString().length >= 1073741824 ? `${(editor.state.doc.toString().length / 1073741824).toFixed(2)} gigabytes`
    : editor.state.doc.toString().length >= 1048576 ? `${(editor.state.doc.toString().length / 1048576).toFixed(2)} megabytes`
    : editor.state.doc.toString().length >= 1024 ? `${(editor.state.doc.toString().length / 1024).toFixed(2)} kilobytes`
    : `${editor.state.doc.toString().length} bytes`;
    document.getElementById("share-link").value = document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=10";
}

/**
Helper function that prepares the save modal when it is opened.
*/
function prepareSaveModal() {
    if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) {
        document.getElementById("save-name").value = decodeURIComponent(urlMyProgramQuery[1]);
    }
}

/**
When the 'Run' button is clicked, run the code.
*/
document.getElementById("run").addEventListener("click", () => {
    run(true);
});

/**
When the 'Share' button is clicked, open the share modal.
*/
document.getElementById("share").addEventListener("click", () => {
    document.getElementById("modal-share").showModal();
    prepareShareModal();
});

/**
When the 'Save' button is clicked, open the save modal.
*/
document.getElementById("save").addEventListener("click", () => {
    document.getElementById("modal-save").showModal();
    prepareSaveModal();
});

/**
When the 'Copy link' button in the share modal is clicked, copy the share link to the clipboard.
*/
document.getElementById("share-link-copy").addEventListener("click", e => {
    navigator.clipboard.writeText(document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=10");
    displayNotification(e.target, document.getElementById("modal-share"), "Link successfully copied!", 2000);
});

/**
When the 'Export / Download as HTML' button in the share modal is clicked, download the code in a HTML file.
*/
document.getElementById("share-export-html").addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = "index.html";
    let blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

/**
When the 'Export / Download as Plain Text' button in the share modal is clicked, download the code in a plain text file.
*/
document.getElementById("share-export-plain-text").addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = "prog.txt";
    let blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

/**
When the 'Close' button in the share modal is clicked, close the share modal.
*/
document.getElementById("modal-share-close").addEventListener("click", () => {
    document.getElementById("modal-share").close();
});

/**
When the 'Save code' button in the save modal is clicked, save the code.
*/
document.getElementById("save-to-programs").addEventListener("click", e => {
    myPrograms[document.getElementById("save-name").value] = {};
    myPrograms[document.getElementById("save-name").value]["language"] = "html-css-js";
    myPrograms[document.getElementById("save-name").value]["program"] = editor.state.doc.toString();
    displayNotification(e.target, document.getElementById("modal-save"), "Program successfully saved!", 2000);
    localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
});

/**
When the 'Close' button in the save modal is clicked, close the save modal.
*/
document.getElementById("modal-save-close").addEventListener("click", () => {
    document.getElementById("modal-save").close();
});

/**
When the 'Try to Load Anyway' button in the 'Invalid Data Version' modal is clicked, attempt to load the code anyway, and close the modal.
*/
document.getElementById("invalid-dv-load-anyway").addEventListener("click", () => {
    loadCode(decodeParameter(urlCodeQuery[1]));
    run(false);
    document.getElementById("modal-invalid-dv").close();
});

/**
When the 'Use Default Code' button in the 'Invalid Data Version' modal is clicked, close the 'Invalid Data Version' modal.
*/
document.getElementById("invalid-dv-load-default").addEventListener("click", () => {
    document.getElementById("modal-invalid-dv").close();
});

/**
When the 'Clear Output' button is clicked, clear the Output tab.
*/
document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("output").textContent = "";
    let titleBar = document.createElement("div");
    titleBar.setAttribute("id", "output-title-bar");
    titleBar.classList.add("cleared");
    document.getElementById("output").appendChild(titleBar);
    let frameContainer = document.createElement("div");
    frameContainer.setAttribute("id", "output-iframe-container");
    document.getElementById("output").appendChild(frameContainer);
    let frame = document.createElement("iframe");
    frameContainer.appendChild(frame);
    titleBar.textContent = "Process terminated";
    titleBar.style.backgroundColor = "transparent";
    document.getElementById("clear").disabled = true;
});

/**
Run the code when the page loads.
*/
run(false);

addEventListener("load", () => {
    if (innerWidth < 1200) {
        /**
        On narrow screens, show only the Output tab.
        */
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("tab-output").classList.add("active");
    } else {
        /**
        On wide screens, show both tabs.
        */
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
        document.getElementById("tab-editor").classList.add("active");
    }
});

addEventListener("resize", () => {
    if (innerWidth < 1200) {
        /**
        When resizing to a narrow screen, show only one tab.
        */
        if (document.getElementById("tab-editor").classList.contains("active")) {
            document.getElementById("editor").style.display = "block";
            document.getElementById("output").style.display = "none";
        } else if (document.getElementById("tab-output").classList.contains("active")) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
        }
    } else {
        /**
        When resizing to a wide screen, show both tabs.
        */
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
    }
});

/**
When the 'Editor' button is clicked, open the Editor tab on small devices.
*/
document.getElementById("tab-editor").addEventListener("click", () => {
    document.getElementById("tab-editor").classList.add("active");
    document.getElementById("tab-output").classList.remove("active");
    document.getElementById("editor").style.display = "block";
    document.getElementById("output").style.display = "none";
});

/**
When the 'Output' button is clicked, open the Output tab on small devices.
*/
document.getElementById("tab-output").addEventListener("click", () => {
    document.getElementById("tab-editor").classList.remove("active");
    document.getElementById("tab-output").classList.add("active");
    document.getElementById("editor").style.display = "none";
    document.getElementById("output").style.display = "block";
});
