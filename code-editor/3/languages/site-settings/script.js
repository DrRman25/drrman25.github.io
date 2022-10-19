if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

document.getElementById("site-theme").value = localStorage.getItem("code-editor-site-theme");
document.getElementById("site-seasonalExtras").value = localStorage.getItem("code-editor-site-seasonalExtras");

function displayNotification(relativeElement, messageText, notificationTime) {
    let notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    let notificationCoords = relativeElement.getBoundingClientRect();
    notificationElement.style.left = notificationCoords.left + "px";
    notificationElement.style.top = (notificationCoords.bottom + 3) + "px";
    document.body.appendChild(notificationElement);
    setTimeout(() => {
        notificationElement.remove();
    }, notificationTime);
}

document.getElementById("apply").addEventListener("click", e => {
    displayNotification(e.target, "Changes saved!", 2000);
    localStorage.setItem("code-editor-site-theme", (document.getElementById("site-theme").value.trim().toLowerCase() == "spooky") ? "spooky" : (document.getElementById("site-theme").value.trim().toLowerCase() == "dark") ? "dark" : "light");
    localStorage.setItem("code-editor-site-seasonalExtras", (document.getElementById("site-seasonalExtras").value.trim() == "true") ? true : false);
});

document.getElementById("site-theme").style.width = 0.35 + (0.5625 * document.getElementById("site-theme").value.length) + "em";
if (document.getElementById("site-theme").value == "\t") {
    document.getElementById("site-theme").style.width = 4.85 + "em";
} else if (document.getElementById("site-theme").value == "") {
    document.getElementById("site-theme").style.width = 0.35 + "em";
}

document.getElementById("site-theme").addEventListener("keyup", () => {
    document.getElementById("site-theme").style.width = 0.35 + (0.5625 * document.getElementById("site-theme").value.length) + "em";
    if (document.getElementById("site-theme").value == "\t") {
        document.getElementById("site-theme").style.width = 4.85 + "em";
    } else if (document.getElementById("site-theme").value == "") {
        document.getElementById("site-theme").style.width = 0.35 + "em";
    }
});

document.getElementById("done").addEventListener("click", () => {
    location.assign("..");
});