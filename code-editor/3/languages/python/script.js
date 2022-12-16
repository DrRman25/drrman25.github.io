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
import {lintKeymap} from "https://codemirror.net/try/mods/@codemirror-lint.js";
import {python} from "https://codemirror.net/try/mods/@codemirror-lang-python.js";

/**
Import a file placeholder extension, for use later.
*/
import filePlaceholders from "./scripts/file-placeholder.js";

/**
Import an indenting with tab extension, for use later.
*/
import indentWithTab from "./scripts/indent-with-tab.js";

/**
Import all required Replit modules.
*/
import {vscodeKeymap} from '../node-modules/@replit/codemirror-vscode-keymap/dist/index.js';
import interact from '../node-modules/@replit/codemirror-interact/dist/index.js';
import {indentationMarkers} from '../node-modules/@replit/codemirror-indentation-markers/dist/index.js';

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
Disable indenting with tab in the editor by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-indentWithTab")) {
    localStorage.setItem("code-editor-editor-indentWithTab", false);
}

/**
Disable the Visual Studio Code key bindings by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-vscodeKeymap")) {
    localStorage.setItem("code-editor-editor-vscodeKeymap", false);
}

/**
Enable the CSS color picker by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-colorPicker")) {
    localStorage.setItem("code-editor-editor-colorPicker", true);
}

/**
Disable file placeholders in the editor by default, for new users.
*/
if (!localStorage.getItem("code-editor-editor-filePlaceholders")) {
    localStorage.setItem("code-editor-editor-filePlaceholders", false);
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
Declare the last narrow and wide screen tab variables, to use later.
*/
let lastWideScreenTab, lastNarrowScreenTab;

/**
Make the code 'run-able', to run the code as soon as the page loads.
*/
let canRunCode = true;

/**
Create an object to store previous versions of the code, and two variables to store a setInterval, for use later.
*/
let codeHistory = {}, codeHistoryInterval, historyReplayInterval;

/**
Get URL queries for use later.
*/
const urlCodeQuery = /[?&]c=([^&]+)/.exec(document.location.search);
const urlMyProgramQuery = /[?&]prog=([^&]+)/.exec(document.location.search);
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
function injectExtension(editor, extension) {
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
                "next": ">",
                "previous": "<",
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
            python(),
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
        injectExtension(editor, keymap.of([...vscodeKeymap]));
    } else if (localStorage.getItem("code-editor-editor-indentWithTab") !== "false") {
        /**
        If indenting with tab is enabled in the preferences, inject the keymap as an extension.
        */
        injectExtension(editor, keymap.of([indentWithTab]));
    }
    if (localStorage.getItem("code-editor-editor-filePlaceholders") !== "false") {
        /**
        If file placeholders are enabled in the preferences, inject the placeholders as an extension.
        */
        injectExtension(editor, filePlaceholders);
    }
    if (localStorage.getItem("code-editor-editor-indentationMarkers") !== "false") {
        /**
        If indentation markers are enabled in the preferences, inject the markers as an extension.
        */
        injectExtension(editor, indentationMarkers());
    }
    if (localStorage.getItem("code-editor-editor-interact") !== "false") {
        /**
        If the interact feature is enabled in the preferences, inject it as an extension.
        */
        injectExtension(editor, interact({
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
        injectExtension(editor, rectangularSelection());
        injectExtension(editor, crosshairCursor());
    } else {
        /**
        Otherwise, add selections when clicking with the Alt key held down.
        */
        injectExtension(editor, EditorView.clickAddsSelectionRange.of(e => e.altKey));
    }
    if (localStorage.getItem("code-editor-site-theme") === "light") {
        /**
        If the current site theme is light, inject the light highlight style.
        */
        injectExtension(editor, syntaxHighlighting(lightTheme));
    } else if (localStorage.getItem("code-editor-site-theme") === "dark") {
        /**
        Otherwise, if the current site theme is dark, inject the dark highlight style.
        */
        injectExtension(editor, syntaxHighlighting(darkTheme));
    } else if (localStorage.getItem("code-editor-site-theme") === "spooky") {
        /**
        Otherwise, if the current site theme is spooky, inject the spooky highlight style.
        */
        injectExtension(editor, syntaxHighlighting(spookyTheme));
    }
}

/**
Create an editor for the history modal.
*/
const historyEditor = new EditorView({
    state: EditorState.create({
        extensions: [
            EditorView.editable.of(false),
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
                "next": ">",
                "previous": "<",
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
            python(),
            search({
                top: true
            }),
            EditorState.tabSize.of(localStorage.getItem("code-editor-editor-tabSize")),
            indentUnit.of(localStorage.getItem("code-editor-editor-indentUnit")),
            syntaxHighlighting(universalTheme)
        ]
    }),
    parent: document.getElementById("modal-history-view")
});

/**
Add some extensions to the history editor.
*/
if (localStorage.getItem("code-editor-editor-filePlaceholders") !== "false") {
    injectExtension(historyEditor, filePlaceholders);
}
if (localStorage.getItem("code-editor-editor-indentationMarkers") !== "false") {
    injectExtension(historyEditor, indentationMarkers());
}
if (localStorage.getItem("code-editor-site-theme") === "light") {
    injectExtension(historyEditor, syntaxHighlighting(lightTheme));
} else if (localStorage.getItem("code-editor-site-theme") === "dark") {
    injectExtension(historyEditor, syntaxHighlighting(darkTheme));
} else if (localStorage.getItem("code-editor-site-theme") === "spooky") {
    injectExtension(historyEditor, syntaxHighlighting(spookyTheme));
}

/**
Add a context menu to the editor.
*/
document.getElementById("editor").addEventListener("contextmenu", e => {
    if (!e.shiftKey) {
        e.preventDefault();
        const contextMenu = document.getElementById("editor-ctx-menu");
        contextMenu.style.display = "inline-flex";
        contextMenu.style.left = `${Math.min(e.clientX + scrollX, innerWidth - contextMenu.offsetWidth + scrollX)}px`;
        contextMenu.style.top = `${Math.min(e.clientY + scrollY, innerHeight - contextMenu.offsetHeight + scrollY)}px`;
        document.getElementById("ctx-menu-btn-cut").disabled = document.getElementById("ctx-menu-btn-copy").disabled = editor.state.selection.ranges.some(r => r.empty);
        if (typeof navigator.clipboard.readText === "function") {
            navigator.clipboard.readText().then(str => {
                document.getElementById("ctx-menu-btn-paste").disabled = !!str === false;
            });
        }
    }
});

/**
Close the context menu when clicking outside of it.
*/
addEventListener("mousedown", e => {
    if (!document.getElementById("editor-ctx-menu").contains(e.target)) {
        document.getElementById("editor-ctx-menu").style.display = "none";
    }
});

/**
When clicked, make each button in the context menu close the menu.
*/
for (const button of document.getElementById("editor-ctx-menu").children) {
    button.addEventListener("click", () => {
        document.getElementById("editor-ctx-menu").style.display = "none";
    });
}

/**
Make the 'Run' button in the context menu run the code.
*/
document.getElementById("ctx-menu-btn-run").addEventListener("click", () => {
    editor.focus();
    run(true);
});

/**
Make the 'Run in Fullscreen' button in the context menu run the code, and open the output in fullscreen.
*/
document.getElementById("ctx-menu-btn-run-fullscreen").addEventListener("click", () => {
    document.getElementById("output").focus();
    run();
    if (typeof document.getElementById("output").requestFullscreen === "function") {
        document.getElementById("output").requestFullscreen();
    } else if (typeof document.getElementById("output").webkitRequestFullscreen === "function") {
        document.getElementById("output").webkitRequestFullscreen();
    } else if (typeof document.getElementById("output").mozRequestFullScreen === "function") {
        document.getElementById("output").mozRequestFullScreen();
    }
});

/**
Make the 'History' button in the context menu open and prepare the history modal.
*/
document.getElementById("ctx-menu-btn-history").addEventListener("click", () => {
    document.getElementById("modal-history").showModal();
    prepareHistoryModal();
});

/**
Make the 'Cut' button in the context menu cut the selected text.
*/
document.getElementById("ctx-menu-btn-cut").addEventListener("click", () => {
    editor.focus();
    navigator.clipboard.writeText(editor.state.sliceDoc(editor.state.selection.main.from, editor.state.selection.main.to));
    editor.dispatch(editor.state.replaceSelection(""));
});

/**
Make the 'Copy' button in the context menu copy selected text.
*/
document.getElementById("ctx-menu-btn-copy").addEventListener("click", () => {
    editor.focus();
    navigator.clipboard.writeText(editor.state.sliceDoc(editor.state.selection.main.from, editor.state.selection.main.to));
});

/**
Make the 'Paste' button in the context menu paste text from the clipboard.
*/
document.getElementById("ctx-menu-btn-paste").addEventListener("click", () => {
    editor.focus();
    navigator.clipboard.readText().then(str => editor.dispatch(editor.state.replaceSelection(str)));
});

/**
Helper function which returns the default code, which shows up in the editor when you open it for the first time.
*/
function getDefaultCode() {
    return `print("Hello, world!")
`;
}

/**
Helper function which returns all the examples, which can be accessed by opening the 'Select example...' dropdown at the top.
*/
function getExamples() {
    return {
        "Plain Python": {
            "Python statements": `input("What is your name? ") # Gets user input
print("Hi!") # Prints out some text
`,
            "Python variables": `x = 2
y = 5
print(x)
print(y)
`,
            "Python conditionals": `x = "5" # Try changing this value

if x == 5:
${localStorage.getItem("code-editor-editor-indentUnit")}y = "Perfect!"
elif x == "5":
${localStorage.getItem("code-editor-editor-indentUnit")}y = "Okay."
else:
${localStorage.getItem("code-editor-editor-indentUnit")}y = "Wait, what?"

print(y)
`,
            "Python loops": `i = 0

# While loop
print("While loop")
while i < 10:
${localStorage.getItem("code-editor-editor-indentUnit")}print(i)
${localStorage.getItem("code-editor-editor-indentUnit")}i += 1

# For loop
print("\\nFor loop");
for i in range(10):
${localStorage.getItem("code-editor-editor-indentUnit")}print(i)
`,
            "Python functions / subroutines": `def my_message():
${localStorage.getItem("code-editor-editor-indentUnit")}print("Hey there!")

my_message() # Run the function or subroutine
`
        }
    };
}

/**
Get all of the examples.
*/
let examples = getExamples();

for (let exampleCategory of Object.keys(examples)) {
    /**
    Add each example category to the 'Select example...' dropdown.
    */
    const categoryGroupElement = document.createElement("optgroup");
    document.getElementById("examples").appendChild(categoryGroupElement);
    categoryGroupElement.label = exampleCategory;
    /**
    Add every example in a category inside its respective optgroup element.
    */
    for (let exampleName of Object.keys(examples[exampleCategory])) {
        categoryGroupElement.appendChild(document.createElement("option")).textContent = exampleName;
    }
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
    for (let exampleCategory of Object.keys(examples)) {
        if (examples[exampleCategory].hasOwnProperty(exampleValue)) {
            window.history.pushState({}, "", document.location.toString().replace(/[#?].*/, "") + "?example=" + encodeURIComponent(exampleValue));
            loadCode(examples[exampleCategory][exampleValue]);
            run(false);
        }
    }
    document.getElementById("examples").selectedIndex = 0;
});

/**
Get all of the user's saved programs.
*/
import myPrograms from "./scripts/my-programs.js";

/**
Load code, depending on the URL query and the user's saved programs.
*/
(() => {
    if (urlExampleQuery) {
        for (let exampleCategory of Object.keys(examples)) {
            if (examples[exampleCategory].hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) {
                loadCode(examples[exampleCategory][decodeURIComponent(urlExampleQuery[1])]);
                return;
            }
        }
    }
    loadCode(
        (urlCodeQuery && urlDataVersionQuery && parseInt(urlDataVersionQuery[1]) === 14) ? decodeParameter(urlCodeQuery[1])
        : (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) ? myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["program"]
        : getDefaultCode()
    );
})();

/**
If the user's currently loaded program has a tutorial, open the tutorial.
*/
if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1])) && ((myPrograms[decodeURIComponent(urlMyProgramQuery[1])].hasOwnProperty("tutorial:text") && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"] instanceof Object && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"].constructor === Object && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"].hasOwnProperty("title") && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"].hasOwnProperty("body") && typeof myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["title"] === "string" && typeof myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["body"] === "string") || (myPrograms[decodeURIComponent(urlMyProgramQuery[1])].hasOwnProperty("tutorial:video") && typeof myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:video"] === "string"))) {
    if (!window.open(`../../tutorial/?prog=${urlMyProgramQuery[1]}`, "_blank")) {
        document.getElementById("modal-blocked-tutorial").showModal();
        document.getElementById("blocked-tutorial-open").href = `../../tutorial/?prog=${urlMyProgramQuery[1]}`;
        [document.getElementById("blocked-tutorial-open"), document.getElementById("modal-blocked-tutorial-close")].forEach(element => element.addEventListener("click", () => {
            document.getElementById("modal-blocked-tutorial").close();
        }));
    }
}

/**
Allow inline dragging and dropping of files in the editor, if files placeholders are enabled in the preferences.
*/
const editorDOM = editor.dom;
editorDOM.addEventListener("dragover", e => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
});
editorDOM.addEventListener("drop", e => {
    e.stopPropagation();
    e.preventDefault();
    for (const file of e.dataTransfer.files) {
        if (localStorage.getItem("code-editor-editor-filePlaceholders") !== "false") {
            const reader = new FileReader();
            reader.addEventListener("load", e => {
                editor.dispatch(editor.state.replaceSelection(`"${e.target.result}"`));
            })
            reader.readAsDataURL(file);
        }
    }
});

/**
Every 100 milliseconds, store the code in the code history object.
*/
codeHistoryInterval = setInterval(() => {
    codeHistory[`${Object.keys(codeHistory).length / 10}`] = editor.state.doc.toString();
}, 100);

/**
If the data version parameter is not the current data version, open the 'Invalid Data Version' modal.
*/
if (urlCodeQuery && (!urlDataVersionQuery || parseInt(urlDataVersionQuery[1]) !== 14)) {
    document.getElementById("modal-invalid-dv").showModal();
    document.getElementById("data-version").textContent = (
        !urlDataVersionQuery ? "version 3.0.0.8 or earlier"
        : (parseInt(urlDataVersionQuery[1]) === 1) ? "version 3.0.0.9"
        : (parseInt(urlDataVersionQuery[1]) === 2) ? "version 3.0.0.10"
        : (parseInt(urlDataVersionQuery[1]) === 3) ? "version 3.0.0.11"
        : (parseInt(urlDataVersionQuery[1]) === 4) ? "version 3.0.0.12"
        : (parseInt(urlDataVersionQuery[1]) === 5) ? "version 3.0.0.13"
        : (parseInt(urlDataVersionQuery[1]) === 6) ? "version 3.0.0.14"
        : (parseInt(urlDataVersionQuery[1]) === 7) ? "version 3.0.0.15"
        : (parseInt(urlDataVersionQuery[1]) === 8) ? "version 3.0.0.16"
        : (parseInt(urlDataVersionQuery[1]) === 9) ? "version 3.0.0.17"
        : (parseInt(urlDataVersionQuery[1]) === 10) ? "version 3.0.0.18"
        : (parseInt(urlDataVersionQuery[1]) === 11) ? "version 3.0.0.19"
        : (parseInt(urlDataVersionQuery[1]) === 12) ? "version 3.0.0.20"
        : (parseInt(urlDataVersionQuery[1]) === 13) ? "version 3.0.0.21"
        : (parseInt(urlDataVersionQuery[1]) > 14) ? "a future version"
        : "unknown"
    );
}

/**
The stuff below is for the Log tab. DO NOT MODIFY THIS CODE.
*/
function parseStack(stack) {
    return stack.split("\n").map(line => /^\s*([\w$*.]*)/.exec(line)[1] || "<anonymous>");
}

function expandError(target, val) {
    let frames = document.createElement("div");
    frames.className = "log-frames";
    for (let fn of parseStack(val.stack)) {
        frames.appendChild(document.createElement("div")).textContent = fn;
    }
    target.parentNode.replaceChild(frames, target);
}

function expandObj(node, val) {
    let content = document.createElement("div");
    content.className = "log-prop-table";
    function addProp(name) {
        let rendered;
        try {
            rendered = renderLoggable(val[name], 40);
        } catch(err) {
            return;
        }
        content.appendChild(span("tok-property", name + ": "));
        content.appendChild(rendered);
    }
    if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) addProp(String(i));
        node.parentNode.replaceChild(span("log-array", "[", content, "]"), node);
    } else {
        for (let prop of Object.keys(val)) addProp(prop);
        let children = ["{", content, "}"];
        if ((node.firstChild ).className === "tok-typeName") children.unshift(node.firstChild);
        node.parentNode.replaceChild(span("log-object", ...children), node);
    }
}

function span(cls, ...content) {
    let elt = document.createElement("span");
    elt.className = cls;
    for (let c of content) elt.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return elt;
}

function etcButton(onClick) {
    let etc = document.createElement("button");
    etc.textContent = "...";
    etc.className = "log-etc";
    etc.onclick = onClick;
    etc.setAttribute("aria-label", "expand");
    return etc;
}

function renderLoggable(value, space, top = false) {
    if (typeof value === "number") {
        return span("tok-number", String(value));
    }
    if (typeof value === "string") {
        return top ? document.createTextNode(value) : span("tok-string", JSON.stringify(value));
    }
    if (typeof value === "boolean") {
        return span("tok-bool", String(value));
    }
    if (value === null) {
        return span("tok-keyword", String(value))
    }
    let {function: fun, array, object, ctor, error} = value;
    if (error) {
        return span("tok-invalid", error, " ", etcButton(e => expandError(e.target , value)))
    } else if (fun) {
        return span("", span("tok-keyword", "function "), span("tok-variableName2", fun))
    } else if (array) {
        space -= 2;
        let children = ["["];
        let wrap;
        for (let elt of array) {
            if (children.length > 1) {
                children.push(", ");
                space -= 2;
            }
            let next = space > 0 && renderLoggable(elt, space);
            let nextSize = next ? next.textContent.length : 0;
            if (space - nextSize <= 0) {
                children.push(etcButton(() => expandObj(wrap, array)));
                break
            }
            space -= nextSize;
            children.push(next);
        }
        children.push("]");
        return wrap = span("log-array", ...children)
    } else {
        space -= 2;
        let children = [];
        let wrap;
        if (ctor && ctor != "Object") {
            children.push(span("tok-typeName", ctor + " "));
            space -= ctor.length + 1;
        }
        children.push("{");
        for (let prop of Object.keys(object)) {
            if (children[children.length - 1] !== "{") {
                space -= 2;
                children.push(", ");
            }
            let next = null;
            if (space > 0) {
                try {
                    next = renderLoggable(object[prop], space);
                } catch(err) {}
            }
            let nextSize = next ? prop.length + 2 + next.textContent.length : 0;
            if (!next || space - nextSize <= 0) {
                children.push(etcButton(() => expandObj(wrap, object)));
                break;
            }
            space -= nextSize;
            children.push(span("tok-property", prop + ": "), next);
        }
        children.push("}");
        return wrap = span("log-object", ...children)
    }
}

function showLog(values, type) {
    let wrap = document.createElement("div"), first = true;
    wrap.className = "log-" + type;
    for (let val of values) {
        if (first) {
            first = false;
        } else {
            wrap.appendChild(document.createTextNode(" "));
        }
        wrap.appendChild(renderLoggable(val, 60, true));
    }
    document.getElementById("log").appendChild(wrap);
}

/**
Helper function which runs the code in the Output tab.
*/
function run(coolDown = true) {
    if (canRunCode) {
        if (innerWidth < 1200) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("log").style.display = "none";
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
            document.getElementById("tab-log").classList.remove("active");
        }
        document.getElementById("output").textContent = document.getElementById("log").textContent = "";
        let frame = document.createElement("iframe");
        frame.src = "resources/sandbox.html";
        let code = editor.state.doc.toString();
        let channel = new MessageChannel();
        channel.port2.onmessage = e => {
            if (e.data.log) {
                showLog(e.data.elements, e.data.log);
                if (!document.getElementById("tab-log").classList.contains("active")) {
                    document.getElementById("tab-log").classList.add("new-logs");
                }
            }
        }
        frame.onload = () => {
            frame.contentWindow.postMessage({type: "load", code: code}, "*", [channel.port1]);
        }
        document.getElementById("output").appendChild(frame);
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
    document.getElementById("share-link").value = document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=14";
}

/**
Helper function that prepares the save modal when it is opened.
*/
function prepareSaveModal() {
    if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) {
        document.getElementById("save-name").value = decodeURIComponent(urlMyProgramQuery[1]);
    } else {
        const adjectives = [
            "Gangly",
            "Stupifying",
            "Jawdropping",
            "Mindblowing",
            "Deceiving",
            "Ungainly",
            "Unexpected",
            "Traumatizing",
            "Entertaining",
            "Horrifying",
            "Breathtaking",
            "Terrifying",
            "Lethal",
            "Unusual",
            "Mollifying",
            "Dirty",
            "Smelly",
            "Slippery",
            "Shiny",
            "Lumpy",
            "Sentient",
            "Overcooked",
            "Undercooked",
            "Melted",
            "Holy",
            "Cursed",
            "Traumatized",
            "Petrified",
            "Petrifying",
            "Beautiful",
            "Sunburnt"
        ];
        const plurals = [
            "Toasters",
            "Peanutbutter",
            "Apples",
            "Bellybuttonlint",
            "Toejam",
            "Breadtags",
            "Farts",
            "Dangleberries",
            "Catfur",
            "Elephants",
            "Blackheadremovers",
            "Toiletbrushes",
            "Bananas",
            "Monkeys",
            "Eyeballs",
            "Earwax",
            "Earwigs",
            "Bogans",
            "Armhairs",
            "Fingernails",
            "Trees",
            "Frogs",
            "Water",
            "Leaves",
            "Humans",
            "Onezies",
            "Snails",
            "Lightsabers",
            "Simpsons",
            "Coconuts",
            "Suitcases",
            "Dogs",
            "Cats",
            "Fish",
            "Umbrellas",
            "Animegirls",
            "Hammocks",
            "Printers",
            "Stormtroopers",
            "Snakes",
            "Snacks",
            "Bats",
            "Athletes",
            "Shoes",
            "Batarangs",
            "Gorillas"
        ];
        const adjective1 = adjectives[Math.floor(Math.random() * adjectives.length)];
        adjectives.splice(adjectives.indexOf(adjective1), 1);
        const adjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];
        const plural = plurals[Math.floor(Math.random() * plurals.length)];
        document.getElementById("save-name").value = `${adjective1}${adjective2}${plural}`;
    }
}

/**
Helper function that prepares the history modal when it is opened.
*/
function prepareHistoryModal() {
    clearInterval(codeHistoryInterval);
    document.getElementById("history-time").value = document.getElementById("history-time").max = document.getElementById("current-time").textContent = parseFloat(((Object.keys(codeHistory).length / 10) - 0.1).toFixed(1));
    document.getElementById("revert-code").textContent = `Revert to ${parseFloat(((Object.keys(codeHistory).length / 10) - 0.1).toFixed(1))}`;
    historyEditor.dispatch({
        changes: {from: 0, to: historyEditor.state.doc.length, insert: codeHistory[`${document.getElementById("history-time").value}`]}
    });
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
When the 'Save' button is clicked, open the save modal if the program in the search query is not found, otherwise, save the program.
*/
document.getElementById("save").addEventListener("click", e => {
    if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) {
        myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["program"] = editor.state.doc.toString();
        localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
        displayNotification(e.target, document.body, "Program found and successfully saved!", 2000);
    } else {
        document.getElementById("modal-save").showModal();
        prepareSaveModal();
    }
});

/**
When the 'Copy link' button in the share modal is clicked, copy the share link to the clipboard.
*/
document.getElementById("share-link-copy").addEventListener("click", e => {
    navigator.clipboard.writeText(document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=14");
    displayNotification(e.target, document.getElementById("modal-share"), "Link successfully copied!", 2000);
});

/**
When the 'Export / Download as Python' button in the share modal is clicked, download the code in a Python file.
*/
document.getElementById("share-export-python").addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = "main.py";
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
    const originalProgramName = document.getElementById("save-name").value || "Python";
    let programName = originalProgramName;
    let programNumber = 1;
    while (myPrograms.hasOwnProperty(programName)) {
        programName = `${originalProgramName} (${programNumber})`;
        programNumber++;
    }
    myPrograms[programName] = {};
    myPrograms[programName]["language"] = "python";
    myPrograms[programName]["program"] = editor.state.doc.toString();
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
When the slider in the history modal changes its value, change the editor's and some elements' text.
*/
document.getElementById("history-time").addEventListener("input", () => {
    document.getElementById("current-time").textContent = document.getElementById("history-time").value;
    document.getElementById("revert-code").textContent = `Revert to ${document.getElementById("history-time").value}`;
    historyEditor.dispatch({
        changes: {from: 0, to: historyEditor.state.doc.length, insert: codeHistory[`${document.getElementById("history-time").value}`]}
    });
});

/**
When the 'Play' or 'Pause' button in the history modal is clicked, play or pause the history replay.
*/
document.getElementById("history-play-pause").addEventListener("click", () => {
    if (document.getElementById("history-play-pause").textContent === "Play") {
        if (document.getElementById("history-time").value === document.getElementById("history-time").max) {
            document.getElementById("history-time").value = -0.1;
        }
        historyReplayInterval = setInterval(() => {
            document.getElementById("history-time").value = parseFloat(document.getElementById("history-time").value) + 0.1;
            document.getElementById("current-time").textContent = document.getElementById("history-time").value;
            document.getElementById("revert-code").textContent = `Revert to ${document.getElementById("history-time").value}`;
            historyEditor.dispatch({
                changes: {from: 0, to: historyEditor.state.doc.length, insert: codeHistory[`${document.getElementById("history-time").value}`]}
            });
            if (document.getElementById("history-time").value === document.getElementById("history-time").max) {
                clearInterval(historyReplayInterval);
                document.getElementById("history-play-pause").textContent = "Play";
            }
        }, 100);
        document.getElementById("history-play-pause").textContent = "Pause";
    } else {
        clearInterval(historyReplayInterval);
        document.getElementById("history-play-pause").textContent = "Play";
    }
});

/**
When the 'Revert to {0}' button in the history modal is clicked, revert the editor's code to the selected time.
*/
document.getElementById("revert-code").addEventListener("click", () => {
    editor.dispatch({
        changes: {from: 0, to: editor.state.doc.length, insert: codeHistory[`${document.getElementById("history-time").value}`]}
    });
    document.getElementById("modal-history").close();
    codeHistoryInterval = setInterval(() => {
        codeHistory[`${Object.keys(codeHistory).length / 10}`] = editor.state.doc.toString();
    }, 100);
});

/**
When the 'Close' button in the history modal is clicked, close the history modal.
*/
document.getElementById("modal-history-close").addEventListener("click", () => {
    document.getElementById("modal-history").close();
    codeHistoryInterval = setInterval(() => {
        codeHistory[`${Object.keys(codeHistory).length / 10}`] = editor.state.doc.toString();
    }, 100);
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
When the 'Clear Output' button is clicked, clear the Output and Log tabs.
*/
document.getElementById("clear").addEventListener("click", () => {
    let frame = document.createElement("iframe");
    document.getElementById("output").textContent = document.getElementById("log").textContent = "";
    document.getElementById("output").appendChild(frame);
    document.getElementById("tab-log").classList.remove("new-logs");
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
        document.getElementById("log").style.display = "none";
        document.getElementById("tab-output").classList.add("active");
        lastWideScreenTab = "output";
    } else {
        /**
        On wide screens, show the Editor and Output tabs.
        */
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
        document.getElementById("tab-output").classList.add("active");
        lastNarrowScreenTab = "editor";
    }
});

addEventListener("resize", () => {
    if (innerWidth < 1200) {
        /**
        When resizing to a narrow screen, show only one tab.
        */
        lastWideScreenTab = (
            document.getElementById("tab-output").classList.contains("active") ? "output"
            : document.getElementById("tab-log").classList.contains("active") ? "log"
            : "output"
        );
        if (lastNarrowScreenTab === "editor") {
            document.getElementById("tab-editor").classList.add("active");
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.remove("active");
            document.getElementById("editor").style.display = "block";
            document.getElementById("output").style.display = "none";
            document.getElementById("log").style.display = "none";
        } else if (lastNarrowScreenTab === "output") {
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
            document.getElementById("tab-log").classList.remove("active");
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("log").style.display = "none";
        } else if (lastNarrowScreenTab === "log") {
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.add("active");
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "none";
            document.getElementById("log").style.display = "block";
        }
    } else {
        /**
        When resizing to a wide screen, show the Editor, and one other tab.
        */
        lastNarrowScreenTab = (
            document.getElementById("tab-editor").classList.contains("active") ? "editor"
            : document.getElementById("tab-output").classList.contains("active") ? "output"
            : document.getElementById("tab-log").classList.contains("active") ? "log"
            : "editor"
        );
        document.getElementById("editor").style.display = "block";
        if (lastWideScreenTab === "output") {
            document.getElementById("tab-output").classList.add("active");
            document.getElementById("tab-log").classList.remove("active");
            document.getElementById("output").style.display = "block";
            document.getElementById("log").style.display = "none";
        } else if (lastWideScreenTab === "log") {
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.add("active");
            document.getElementById("output").style.display = "none";
            document.getElementById("log").style.display = "block";
        }
    }
});

/**
When the 'Editor' button is clicked, open the Editor tab on small devices.
*/
document.getElementById("tab-editor").addEventListener("click", () => {
    lastNarrowScreenTab = "editor";
    document.getElementById("tab-editor").classList.add("active");
    document.getElementById("tab-output").classList.remove("active");
    document.getElementById("tab-log").classList.remove("active");
    document.getElementById("editor").style.display = "block";
    document.getElementById("output").style.display = "none";
    document.getElementById("log").style.display = "none";
});

/**
When the 'Output' button is clicked, open the Output tab.
*/
document.getElementById("tab-output").addEventListener("click", () => {
    if (innerWidth < 1200) {
        lastNarrowScreenTab = "output";
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.add("active");
        document.getElementById("tab-log").classList.remove("active");
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
    } else {
        lastWideScreenTab = "output";
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.add("active");
        document.getElementById("tab-log").classList.remove("active");
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
    }
});

/**
When the 'Log' button is clicked, open the Log tab.
*/
document.getElementById("tab-log").addEventListener("click", () => {
    document.getElementById("tab-log").classList.remove("new-logs");
    if (innerWidth < 1200) {
        lastNarrowScreenTab = "log";
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.remove("active");
        document.getElementById("tab-log").classList.add("active");
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "none";
        document.getElementById("log").style.display = "block";
    } else {
        lastWideScreenTab = "log";
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.remove("active");
        document.getElementById("tab-log").classList.add("active");
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "none";
        document.getElementById("log").style.display = "block";
    }
});
