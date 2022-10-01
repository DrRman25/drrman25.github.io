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

document.getElementById("editor-tabSize").value = localStorage.getItem("code-editor-editor-tabSize");
document.getElementById("editor-indentUnit").value = localStorage.getItem("code-editor-editor-indentUnit");
document.getElementById("editor-vscodeKeymap").value = localStorage.getItem("code-editor-editor-vscodeKeymap");
document.getElementById("editor-colorPicker").value = localStorage.getItem("code-editor-editor-colorPicker");
document.getElementById("editor-indentationMarkers").value = localStorage.getItem("code-editor-editor-indentationMarkers");
document.getElementById("editor-interact").value = localStorage.getItem("code-editor-editor-interact");

function displayNotification(relativeElement, messageText, notificationTime) {
    var notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    var notificationCoords = relativeElement.getBoundingClientRect();
    notificationElement.style.left = notificationCoords.left + "px";
    notificationElement.style.top = (notificationCoords.bottom + 3) + "px";
    document.body.appendChild(notificationElement);
    setTimeout(function() {
        notificationElement.remove();
    }, notificationTime);
}

document.getElementById("apply").addEventListener("click", function(e) {
    displayNotification(e.target, "Changes saved!", 2000);
    localStorage.setItem("code-editor-editor-tabSize", (document.getElementById("editor-tabSize").value > 8) ? 8 : (document.getElementById("editor-tabSize").value < 1) ? 1 : parseInt(document.getElementById("editor-tabSize").value));
    localStorage.setItem("code-editor-editor-indentUnit", document.getElementById("editor-indentUnit").value.toString());
    localStorage.setItem("code-editor-editor-vscodeKeymap", (document.getElementById("editor-vscodeKeymap").value.trim() == "true") ? true : false);
    localStorage.setItem("code-editor-editor-colorPicker", (document.getElementById("editor-colorPicker").value.trim() == "true") ? true : false);
    localStorage.setItem("code-editor-editor-indentationMarkers", (document.getElementById("editor-indentationMarkers").value.trim() == "true") ? true : false);
    localStorage.setItem("code-editor-editor-interact", (document.getElementById("editor-interact").value.trim() == "true") ? true : false);
});

document.getElementById("editor-indentUnit").style.width = 0.35 + (0.5625 * document.getElementById("editor-indentUnit").value.length) + "em";
if (document.getElementById("editor-indentUnit").value == "\t") {
    document.getElementById("editor-indentUnit").style.width = 4.85 + "em";
} else if (document.getElementById("editor-indentUnit").value == "") {
    document.getElementById("editor-indentUnit").style.width = 0.35 + "em";
}

document.getElementById("editor-indentUnit").addEventListener("keyup", function() {
    document.getElementById("editor-indentUnit").style.width = 0.35 + (0.5625 * document.getElementById("editor-indentUnit").value.length) + "em";
    if (document.getElementById("editor-indentUnit").value == "\t") {
        document.getElementById("editor-indentUnit").style.width = 4.85 + "em";
    } else if (document.getElementById("editor-indentUnit").value == "") {
        document.getElementById("editor-indentUnit").style.width = 0.35 + "em";
    }
});

document.getElementById("done").addEventListener("click", function() {
    location.assign("..");
});