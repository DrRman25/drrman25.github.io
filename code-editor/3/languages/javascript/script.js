import {EditorState, StateEffect} from "https://codemirror.net/try/mods/@codemirror-state.js";
import {search, highlightSelectionMatches, searchKeymap} from "https://codemirror.net/try/mods/@codemirror-search.js";
import {EditorView, keymap, placeholder, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, rectangularSelection, crosshairCursor} from "https://codemirror.net/try/mods/@codemirror-view.js";
import {defaultKeymap, history, historyKeymap} from "https://codemirror.net/try/mods/@codemirror-commands.js";
import {tags} from "https://codemirror.net/try/mods/@lezer-highlight.js";
import {indentUnit, syntaxHighlighting, HighlightStyle, foldGutter, indentOnInput, bracketMatching, foldKeymap} from "https://codemirror.net/try/mods/@codemirror-language.js";
import {closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap} from "https://codemirror.net/try/mods/@codemirror-autocomplete.js";
import {linter, lintKeymap} from "https://codemirror.net/try/mods/@codemirror-lint.js";
import {vscodeKeymap} from '../node-modules/@replit/codemirror-vscode-keymap/dist/index.js';
import interact from '../node-modules/@replit/codemirror-interact/dist/index.js';
import {indentationMarkers} from '../node-modules/@replit/codemirror-indentation-markers/dist/index.js';
import {javascript, javascriptLanguage, scopeCompletionSource, esLint} from "https://codemirror.net/try/mods/@codemirror-lang-javascript.js";
import '../node-modules/eslint-linter-browserify/linter.js';

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

if (!localStorage.getItem("code-editor-editor-rectangularSelection")) {
    localStorage.setItem("code-editor-editor-rectangularSelection", false);
}

if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

let editor;
let lastWideScreenTab, lastNarrowScreenTab;
let canRunCode = true;
const urlCodeQuery = /[?&]c=([^&]+)/.exec(document.location.search);
const urlMyProgramQuery = /[?&]prog=([^&]+)/.exec(document.location.search);
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
            javascript(),
            javascriptLanguage.data.of({autocomplete: scopeCompletionSource(globalThis)}),
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
    if (localStorage.getItem("code-editor-editor-rectangularSelection") != "false") {
        injectExtension(rectangularSelection());
        injectExtension(crosshairCursor());
    } else {
        injectExtension(EditorView.clickAddsSelectionRange.of(e => e.altKey));
    }
    if (localStorage.getItem("code-editor-site-theme") === "light") {
        injectExtension(syntaxHighlighting(lightTheme));
    }
    if (localStorage.getItem("code-editor-site-theme") === "dark") {
        injectExtension(syntaxHighlighting(darkTheme));
    }
    if (localStorage.getItem("code-editor-site-theme") === "spooky") {
        injectExtension(syntaxHighlighting(spookyTheme));
    }
}

function getDefaultCode() {
    return `console.log('Hello, world!');
`;
}

function getExamples() {
    return {
        "Basic console output": `console.log('Hello, world!'); // Informational message
console.warn('Hello, world!'); // Warning message
console.error('Hello, world!'); // Error message
`,
        "Using variables": `var x = 5; // Can be changed and re-declared
let y = 5; // Can be changed, and cannot be re-declared
const z = 5; // Cannot be changed or re-declared; is a constant reference

var x;
x += 2;
console.log(x);

// Try changing x to y and z in lines 5 to 7,
// and commenting out some lines,
// and see what happens!
`,
    };
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

document.getElementById("examples").addEventListener("change", () => {
    let exampleValue = document.getElementById("examples").value;
    if (examples.hasOwnProperty(exampleValue)) {
        window.history.pushState({}, "", document.location.toString().replace(/[#?].*/, "") + "?example=" + encodeURIComponent(exampleValue));
        loadCode(examples[exampleValue]);
        run(false);
    }
    document.getElementById("examples").selectedIndex = 0;
});

import myPrograms from "./scripts/my-programs.js";

loadCode(
    (urlCodeQuery && urlDataVersionQuery && parseInt(urlDataVersionQuery[1]) === 8) ? decodeParameter(urlCodeQuery[1])
    : (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) ? myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["program"]
    : (urlExampleQuery && examples.hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) ? examples[decodeURIComponent(urlExampleQuery[1])]
    : getDefaultCode()
);

if (urlCodeQuery && (!urlDataVersionQuery || parseInt(urlDataVersionQuery[1]) != 8)) {
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
        : (parseInt(urlDataVersionQuery[1]) > 8) ? "(future version - 3.0.0.17+)"
        : "unknown"
    );
}

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
            return
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
                }
                catch(err) {
                    // nothing here lol
                }
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

const codemirrorLezerPackages = [
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/lang-cpp',
    '@codemirror/lang-css',
    '@codemirror/lang-html',
    '@codemirror/lang-java',
    '@codemirror/lang-javascript',
    '@codemirror/lang-json',
    '@codemirror/lang-lezer',
    '@codemirror/lang-markdown',
    '@codemirror/lang-php',
    '@codemirror/lang-python',
    '@codemirror/lang-rust',
    '@codemirror/lang-sql',
    '@codemirror/lang-wast',
    '@codemirror/lang-xml',
    '@codemirror/language-data',
    '@codemirror/language',
    '@codemirror/legacy-modes/mode/apl',
    '@codemirror/legacy-modes/mode/asciiarmor',
    '@codemirror/legacy-modes/mode/asn1',
    '@codemirror/legacy-modes/mode/asterisk',
    '@codemirror/legacy-modes/mode/brainfuck',
    '@codemirror/legacy-modes/mode/clike',
    '@codemirror/legacy-modes/mode/clojure',
    '@codemirror/legacy-modes/mode/cmake',
    '@codemirror/legacy-modes/mode/cobol',
    '@codemirror/legacy-modes/mode/coffeescript',
    '@codemirror/legacy-modes/mode/commonlisp',
    '@codemirror/legacy-modes/mode/crystal',
    '@codemirror/legacy-modes/mode/css',
    '@codemirror/legacy-modes/mode/cypher',
    '@codemirror/legacy-modes/mode/d',
    '@codemirror/legacy-modes/mode/diff',
    '@codemirror/legacy-modes/mode/dockerfile',
    '@codemirror/legacy-modes/mode/dtd',
    '@codemirror/legacy-modes/mode/dylan',
    '@codemirror/legacy-modes/mode/ebnf',
    '@codemirror/legacy-modes/mode/ecl',
    '@codemirror/legacy-modes/mode/eiffel',
    '@codemirror/legacy-modes/mode/elm',
    '@codemirror/legacy-modes/mode/erlang',
    '@codemirror/legacy-modes/mode/factor',
    '@codemirror/legacy-modes/mode/fcl',
    '@codemirror/legacy-modes/mode/forth',
    '@codemirror/legacy-modes/mode/fortran',
    '@codemirror/legacy-modes/mode/gas',
    '@codemirror/legacy-modes/mode/gherkin',
    '@codemirror/legacy-modes/mode/go',
    '@codemirror/legacy-modes/mode/groovy',
    '@codemirror/legacy-modes/mode/haskell',
    '@codemirror/legacy-modes/mode/haxe',
    '@codemirror/legacy-modes/mode/http',
    '@codemirror/legacy-modes/mode/idl',
    '@codemirror/legacy-modes/mode/javascript',
    '@codemirror/legacy-modes/mode/jinja2',
    '@codemirror/legacy-modes/mode/julia',
    '@codemirror/legacy-modes/mode/livescript',
    '@codemirror/legacy-modes/mode/lua',
    '@codemirror/legacy-modes/mode/mathematica',
    '@codemirror/legacy-modes/mode/mbox',
    '@codemirror/legacy-modes/mode/mirc',
    '@codemirror/legacy-modes/mode/mllike',
    '@codemirror/legacy-modes/mode/modelica',
    '@codemirror/legacy-modes/mode/mscgen',
    '@codemirror/legacy-modes/mode/mumps',
    '@codemirror/legacy-modes/mode/nginx',
    '@codemirror/legacy-modes/mode/nsis',
    '@codemirror/legacy-modes/mode/ntriples',
    '@codemirror/legacy-modes/mode/octave',
    '@codemirror/legacy-modes/mode/oz',
    '@codemirror/legacy-modes/mode/pascal',
    '@codemirror/legacy-modes/mode/perl',
    '@codemirror/legacy-modes/mode/pig',
    '@codemirror/legacy-modes/mode/powershell',
    '@codemirror/legacy-modes/mode/properties',
    '@codemirror/legacy-modes/mode/protobuf',
    '@codemirror/legacy-modes/mode/puppet',
    '@codemirror/legacy-modes/mode/python',
    '@codemirror/legacy-modes/mode/q',
    '@codemirror/legacy-modes/mode/r',
    '@codemirror/legacy-modes/mode/rpm',
    '@codemirror/legacy-modes/mode/ruby',
    '@codemirror/legacy-modes/mode/rust',
    '@codemirror/legacy-modes/mode/sas',
    '@codemirror/legacy-modes/mode/sass',
    '@codemirror/legacy-modes/mode/scheme',
    '@codemirror/legacy-modes/mode/shell',
    '@codemirror/legacy-modes/mode/sieve',
    '@codemirror/legacy-modes/mode/simple-mode',
    '@codemirror/legacy-modes/mode/smalltalk',
    '@codemirror/legacy-modes/mode/solr',
    '@codemirror/legacy-modes/mode/sparql',
    '@codemirror/legacy-modes/mode/spreadsheet',
    '@codemirror/legacy-modes/mode/sql',
    '@codemirror/legacy-modes/mode/stex',
    '@codemirror/legacy-modes/mode/stylus',
    '@codemirror/legacy-modes/mode/swift',
    '@codemirror/legacy-modes/mode/tcl',
    '@codemirror/legacy-modes/mode/textile',
    '@codemirror/legacy-modes/mode/tiddlywiki',
    '@codemirror/legacy-modes/mode/tiki',
    '@codemirror/legacy-modes/mode/toml',
    '@codemirror/legacy-modes/mode/troff',
    '@codemirror/legacy-modes/mode/ttcn-cfg',
    '@codemirror/legacy-modes/mode/ttcn',
    '@codemirror/legacy-modes/mode/turtle',
    '@codemirror/legacy-modes/mode/vb',
    '@codemirror/legacy-modes/mode/vbscript',
    '@codemirror/legacy-modes/mode/velocity',
    '@codemirror/legacy-modes/mode/verilog',
    '@codemirror/legacy-modes/mode/vhdl',
    '@codemirror/legacy-modes/mode/wast',
    '@codemirror/legacy-modes/mode/webidl',
    '@codemirror/legacy-modes/mode/xml',
    '@codemirror/legacy-modes/mode/xquery',
    '@codemirror/legacy-modes/mode/yacas',
    '@codemirror/legacy-modes/mode/yaml',
    '@codemirror/legacy-modes/mode/z80',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/theme-one-dark',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/cpp',
    '@lezer/css',
    '@lezer/highlight',
    '@lezer/html',
    '@lezer/java',
    '@lezer/javascript',
    '@lezer/json',
    '@lezer/lezer',
    '@lezer/lr',
    '@lezer/markdown',
    '@lezer/php',
    '@lezer/python',
    '@lezer/rust',
    '@lezer/xml',
    'codemirror',
    'crelt',
    'style-mod',
    'w3c-keyname'
]

function rewriteImports(code) {
    for (let packageName of codemirrorLezerPackages) {
        let importRegexp = new RegExp(`import( |	){0,}"${packageName}"`, "g");
        code = code.replace(importRegexp, `import "https://codemirror.net/try/mods/${packageName.replace(/\//g, "-")}.js"`);
        let importRegexp2 = new RegExp(`import( |	){0,}'${packageName}'`, "g");
        code = code.replace(importRegexp2, `import 'https://codemirror.net/try/mods/${packageName.replace(/\//g, "-")}.js'`);
        let fromRegexp = new RegExp(`from( |	){0,}"${packageName}"`, "g");
        code = code.replace(fromRegexp, `from "https://codemirror.net/try/mods/${packageName.replace(/\//g, "-")}.js"`);
        let fromRegexp2 = new RegExp(`from( |	){0,}'${packageName}'`, "g");
        code = code.replace(fromRegexp2, `from 'https://codemirror.net/try/mods/${packageName.replace(/\//g, "-")}.js'`);
    }
    return code;
}

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
        frame.setAttribute("sandbox", "allow-scripts allow-popups allow-modals allow-forms");
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
            frame.contentWindow.postMessage({type: "load", code: rewriteImports(code)}, "*", [channel.port1]);
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
    setTimeout(() => {
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
    document.getElementById("share-link").value = document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=8";
}

function prepareSaveModal() {
    if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1]))) {
        document.getElementById("save-name").value = decodeURIComponent(urlMyProgramQuery[1]);
    }
}

document.getElementById("run").addEventListener("click", () => {
    run(true);
});

document.getElementById("share").addEventListener("click", () => {
    document.getElementById("modal-share").showModal();
    prepareShareModal();
});

document.getElementById("save").addEventListener("click", () => {
    document.getElementById("modal-save").showModal();
    prepareSaveModal();
});

document.getElementById("share-link-copy").addEventListener("click", e => {
    navigator.clipboard.writeText(document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=8");
    displayNotification(e.target, document.getElementById("modal-share"), "Link successfully copied!", 2000);
});

let link, blob;

document.getElementById("share-export-typescript").addEventListener("click", () => {
    link = document.createElement("a");
    link.download = "index.ts";
    blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("share-export-javascript").addEventListener("click", () => {
    link = document.createElement("a");
    link.download = "index.js";
    blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("share-export-plain-text").addEventListener("click", () => {
    link = document.createElement("a");
    link.download = "prog.txt";
    blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("modal-share-close").addEventListener("click", () => {
    document.getElementById("modal-share").close();
});

document.getElementById("save-to-programs").addEventListener("click", e => {
    myPrograms[document.getElementById("save-name").value] = {};
    myPrograms[document.getElementById("save-name").value]["language"] = "javascript";
    myPrograms[document.getElementById("save-name").value]["program"] = editor.state.doc.toString();
    displayNotification(e.target, document.getElementById("modal-save"), "Program successfully saved!", 2000);
    localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
});

document.getElementById("modal-save-close").addEventListener("click", () => {
    document.getElementById("modal-save").close();
});

document.getElementById("invalid-dv-load-anyway").addEventListener("click", () => {
    loadCode(decodeParameter(urlCodeQuery[1]));
    run(false);
    document.getElementById("modal-invalid-dv").close();
});

document.getElementById("invalid-dv-load-default").addEventListener("click", () => {
    document.getElementById("modal-invalid-dv").close();
});

document.getElementById("clear").addEventListener("click", () => {
    frame = document.createElement("iframe");
    document.getElementById("output").textContent = document.getElementById("log").textContent = "";
    document.getElementById("output").appendChild(frame);
    document.getElementById("tab-log").classList.remove("new-logs");
});

run(false);

addEventListener("load", () => {
    if (innerWidth < 1200) {
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
        document.getElementById("tab-output").classList.add("active");
        lastWideScreenTab = "output";
    } else {
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
        document.getElementById("tab-output").classList.add("active");
        lastNarrowScreenTab = "editor";
    }
});

addEventListener("resize", () => {
    if (innerWidth < 1200) {
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

document.getElementById("tab-editor").addEventListener("click", () => {
    lastNarrowScreenTab = "editor";
    document.getElementById("tab-editor").classList.add("active");
    document.getElementById("tab-output").classList.remove("active");
    document.getElementById("tab-log").classList.remove("active");
    document.getElementById("editor").style.display = "block";
    document.getElementById("output").style.display = "none";
    document.getElementById("log").style.display = "none";
});

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
