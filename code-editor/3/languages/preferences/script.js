/**
Set the editor's default JavaScript completion scope to "globalThis", for new users.
*/
if (!localStorage.getItem("code-editor-editor-jsCompletionScope")) {
    localStorage.setItem("code-editor-editor-jsCompletionScope", "globalThis");
}

/**
Set the editor's default JavaScript completion source to "scope", for new users.
*/
if (!localStorage.getItem("code-editor-editor-jsCompletionSource")) {
    localStorage.setItem("code-editor-editor-jsCompletionSource", "scope");
}

/**
Set the default number of spaces a block (whatever that means depending on the language) should be indented in the editor to 4, for new users.
*/
if (!localStorage.getItem("code-editor-editor-indentUnit")) {
    localStorage.setItem("code-editor-editor-indentUnit", "    ");
}

/**
Set the editor's default tab size to 4, for new users.
*/
if (!localStorage.getItem("code-editor-editor-tabSize")) {
    localStorage.setItem("code-editor-editor-tabSize", 4);
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
Show all the preferences in their respective input elements.
*/
document.getElementById("editor-jsCompletionScope").value = localStorage.getItem("code-editor-editor-jsCompletionScope");
document.getElementById("editor-jsCompletionSource").value = localStorage.getItem("code-editor-editor-jsCompletionSource");
document.getElementById("editor-indentUnit").value = localStorage.getItem("code-editor-editor-indentUnit");
document.getElementById("editor-tabSize").value = localStorage.getItem("code-editor-editor-tabSize");
document.getElementById("editor-indentWithTab").value = localStorage.getItem("code-editor-editor-indentWithTab");
document.getElementById("editor-vscodeKeymap").value = localStorage.getItem("code-editor-editor-vscodeKeymap");
document.getElementById("editor-abbreviationTracker").value = localStorage.getItem("code-editor-editor-abbreviationTracker");
document.getElementById("editor-colorPicker").value = localStorage.getItem("code-editor-editor-colorPicker");
document.getElementById("editor-filePlaceholders").value = localStorage.getItem("code-editor-editor-filePlaceholders");
document.getElementById("editor-indentationMarkers").value = localStorage.getItem("code-editor-editor-indentationMarkers");
document.getElementById("editor-interact").value = localStorage.getItem("code-editor-editor-interact");
document.getElementById("editor-rectangularSelection").value = localStorage.getItem("code-editor-editor-rectangularSelection");

/**
Helper function that displays a notification, and removes it after a specified time.
*/
function displayNotification(relativeElement, messageText, notificationTime) {
    let notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    let notificationCoords = relativeElement.getBoundingClientRect();
    notificationElement.style.left = `${notificationCoords.left}px`;
    notificationElement.style.top = `${notificationCoords.bottom + 3}px`;
    document.body.appendChild(notificationElement);
    setTimeout(() => {
        notificationElement.remove();
    }, notificationTime);
}

/**
Save changes to preferences when 'Apply' button is clicked.
*/
document.getElementById("apply").addEventListener("click", e => {
    if (document.getElementById("editor-vscodeKeymap").value.trim() === "false" || ((document.getElementById("editor-vscodeKeymap").value.trim() === "true" && confirm("WARNING: You are enabling or have enabled vscodeKeymap, which is deprecated. It may cease to work at any time. Do you wish to proceed anyway?")))) {
        displayNotification(e.target, "Changes saved!", 2000);
        localStorage.setItem("code-editor-editor-vscodeKeymap", (document.getElementById("editor-vscodeKeymap").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-jsCompletionScope", document.getElementById("editor-jsCompletionScope").value.toString());
        localStorage.setItem("code-editor-editor-jsCompletionSource", (document.getElementById("editor-jsCompletionSource").value.trim() === "keywords") ? "keywords" : "scope");
        localStorage.setItem("code-editor-editor-indentUnit", document.getElementById("editor-indentUnit").value.toString());
        localStorage.setItem("code-editor-editor-tabSize", (document.getElementById("editor-tabSize").value > 8) ? 8 : (document.getElementById("editor-tabSize").value < 1) ? 1 : parseInt(document.getElementById("editor-tabSize").value));
        localStorage.setItem("code-editor-editor-indentWithTab", (document.getElementById("editor-indentWithTab").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-vscodeKeymap", (document.getElementById("editor-vscodeKeymap").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-abbreviationTracker", (document.getElementById("editor-abbreviationTracker").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-colorPicker", (document.getElementById("editor-colorPicker").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-filePlaceholders", (document.getElementById("editor-filePlaceholders").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-indentationMarkers", (document.getElementById("editor-indentationMarkers").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-interact", (document.getElementById("editor-interact").value.trim() === "true") ? true : false);
        localStorage.setItem("code-editor-editor-rectangularSelection", (document.getElementById("editor-rectangularSelection").value.trim() === "true") ? true : false);
    }
});

/**
Automatically resize the indent unit input's width after typing.
*/
document.getElementById("editor-indentUnit").style.width = `${0.35 + (0.6125 * document.getElementById("editor-indentUnit").value.length)}em`;
if (document.getElementById("editor-indentUnit").value === "\t") {
    document.getElementById("editor-indentUnit").style.width = "4.85em";
} else if (document.getElementById("editor-indentUnit").value === "") {
    document.getElementById("editor-indentUnit").style.width = "0.35em";
}
document.getElementById("editor-indentUnit").addEventListener("input", () => {
    document.getElementById("editor-indentUnit").style.width = `${0.35 + (0.6125 * document.getElementById("editor-indentUnit").value.length)}em`;
    if (document.getElementById("editor-indentUnit").value === "\t") {
        document.getElementById("editor-indentUnit").style.width = "4.85em";
    } else if (document.getElementById("editor-indentUnit").value === "") {
        document.getElementById("editor-indentUnit").style.width = "0.35em";
    }
});

/**
Automatically resize the JavaScript completion source input's width after typing.
*/
document.getElementById("editor-jsCompletionSource").style.width = `${0.35 + (0.6125 * document.getElementById("editor-jsCompletionSource").value.length)}em`;
if (document.getElementById("editor-jsCompletionSource").value === "") {
    document.getElementById("editor-jsCompletionSource").style.width = "0.35em";
}
document.getElementById("editor-jsCompletionSource").addEventListener("input", () => {
    document.getElementById("editor-jsCompletionSource").style.width = `${0.35 + (0.6125 * document.getElementById("editor-jsCompletionSource").value.length)}em`;
    if (document.getElementById("editor-jsCompletionSource").value === "") {
        document.getElementById("editor-jsCompletionSource").style.width = "0.35em";
    }
});

/**
Automatically resize the JavaScript completion scope input's width after typing.
*/
document.getElementById("editor-jsCompletionScope").style.width = `${0.35 + (0.6125 * document.getElementById("editor-jsCompletionScope").value.length)}em`;
if (document.getElementById("editor-jsCompletionScope").value === "") {
    document.getElementById("editor-jsCompletionScope").style.width = "0.35em";
}
document.getElementById("editor-jsCompletionScope").addEventListener("input", () => {
    document.getElementById("editor-jsCompletionScope").style.width = `${0.35 + (0.6125 * document.getElementById("editor-jsCompletionScope").value.length)}em`;
    if (document.getElementById("editor-jsCompletionScope").value === "") {
        document.getElementById("editor-jsCompletionScope").style.width = "0.35em";
    }
});

/**
Go back to the languages page after clicking the 'Done' button.
*/
document.getElementById("done").addEventListener("click", () => {
    location.assign("..");
});
