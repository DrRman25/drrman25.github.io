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
import {javascript} from "https://codemirror.net/try/mods/@codemirror-lang-javascript.js";
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

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));

var frame, code, channel;
var editor;
var lastWideScreenTab, lastNarrowScreenTab;
var canRunCode = true;
var urlCodeQuery = /[?&]c=([^&]+)/.exec(document.location.search);
var urlDataVersionQuery = /[?&]dv=([^&]+)/.exec(document.location.search);
var urlExampleQuery = /[?&]example=([^&]+)/.exec(document.location.search);

var universalTheme = HighlightStyle.define([
    {tag: tags.link, textDecoration: "underline"},
    {tag: tags.heading, textDecoration: "underline", fontWeight: "bold"},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"},
]);

var lightTheme = HighlightStyle.define([
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

var darkTheme = HighlightStyle.define([
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

var spookyTheme = HighlightStyle.define([
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
    var state = EditorState.create({
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
            javascript(),
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
                        var newVal = Number(text) + e.movementX;
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
                        var res = /vec2\((?<x>-?\b\d+\.?\d*\b)\s*(,\s*(?<y>-?\b\d+\.?\d*\b))?\)/.exec(text);
                        var x = Number(res?.groups?.x);
                        var y = Number(res?.groups?.y);
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
    return `console.log('Hello, world!');
`;
}

function getExamples() {
    return {
        "Basic console output": `console.log('Hello, this is an informational message!');
console.warn('Hello, this is a warning message!');
console.error('Hello, this is an error message!');`
    };
}

var examples = getExamples();

for (var exampleName of Object.keys(examples)) {
    document.getElementById("examples").appendChild(document.createElement("option")).textContent = exampleName;
}

function encodeParameter(code) {
    return btoa(code.replace(/[\xff-\uffff]/g, ch => `\xff${String.fromCharCode(ch.charCodeAt(0) & 0xff, ch.charCodeAt(0) >> 8)}`));
}

function decodeParameter(param) {
    return atob(param).replace(/\xff[^][^]/g, m => String.fromCharCode(m.charCodeAt(1) + (m.charCodeAt(2) << 8)));
}

document.getElementById("examples").addEventListener("change", function() {
    var exampleValue = document.getElementById("examples").value;
    if (examples.hasOwnProperty(exampleValue)) {
        window.history.pushState({}, "", document.location.toString().replace(/[#?].*/, "") + "?example=" + encodeURIComponent(exampleValue));
        loadCode(examples[exampleValue]);
        run(false);
    }
    document.getElementById("examples").selectedIndex = 0;
})

loadCode(
    (urlCodeQuery && urlDataVersionQuery && parseInt(urlDataVersionQuery[1]) == 4) ? decodeParameter(urlCodeQuery[1])
    : (urlExampleQuery && examples.hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) ? examples[decodeURIComponent(urlExampleQuery[1])]
    : getDefaultCode()
);

if (urlCodeQuery && (!urlDataVersionQuery || parseInt(urlDataVersionQuery[1]) != 4)) {
    document.getElementById("modal-invalid-dv").showModal();
    document.getElementById("data-version").textContent = (
        !urlDataVersionQuery ? "3.0.0.8 or earlier"
        : (parseInt(urlDataVersionQuery[1]) == 1) ? "3.0.0.9"
        : (parseInt(urlDataVersionQuery[1]) == 2) ? "3.0.0.10"
        : (parseInt(urlDataVersionQuery[1]) == 3) ? "3.0.0.11"
        : (parseInt(urlDataVersionQuery[1]) > 4) ? "(future version - 3.0.0.13+)"
        : "unknown"
    );
}

function parseStack(stack) {
    return stack.split("\n").map(line => /^\s*([\w$*.]*)/.exec(line)[1] || "<anonymous>");
}

function expandError(target, val) {
    var frames = document.createElement("div");
    frames.className = "log-frames";
    for (var fn of parseStack(val.stack)) {
        frames.appendChild(document.createElement("div")).textContent = fn;
    }
    target.parentNode.replaceChild(frames, target);
}

function span(cls, ...content) {
    let elt = document.createElement("span");
    elt.className = cls;
    for (let c of content) elt.appendChild(typeof c == "string" ? document.createTextNode(c) : c);
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
    if (typeof value == "number") {
        return span("tok-number", String(value));
    }
    if (typeof value == "string") {
        return top ? document.createTextNode(value) : span("tok-string", JSON.stringify(value));
    }
    if (typeof value == "boolean") {
        return span("tok-atom", String(value));
    }
    if (value == null) {
        return span("tok-keyword", String(value))
    }
    var {function: fun, array, object, ctor, error} = value;
    if (error) {
        return span("tok-invalid", error, " ", etcButton(e => expandError(e.target , value)))
    } else if (fun) {
        return span("", span("tok-keyword", "function "), span("tok-variableName2", fun))
    } else if (array) {
        space -= 2;
        var children = ["["];
        var wrap;
        for (var elt of array) {
            if (children.length > 1) {
                children.push(", ");
                space -= 2;
            }
            var next = space > 0 && renderLoggable(elt, space);
            var nextSize = next ? next.textContent.length : 0;
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
        var children = [];
        var wrap;
        if (ctor && ctor != "Object") {
            children.push(span("tok-typeName", ctor + " "));
            space -= ctor.length + 1;
        }
        children.push("{");
        for (var prop of Object.keys(object)) {
            if (children[children.length - 1] !== "{") {
                space -= 2;
                children.push(", ");
            }
            var next = null;
            if (space > 0) {
                try { next = renderLoggable(object[prop], space); }
                catch (_) {}
            }
            var nextSize = next ? prop.length + 2 + next.textContent.length : 0;
            if (!next || space - nextSize <= 0) {
                children.push(etcButton(() => expandObj(wrap, object)));
                break
            }
            space -= nextSize;
            children.push(span("tok-property", prop + ": "), next);
        }
        children.push("}");
        return wrap = span("log-object", ...children)
    }
}

function showLog(values, type) {
    var wrap = document.createElement("div"), first = true;
    wrap.className = "log-" + type;
    for (var val of values) {
        if (first) {
            first = false;
        } else {
            wrap.appendChild(document.createTextNode(" "));
        }
        wrap.appendChild(renderLoggable(val, 60, true));
    }
    document.getElementById("log").appendChild(wrap);
}

function run(coolDown = true) {
    if (canRunCode) {
        if (innerWidth < 1200) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
        }
        document.getElementById("output").textContent = document.getElementById("log").textContent = "";
        frame = document.createElement("iframe");
        frame.setAttribute("sandbox", "allow-scripts allow-popups allow-modals allow-forms");
        frame.src = "resources/sandbox.html";
        code = editor.state.doc.toString();
        channel = new MessageChannel();
        channel.port2.onmessage = function(e) {
            if (e.data.log) {
                showLog(e.data.elements, e.data.log);
            }
        }
        frame.onload = function() {
            frame.contentWindow.postMessage({type: "load", code: code}, "*", [channel.port1]);
        }
        document.getElementById("output").appendChild(frame);
        if (coolDown) {
            canRunCode = false;
            document.getElementById("run").textContent = ". . .";
            setTimeout(function() {
                canRunCode = true;
                document.getElementById("run").textContent = "Run";
            }, 250);
        }
    }
    return true;
}

function displayNotification(relativeElement, parentElement, messageText, notificationTime) {
    var notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    var notificationCoords = relativeElement.getBoundingClientRect();
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
    document.getElementById("share-link").value = document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=4";
}

document.getElementById("run").addEventListener("click", function() {
    run(true);
});

document.getElementById("share").addEventListener("click", function() {
    document.getElementById("modal-share").showModal();
    prepareShareModal();
});

document.getElementById("share-link-copy").addEventListener("click", function(e) {
    navigator.clipboard.writeText(document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()) + "&dv=4");
    displayNotification(e.target, document.getElementById("modal-share"), "Link successfully copied!", 2000);
});

var link, blob;

document.getElementById("share-export-typescript").addEventListener("click", function() {
    link = document.createElement("a");
    link.download = "index.ts";
    blob = new Blob([editor.state.doc.toString()], {type: "text/plain"});
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("share-export-javascript").addEventListener("click", function() {
    link = document.createElement("a");
    link.download = "index.js";
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
    document.getElementById("output").textContent = document.getElementById("log").textContent = "";
    document.getElementById("output").appendChild(frame);
});

run(false);

addEventListener("load", function() {
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

addEventListener("resize", function() {
    if (innerWidth < 1200) {
        lastWideScreenTab = (
            document.getElementById("tab-output").classList.contains("active") ? "output"
            : document.getElementById("tab-log").classList.contains("active") ? "log"
            : "output"
        );
        if (lastNarrowScreenTab == "editor") {
            document.getElementById("tab-editor").classList.add("active");
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.remove("active");
            document.getElementById("editor").style.display = "block";
            document.getElementById("output").style.display = "none";
            document.getElementById("log").style.display = "none";
        } else if (lastNarrowScreenTab == "output") {
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.add("active");
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("log").style.display = "none";
        } else if (lastNarrowScreenTab == "log") {
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.add("active");
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "none";
            document.getElementById("editor").style.display = "block";
        }
    } else {
        lastNarrowScreenTab = (
            document.getElementById("tab-editor").classList.contains("active") ? "editor"
            : document.getElementById("tab-output").classList.contains("active") ? "output"
            : document.getElementById("tab-log").classList.contains("active") ? "log"
            : "editor"
        );
        document.getElementById("editor").style.display = "block";
        if (lastWideScreenTab == "output") {
            document.getElementById("tab-output").classList.add("active");
            document.getElementById("tab-log").classList.remove("active");
            document.getElementById("output").style.display = "block";
            document.getElementById("log").style.display = "none";
        } else if (lastWideScreenTab == "log") {
            document.getElementById("tab-output").classList.remove("active");
            document.getElementById("tab-log").classList.add("active");
            document.getElementById("output").style.display = "none";
            document.getElementById("log").style.display = "block";
        }
    }
});

document.getElementById("tab-editor").addEventListener("click", function() {
    document.getElementById("tab-editor").classList.add("active");
    document.getElementById("tab-output").classList.remove("active");
    document.getElementById("tab-log").classList.remove("active");
    document.getElementById("editor").style.display = "block";
    document.getElementById("output").style.display = "none";
    document.getElementById("log").style.display = "none";
});

document.getElementById("tab-output").addEventListener("click", function() {
    if (innerWidth < 1200) {
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.add("active");
        document.getElementById("tab-log").classList.remove("active");
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
    } else {
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.add("active");
        document.getElementById("tab-log").classList.remove("active");
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "block";
        document.getElementById("log").style.display = "none";
    }
});

document.getElementById("tab-log").addEventListener("click", function() {
    if (innerWidth < 1200) {
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.remove("active");
        document.getElementById("tab-log").classList.add("active");
        document.getElementById("editor").style.display = "none";
        document.getElementById("output").style.display = "none";
        document.getElementById("log").style.display = "block";
    } else {
        document.getElementById("tab-editor").classList.remove("active");
        document.getElementById("tab-output").classList.remove("active");
        document.getElementById("tab-log").classList.add("active");
        document.getElementById("editor").style.display = "block";
        document.getElementById("output").style.display = "none";
        document.getElementById("log").style.display = "block";
    }
});
