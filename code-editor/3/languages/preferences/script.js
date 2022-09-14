if (!localStorage.getItem("editor-tabSize")) {
    localStorage.setItem("editor-tabSize", 4);
}

if (!localStorage.getItem("editor-indentUnit")) {
    localStorage.setItem("editor-indentUnit", "    ");
}

if (!localStorage.getItem("editor-vscodeKeymap")) {
    localStorage.setItem("editor-vscodeKeymap", false);
}

if (!localStorage.getItem("editor-colorPicker")) {
    localStorage.setItem("editor-colorPicker", true);
}

if (!localStorage.getItem("editor-indentationMarkers")) {
    localStorage.setItem("editor-indentationMarkers", true);
}

if (!localStorage.getItem("editor-interact")) {
    localStorage.setItem("editor-interact", false);
}

if (!localStorage.getItem("site-theme")) {
    localStorage.setItem("site-theme", "light");
}

document.body.setAttribute("theme", localStorage.getItem("site-theme"));

document.getElementById("editor-tabSize").value = localStorage.getItem("editor-tabSize");
document.getElementById("editor-indentUnit").value = localStorage.getItem("editor-indentUnit");
document.getElementById("editor-vscodeKeymap").value = localStorage.getItem("editor-vscodeKeymap");
document.getElementById("editor-colorPicker").value = localStorage.getItem("editor-colorPicker");
document.getElementById("editor-indentationMarkers").value = localStorage.getItem("editor-indentationMarkers");
document.getElementById("editor-interact").value = localStorage.getItem("editor-interact");

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
    localStorage.setItem("editor-tabSize", (document.getElementById("editor-tabSize").value > 8) ? 8 : (document.getElementById("editor-tabSize").value < 1) ? 1 : parseInt(document.getElementById("editor-tabSize").value));
    localStorage.setItem("editor-indentUnit", document.getElementById("editor-indentUnit").value.toString());
    localStorage.setItem("editor-vscodeKeymap", (document.getElementById("editor-vscodeKeymap").value.trim() == "true") ? true : false);
    localStorage.setItem("editor-colorPicker", (document.getElementById("editor-colorPicker").value.trim() == "true") ? true : false);
    localStorage.setItem("editor-indentationMarkers", (document.getElementById("editor-indentationMarkers").value.trim() == "true") ? true : false);
    localStorage.setItem("editor-interact", (document.getElementById("editor-interact").value.trim() == "true") ? true : false);
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