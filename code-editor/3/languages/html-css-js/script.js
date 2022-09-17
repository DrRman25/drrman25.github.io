import { EditorState, StateEffect } from "https://codemirror.net/try/mods/@codemirror-state.js";
import { search, highlightSelectionMatches, searchKeymap } from "https://codemirror.net/try/mods/@codemirror-search.js";
import { EditorView, keymap, placeholder, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, highlightActiveLine } from "https://codemirror.net/try/mods/@codemirror-view.js";
import { defaultKeymap, history, historyKeymap } from "https://codemirror.net/try/mods/@codemirror-commands.js";
import { tags } from "https://codemirror.net/try/mods/@lezer-highlight.js";
import { indentUnit, syntaxHighlighting, HighlightStyle, foldGutter, indentOnInput, defaultHighlightStyle, bracketMatching, foldKeymap, syntaxTree } from "https://codemirror.net/try/mods/@codemirror-language.js";
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "https://codemirror.net/try/mods/@codemirror-autocomplete.js";
import { lintKeymap } from "https://codemirror.net/try/mods/@codemirror-lint.js";
import { vscodeKeymap } from '../node-modules/@replit/codemirror-vscode-keymap/dist/index.js';
import interact from '../node-modules/@replit/codemirror-interact/dist/index.js';
import { indentationMarkers } from '../node-modules/@replit/codemirror-indentation-markers/dist/index.js';
import { html } from "https://codemirror.net/try/mods/@codemirror-lang-html.js";
import { javascriptLanguage } from "https://codemirror.net/try/mods/@codemirror-lang-javascript.js";
import { colorPicker } from '../node-modules/@replit/codemirror-css-color-picker/dist/index.js';

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

var frame, frameDoc, frameWin;
var editor;
var canRunCode = true;
var urlCodeQuery = /[?&]c=([^&]+)/.exec(document.location.search);
var urlExampleQuery = /[?&]example=([^&]+)/.exec(document.location.search);

var theme = HighlightStyle.define([
    { tag: tags.link, class: "tok-link" },
    { tag: tags.heading, class: "tok-heading" },
    { tag: tags.emphasis, class: "tok-emphasis" },
    { tag: tags.strong, class: "tok-strong" },
    { tag: tags.keyword, class: "tok-keyword" },
    { tag: tags.atom, class: "tok-atom" },
    { tag: tags.bool, class: "tok-bool" },
    { tag: tags.url, class: "tok-url" },
    { tag: tags.labelName, class: "tok-labelName" },
    { tag: tags.inserted, class: "tok-inserted" },
    { tag: tags.deleted, class: "tok-deleted" },
    { tag: tags.literal, class: "tok-literal" },
    { tag: [tags.string, tags.special(tags.string)], class: "tok-string" },
    { tag: tags.number, class: "tok-number" },
    { tag: [tags.regexp, tags.escape], class: "tok-string2" },
    { tag: tags.variableName, class: "tok-variableName" },
    { tag: tags.local(tags.variableName), class: "tok-variableName tok-local" },
    { tag: tags.definition(tags.variableName), class: "tok-variableName tok-definition" },
    { tag: tags.special(tags.variableName), class: "tok-variableName2" },
    { tag: tags.definition(tags.propertyName), class: "tok-propertyName tok-definition" },
    { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], class: "tok-function" },
    { tag: tags.typeName, class: "tok-typeName" },
    { tag: tags.namespace, class: "tok-namespace" },
    { tag: tags.className, class: "tok-className" },
    { tag: tags.macroName, class: "tok-macroName" },
    { tag: tags.propertyName, class: "tok-propertyName" },
    { tag: tags.operator, class: "tok-operator" },
    { tag: tags.comment, class: "tok-comment" },
    { tag: tags.meta, class: "tok-meta" },
    { tag: tags.invalid, class: "tok-invalid" },
    { tag: tags.angleBracket, class: "tok-angleBracket" }
]);

function injectExtension(extension) {
    editor.dispatch({
        effects: StateEffect.appendConfig.of(extension)
    });
}

function optionalChain(ops) {
    var lastAccessLHS = undefined;
    var value = ops[0];
    var i = 1;
    while (i < ops.length) {
        var op = ops[i];
        var fn = ops[i + 1];
        i += 2;
        if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
            return undefined;
        }
        if (op === 'access' || op === 'optionalAccess') { 
            lastAccessLHS = value;
            value = fn(value);
        } else if (op === 'call' || op === 'optionalCall') {
            value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined;
        }
    }
    return value;
}

function completeFromGlobalScope(context) {
    var nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
    if (["PropertyName", ".", "?."].includes(nodeBefore.name) && optionalChain([nodeBefore, 'access', _ => _.parent, 'optionalAccess', _2 => _2.name]) == "MemberExpression") {
        var object = nodeBefore.parent.getChild("Expression");
        if (optionalChain([object, 'optionalAccess', _3 => _3.name]) == "VariableName") {
            var from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from;
            var variableName = context.state.sliceDoc(object.from, object.to);
            if (typeof window[variableName] == "object")
                return completeProperties(from, window[variableName]);
        }
    } else if (nodeBefore.name == "VariableName") {
        return completeProperties(nodeBefore.from, window);
    } else if (context.explicit && !["TemplateString", "LineComment", "BlockComment", "VariableDefinition", "PropertyDefinition"].includes(nodeBefore.name)) {
        return completeProperties(context.pos, window);
    }
    return null;
}

function completeProperties(from, object) {
    var options = [];
    for (var name in object) {
        options.push({
            label: name,
            type: typeof object[name] == "function" ? "function" : "variable"
        });
    }
    return {
        from,
        options,
        validFor: /^[\w$]*$/
    };
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
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, {
                fallback: true
            }),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            keymap.of([
                { key: "Mod-Enter", run: run },
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap
            ]),
            EditorView.lineWrapping,
            placeholder("Not sure where to start? Some templates will be coming soon!"),
            html(),
            javascriptLanguage.data.of({
                autocomplete: completeFromGlobalScope
            }),
            autocompletion(),
            search({
                top: true
            }),
            EditorState.tabSize.of(localStorage.getItem("code-editor-editor-tabSize")),
            indentUnit.of(localStorage.getItem("code-editor-editor-indentUnit")),
            syntaxHighlighting(theme)
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
}

function getDefaultCode() {
    return `<!DOCTYPE html>
<html>

<head>
${localStorage.getItem("code-editor-editor-indentUnit")}<title>Your Title Here</title>
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
        var dateButton = document.getElementById("date-button");
        var dateParagraph = document.getElementById("date-time");

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

loadCode(urlCodeQuery ? decodeParameter(urlCodeQuery[1]) : (urlExampleQuery && examples.hasOwnProperty(decodeURIComponent(urlExampleQuery[1]))) ? examples[decodeURIComponent(urlExampleQuery[1])] : getDefaultCode());

function run(coolDown = true) {
    if (canRunCode) {
        if (innerWidth < 1200) {
            document.getElementById("editor").style.display = "none";
            document.getElementById("output").style.display = "block";
            document.getElementById("tab-editor").classList.remove("active");
            document.getElementById("tab-output").classList.add("active");
        }
        frame = document.createElement("iframe");
        document.getElementById("output").innerHTML = "";
        document.getElementById("output").appendChild(frame);
        frameWin = frame.contentWindow;
        frameDoc = frame.contentDocument || frame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(editor.state.doc.toString());
        frameDoc.close();
        if (coolDown) {
            canRunCode = false;
            document.getElementById("run").innerHTML = ". . .";
            setTimeout(function() {
                canRunCode = true;
                document.getElementById("run").innerHTML = "Run";
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
    document.getElementById("share-link").value = document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString());
}

document.getElementById("run").addEventListener("click", function() {
    run(true);
});

document.getElementById("share").addEventListener("click", function() {
    document.getElementById("modal-share").showModal();
    prepareShareModal();
});

document.getElementById("share-link-copy").addEventListener("click", function(e) {
    navigator.clipboard.writeText(document.location.toString().replace(/[#?].*/, "") + "?c=" + encodeParameter(editor.state.doc.toString()));
    displayNotification(e.target, document.getElementById("modal-share"), "Link successfully copied!", 2000);
});

var link, blob;

document.getElementById("share-export-html").addEventListener("click", function() {
    link = document.createElement("a");
    link.download = "index.html";
    blob = new Blob([editor.state.doc.toString()], { type: "text/plain" });
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("share-export-plain-text").addEventListener("click", function() {
    link = document.createElement("a");
    link.download = "prog.txt";
    blob = new Blob([editor.state.doc.toString()], { type: "text/plain" });
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById("modal-share-close").addEventListener("click", function() {
    document.getElementById("modal-share").close();
});

document.getElementById("clear").addEventListener("click", function() {
    frame = document.createElement("iframe");
    document.getElementById("output").innerHTML = "";
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
