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
import {languages} from "https://codemirror.net/try/mods/@codemirror-language-data.js";
import {markdown, markdownLanguage} from "https://codemirror.net/try/mods/@codemirror-lang-markdown.js";

/**
Import an file placeholder extension, for use later.
*/
import filePlaceholders from "./scripts/file-placeholder.js";

/**
Import an indenting with tab extension, for use later.
*/
import indentWithTab from "./scripts/indent-with-tab.js";

/**
Import all required Replit and Emmet modules.
*/
import {vscodeKeymap} from '../node-modules/@replit/codemirror-vscode-keymap/dist/index.js';
import interact from '../node-modules/@replit/codemirror-interact/dist/index.js';
import {indentationMarkers} from '../node-modules/@replit/codemirror-indentation-markers/dist/index.js';
import {colorPicker} from '../node-modules/@replit/codemirror-css-color-picker/dist/index.js';

/**
Add 'eslint' to globalThis.
*/
import '../node-modules/eslint-linter-browserify/linter.js';

/**
Set the editor's default JavaScript completion source to "scope", for new users.
*/
if (!localStorage.getItem("code-editor-editor-jsCompletionSource")) {
    localStorage.setItem("code-editor-editor-jsCompletionSource", "scope");
}

/**
Set the editor's default JavaScript completion scope to "globalThis", for new users.
*/
if (!localStorage.getItem("code-editor-editor-jsCompletionScope")) {
    localStorage.setItem("code-editor-editor-jsCompletionScope", "globalThis");
}

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
Make the code 'preview-able', to preview the code as soon as the page loads.
*/
let canPreviewCode = true;

/**
Create an object to store previous versions of the code, and two variables to store a setInterval, for use later.
*/
let codeHistory = {}, codeHistoryInterval, historyReplayInterval;

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
    {tag: tags.heading, fontWeight: "bold"},
    {tag: tags.heading1, fontSize: "1.2em", fontWeight: "bold"},
    {tag: tags.heading2, fontSize: "1.1em", fontWeight: "bold"},
    {tag: tags.heading3, fontSize: "1.05em", fontWeight: "bold"},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"}
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
                {key: "Mod-Enter", run: preview},
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
            markdown({
                base: markdownLanguage,
                codeLanguages: languages
            }),
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
    if (localStorage.getItem("code-editor-editor-colorPicker") !== "false") {
        /**
        If the CSS color picker is enabled in the preferences, inject it as an extension.
        */
        injectExtension(editor, colorPicker);
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
                {key: "Mod-Enter", run: preview},
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap
            ]),
            EditorView.lineWrapping,
            markdown(),
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
Make the 'Preview' button in the context menu preview the code.
*/
document.getElementById("ctx-menu-btn-preview").addEventListener("click", () => {
    editor.focus();
    preview(true);
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
    return `# Hello!
This *is* **markdown**!
`;
}

/**
Helper function which returns all the examples, which can be accessed by opening the 'Select example...' dropdown at the top.
*/
function getExamples() {
    return {
        "Basic formatting": `# I'm the largest possible heading

## I'm the second largest possible heading

###### I'm the smallest possible heading

**This text is bold!**

*This text is italicized!*

**This text is striked out!**

**This text is _very, very_ important!**

***Every part of this text is important!***

\`\`\`This is inline code.\`\`\`
\`\`\`
This is a code block!
Hello!
\`\`\`

Check out the code editor by going [here](${location.origin}/code-editor/3/)!

![This is an image](${location.origin}/code-editor/3/languages/javascript/resources/sprites/bean.png)

- This
- is an
- unordered list!

* This is
* also an
* unordered list!

+ This is
+ another
+ unordered list!

1. This
2. is an
3. ordered list!

1. This is a list item!
${localStorage.getItem("code-editor-editor-indentUnit")}- This is a nested list item!
${localStorage.getItem("code-editor-editor-indentUnit").repeat(2)}- This is another nested list item!

These \\*asterisks\\* are ignored because of the backslash!
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
        preview(false);
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
    (urlCodeQuery && urlDataVersionQuery && parseInt(urlDataVersionQuery[1]) === 14) ? decodeParameter(urlCodeQuery[1])
    : (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) ? myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["program"]
    : (urlFilenameQuery && files.hasOwnProperty(urlFilenameQuery[1])) ? files[urlFilenameQuery[1]]
    : (urlExampleQuery && examples.hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) ? examples[decodeURIComponent(urlExampleQuery[1])]
    : getDefaultCode()
);

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
Allow inline dragging and dropping of files in the editor, if file placeholders are enabled in the preferences.
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
Helper function which previews the code in the Output tab.
*/
function preview(coolDown = true) {
    if (canPreviewCode) {
        if (innerWidth < 1200) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
        }
        document.getElementById("output").textContent = "";
        let frame = document.createElement("iframe");
        document.getElementById("output").appendChild(frame);
        let frameDoc = frame.contentDocument || frame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(`<!DOCTYPE html>
<html lang="en-US">

<head>
    <title>DrRcraft Markdown Sandbox</title>
    <style>
        .tok-keyword, .fn, .keyword {color: #005cb8;}
        .tok-atom {color: #005cb8;}
        .tok-bool {color: #004182;}
        .tok-number, .prim {color: #466900;}
        .tok-attribute {color: #004182;}
        .tok-typeName, .tok-className {color: #005cb8;}
        .tok-literal {color: #736000;}
        .tok-comment {color: #98999c;}
        .tok-string, .string {color: #964b00;}
        .tok-string2 {color: #ab2980;}
        .tok-propertyName {color: #004182;}
        .tok-operator {color: #004182;}
        .tok-labelName, .tok-function {color: #736000;}
        .tok-meta {color: #005cb8;}
        .tok-angleBracket {color: #5c5f66;}
        .tok-invalid {color: #c00;}
    </style>
</head>

<body></body>

</html>
`);
        frameDoc.close();
        let prismScript = document.createElement("script");
        prismScript.type = "module";
        prismScript.src = "../../tutorial/scripts/highlighter.min.js";
        frameDoc.body.appendChild(prismScript);
        let markdownScript = document.createElement("script");
        markdownScript.type = "module";
        markdownScript.src = "https://unpkg.com/md-block/md-block.js";
        frameDoc.body.appendChild(markdownScript);
        let markdownBlock = document.createElement("md-block");
        markdownBlock.textContent = editor.state.doc.toString();
        frameDoc.body.appendChild(markdownBlock);
        if (coolDown) {
            canPreviewCode = false;
            document.getElementById("preview").textContent = ". . .";
            setTimeout(() => {
                canPreviewCode = true;
                document.getElementById("preview").textContent = "Preview";
            }, 500);
        }
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
When the 'Preview' button is clicked, preview the code.
*/
document.getElementById("preview").addEventListener("click", () => {
    preview(true);
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
When the 'Export / Download as Markdown' button in the share modal is clicked, download the code in a Markdown file.
*/
document.getElementById("share-export-markdown").addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = "index.md";
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
    const originalProgramName = document.getElementById("save-name").value || "Markdown (experimental)";
    let programName = originalProgramName;
    let programNumber = 1;
    while (myPrograms.hasOwnProperty(programName)) {
        programName = `${originalProgramName} (${programNumber})`;
        programNumber++;
    }
    myPrograms[programName] = {};
    myPrograms[programName]["language"] = "markdown";
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
    preview(false);
    document.getElementById("modal-invalid-dv").close();
});

/**
When the 'Use Default Code' button in the 'Invalid Data Version' modal is clicked, close the 'Invalid Data Version' modal.
*/
document.getElementById("invalid-dv-load-default").addEventListener("click", () => {
    document.getElementById("modal-invalid-dv").close();
});

/**
Preview the code when the page loads.
*/
preview(false);

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
