/**
Import all required CodeMirror and Lezer modules.
*/
import {EditorState, StateEffect} from "https://codemirror.net/try/mods/@codemirror-state.js";
import {search, highlightSelectionMatches, searchKeymap} from "https://codemirror.net/try/mods/@codemirror-search.js";
import {EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, rectangularSelection, crosshairCursor} from "https://codemirror.net/try/mods/@codemirror-view.js";
import {defaultKeymap, history, historyKeymap} from "https://codemirror.net/try/mods/@codemirror-commands.js";
import {tags} from "https://codemirror.net/try/mods/@lezer-highlight.js";
import {indentUnit, syntaxHighlighting, HighlightStyle, foldGutter, indentOnInput, bracketMatching, foldKeymap} from "https://codemirror.net/try/mods/@codemirror-language.js";
import {closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap} from "https://codemirror.net/try/mods/@codemirror-autocomplete.js";
import {lintKeymap} from "https://codemirror.net/try/mods/@codemirror-lint.js";
import {json} from "https://codemirror.net/try/mods/@codemirror-lang-json.js";
import {languages} from "https://codemirror.net/try/mods/@codemirror-language-data.js";
import {markdown, markdownLanguage} from "https://codemirror.net/try/mods/@codemirror-lang-markdown.js";

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
Create a fresh, empty My Programs object for new users.
*/
if (!localStorage.getItem("code-editor-my-programs")) {
    localStorage.setItem("code-editor-my-programs", "{}");
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
Parse the My Programs object into an iterable value.
*/
const myPrograms = JSON.parse(localStorage.getItem("code-editor-my-programs"));

/**
Iterate over each of the user's programs.
*/
for (const program in myPrograms) {
    let programLink = document.createElement("a");
    programLink.href = `../languages/${myPrograms[program]["language"]}/?prog=${encodeURIComponent(program)}`;
    programLink.classList.add("blocklink");
    let programLabel = document.createElement("strong");
    programLabel.textContent = program;
    let programListItem = document.createElement("li");
    document.getElementById("my-programs-list").appendChild(programListItem);
    programListItem.appendChild(programLink);
    programLink.appendChild(programLabel);
}

/**
Show a message if the user has no programs.
*/
if (Object.keys(myPrograms).length === 0) {
    document.getElementById("my-programs-list").style.display = "none";
    document.getElementById("no-programs").style.display = "block";
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
Helper function that prepares the edit modal when it is opened.
*/
function prepareEditModal(program) {
    editModalEditor.dispatch({
        changes: {from: 0, to: editModalEditor.state.doc.length, insert: JSON.stringify(program, null, localStorage.getItem("code-editor-editor-indentUnit"))}
    });
    try {
        if (JSON.parse(editModalEditor.state.doc.toString()).hasOwnProperty("tutorial:text") && JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"] instanceof Object && JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"].constructor === Object) {
            document.getElementById("tutorial-found-message").style.display = "block";
        } else {
            document.getElementById("tutorial-found-message").style.display = "none";
        }
    } catch(err) {
        document.getElementById("tutorial-found-message").style.display = "none";
    }
}

/**
Helper function that prepares the tutorial modal when it is opened.
*/
function prepareTutorialModal() {
    
}

/**
After selecting a command from the 'Select a command...' select menu, change the parameters visible to the user.
*/
document.getElementById("actions").addEventListener("change", () => {
    if (document.getElementById("actions").value === "clone" || document.getElementById("actions").value === "rename") {
        document.getElementById("command-parameter-1").disabled = false;
        document.getElementById("command-parameter-1").value = "";
        document.getElementById("command-parameter-2").style.display = "unset";
        document.getElementById("command-parameter-2").value = "";
    } else if (document.getElementById("actions").value === "delete" || document.getElementById("actions").value === "edit") {
        document.getElementById("command-parameter-1").disabled = false;
        document.getElementById("command-parameter-1").value = "";
        document.getElementById("command-parameter-2").style.display = "none";
        document.getElementById("command-parameter-2").value = "";
    } else {
        document.getElementById("command-parameter-1").disabled = true;
        document.getElementById("command-parameter-1").value = "";
        document.getElementById("command-parameter-2").style.display = "none";
        document.getElementById("command-parameter-2").value = "";
    }
});

/**
Run a specific command after clicking on the 'Run command' button.
*/
document.getElementById("run-command").addEventListener("click", e => {
    if (document.getElementById("actions").value === "clone") {
        if (myPrograms.hasOwnProperty(document.getElementById("command-parameter-1").value)) {
            if (document.getElementById("command-parameter-1").value !== document.getElementById("command-parameter-2").value) {
                let programCloneName = document.getElementById("command-parameter-2").value || `${document.getElementById("command-parameter-1").value} (clone)`;
                myPrograms[programCloneName] = myPrograms[document.getElementById("command-parameter-1").value];
                localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
                displayNotification(e.target, document.body, "Program successfully cloned!", 2000);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                displayNotification(e.target, document.body, `ERROR: Clone name is same as original name`, 2000);
            }
        } else {
            displayNotification(e.target, document.body, `ERROR: '${document.getElementById("command-parameter-1").value}' is not an existing program`, 2000);
        }
    } else if (document.getElementById("actions").value === "delete") {
        if (myPrograms.hasOwnProperty(document.getElementById("command-parameter-1").value)) {
            delete myPrograms[document.getElementById("command-parameter-1").value];
            localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
            displayNotification(e.target, document.body, "Program successfully deleted!", 2000);
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            displayNotification(e.target, document.body, `ERROR: '${document.getElementById("command-parameter-1").value}' is not an existing program`, 2000);
        }
    } else if (document.getElementById("actions").value === "edit") {
        if (myPrograms.hasOwnProperty(document.getElementById("command-parameter-1").value)) {
            document.getElementById("modal-edit").showModal();
            prepareEditModal(myPrograms[document.getElementById("command-parameter-1").value]);
        } else {
            displayNotification(e.target, document.body, `ERROR: '${document.getElementById("command-parameter-1").value}' is not an existing program`, 2000);
        }
    } else if (document.getElementById("actions").value === "rename") {
        if (myPrograms.hasOwnProperty(document.getElementById("command-parameter-1").value)) {
            if (document.getElementById("command-parameter-1").value !== document.getElementById("command-parameter-2").value) {
                if (document.getElementById("command-parameter-2").value) {
                    const originalProgramNewName = document.getElementById("command-parameter-2").value;
                    let programNewName = originalProgramNewName;
                    let programNumber = 1;
                    while (myPrograms.hasOwnProperty(programNewName)) {
                        programNewName = `${originalProgramNewName} (${programNumber})`;
                        programNumber++;
                    }
                    myPrograms[programNewName] = myPrograms[document.getElementById("command-parameter-1").value];
                    delete myPrograms[document.getElementById("command-parameter-1").value];
                    localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
                    displayNotification(e.target, document.body, "Program successfully renamed!", 2000);
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    displayNotification(e.target, document.body, `ERROR: New name is not specified`, 2000);
                }
            } else {
                displayNotification(e.target, document.body, `ERROR: New name is same as old name`, 2000);
            }
        } else {
            displayNotification(e.target, document.body, `ERROR: '${document.getElementById("command-parameter-1").value}' is not an existing program`, 2000);
        }
    }
});

/**
Helper function that 'injects' an extension into the CodeMirror editor.
*/
function injectExtension(editor, extension) {
    editor.dispatch({
        effects: StateEffect.appendConfig.of(extension)
    });
}

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
Define a universal highlight style, for use in the tutorial editor.
*/
const universalMarkdownTheme = HighlightStyle.define([
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
const lightMarkdownTheme = HighlightStyle.define([
    {tag: tags.link, color: "#736000"},
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
const darkMarkdownTheme = HighlightStyle.define([
    {tag: tags.link, color: "#f2e088"},
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
const spookyMarkdownTheme = HighlightStyle.define([
    {tag: tags.link, color: "#fff2b2"},
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
Create an editor in the edit modal.
*/
const editModalEditor = new EditorView({
    state: EditorState.create({
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
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap
            ]),
            EditorView.lineWrapping,
            json(),
            search({
                top: true
            }),
            EditorState.tabSize.of(localStorage.getItem("code-editor-editor-tabSize")),
            indentUnit.of(localStorage.getItem("code-editor-editor-indentUnit")),
            syntaxHighlighting(universalTheme)
        ]
    }),
    parent: document.getElementById("modal-edit-view")
});

/**
Create an editor in the tutorial modal.
*/
const tutorialModalEditor = new EditorView({
    state: EditorState.create({
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
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap
            ]),
            EditorView.lineWrapping,
            markdown({
                base: markdownLanguage,
                codeLanguages: languages
            }),
            search({
                top: true
            }),
            EditorState.tabSize.of(localStorage.getItem("code-editor-editor-tabSize")),
            indentUnit.of(localStorage.getItem("code-editor-editor-indentUnit")),
            syntaxHighlighting(universalMarkdownTheme)
        ]
    }),
    parent: document.getElementById("modal-tutorial-view")
});

/**
Add some extensions to the editors.
*/
if (localStorage.getItem("code-editor-editor-vscodeKeymap") !== "false") {
    /**
    If the Visual Studio key bindings are enabled in the preferences, inject the keymap as an extension.
    */
    injectExtension(editModalEditor, keymap.of([...vscodeKeymap]));
    injectExtension(tutorialModalEditor, keymap.of([...vscodeKeymap]));
} else if (localStorage.getItem("code-editor-editor-indentWithTab") !== "false") {
    /**
    If indenting with tab is enabled in the preferences, inject the keymap as an extension.
    */
    injectExtension(editModalEditor, keymap.of([indentWithTab]));
    injectExtension(tutorialModalEditor, keymap.of([indentWithTab]));
}
if (localStorage.getItem("code-editor-editor-filePlaceholders") !== "false") {
    /**
    If file placeholders are enabled in the preferences, inject the placeholders as an extension.
    */
    injectExtension(editModalEditor, filePlaceholders);
    injectExtension(tutorialModalEditor, filePlaceholders);
}
if (localStorage.getItem("code-editor-editor-interact") !== "false") {
    /**
    If the interact feature is enabled in the preferences, inject it as an extension.
    */
    injectExtension(editModalEditor, interact({
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
    injectExtension(tutorialModalEditor, interact({
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
    injectExtension(editModalEditor, rectangularSelection());
    injectExtension(editModalEditor, crosshairCursor());
    injectExtension(tutorialModalEditor, rectangularSelection());
    injectExtension(tutorialModalEditor, crosshairCursor());
} else {
    /**
    Otherwise, add selections when clicking with the Alt key held down.
    */
    injectExtension(editModalEditor, EditorView.clickAddsSelectionRange.of(e => e.altKey));
    injectExtension(tutorialModalEditor, EditorView.clickAddsSelectionRange.of(e => e.altKey));
}
if (localStorage.getItem("code-editor-editor-indentationMarkers") !== "false") {
    injectExtension(editModalEditor, indentationMarkers());
    injectExtension(tutorialModalEditor, indentationMarkers());
}
if (localStorage.getItem("code-editor-site-theme") === "light") {
    injectExtension(editModalEditor, syntaxHighlighting(lightTheme));
    injectExtension(tutorialModalEditor, syntaxHighlighting(lightMarkdownTheme));
} else if (localStorage.getItem("code-editor-site-theme") === "dark") {
    injectExtension(editModalEditor, syntaxHighlighting(darkTheme));
    injectExtension(tutorialModalEditor, syntaxHighlighting(darkMarkdownTheme));
} else if (localStorage.getItem("code-editor-site-theme") === "spooky") {
    injectExtension(editModalEditor, syntaxHighlighting(spookyTheme));
    injectExtension(tutorialModalEditor, syntaxHighlighting(spookyMarkdownTheme));
}

/**
When the 'Save' button in the edit modal is clicked, save the program's JSON.
*/
document.getElementById("modal-edit-save").addEventListener("click", e => {
    try {
        myPrograms[document.getElementById("command-parameter-1").value] = JSON.parse(editModalEditor.state.doc.toString());
        localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
        displayNotification(e.target, document.getElementById("modal-edit"), "JSON successfully saved!", 2000);
    } catch(err) {
        displayNotification(e.target, document.getElementById("modal-edit"), "ERROR: Invalid JSON", 2000);
    }
});

/**
When the 'Close' button in the edit modal is clicked, close the edit modal.
*/
document.getElementById("modal-edit-close").addEventListener("click", () => {
    document.getElementById("modal-edit").close();
});

/**
When the editor's value is changed, check for any tutorials.
*/
editModalEditor.dom.addEventListener("keyup", () => {
    try {
        if (JSON.parse(editModalEditor.state.doc.toString()).hasOwnProperty("tutorial:text") && JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"] instanceof Object && JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"].constructor === Object) {
            document.getElementById("tutorial-found-message").style.display = "block";
        } else {
            document.getElementById("tutorial-found-message").style.display = "none";
        }
    } catch(err) {
        document.getElementById("tutorial-found-message").style.display = "none";
    }
});

/**
When the 'Yes' button in the tutorial-detected menu is clicked, open the tutorial editor.
*/
document.getElementById("tutorial-edit").addEventListener("click", e => {
    try {
        myPrograms[document.getElementById("command-parameter-1").value] = JSON.parse(editModalEditor.state.doc.toString());
        localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
        displayNotification(e.target, document.getElementById("modal-edit"), "JSON successfully saved, loading the tutorial modal...", 2000);
    } catch(err) {
        displayNotification(e.target, document.getElementById("modal-edit"), "ERROR: Invalid JSON", 2000);
    }
    document.getElementById("modal-edit").close();
    document.getElementById("modal-tutorial").showModal();
    if (JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"].hasOwnProperty("title") && typeof JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"]["title"] === "string") {
        document.getElementById("modal-tutorial-title").value = JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"]["title"];
    }
    if (JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"].hasOwnProperty("body") && typeof JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"]["body"] === "string") {
        tutorialModalEditor.dispatch({
            changes: {from: 0, to: tutorialModalEditor.state.doc.length, insert: JSON.parse(editModalEditor.state.doc.toString())["tutorial:text"]["body"]}
        });
    }
    prepareTutorialModal();
});

/**
When the 'Save and Go Back' button in the tutorial modal is clicked, save the tutorial, and go back to the edit modal.
*/
document.getElementById("modal-tutorial-save").addEventListener("click", () => {
    const rawJSON = JSON.parse(editModalEditor.state.doc.toString());
    rawJSON["tutorial:text"] = {
        "title": document.getElementById("modal-tutorial-title").value,
        "body": tutorialModalEditor.state.doc.toString()
    }
    editModalEditor.dispatch({
        changes: {from: 0, to: editModalEditor.state.doc.length, insert: JSON.stringify(rawJSON, null, localStorage.getItem("code-editor-editor-indentUnit"))}
    });
    document.getElementById("modal-tutorial").close();
    document.getElementById("modal-edit").showModal();
    prepareTutorialModal();
});
