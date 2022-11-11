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
Show the site settings in their respective input elements.
*/
document.getElementById("site-theme").value = localStorage.getItem("code-editor-site-theme");
document.getElementById("site-seasonalExtras").value = localStorage.getItem("code-editor-site-seasonalExtras");

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
Save changes to site settings when 'Apply' button is clicked.
*/
document.getElementById("apply").addEventListener("click", e => {
    displayNotification(e.target, "Changes saved!", 2000);
    localStorage.setItem("code-editor-site-theme", (document.getElementById("site-theme").value.trim().toLowerCase() === "spooky") ? "spooky" : (document.getElementById("site-theme").value.trim().toLowerCase() === "dark") ? "dark" : "light");
    localStorage.setItem("code-editor-site-seasonalExtras", (document.getElementById("site-seasonalExtras").value.trim() === "true") ? true : false);
});

/**
Automatically resize the site theme input's width after typing.
*/
document.getElementById("site-theme").style.width = `${0.35 + (0.5625 * document.getElementById("site-theme").value.length)}em`;
if (document.getElementById("site-theme").value === "\t") {
    document.getElementById("site-theme").style.width = "4.85em";
} else if (document.getElementById("site-theme").value === "") {
    document.getElementById("site-theme").style.width = "0.35em";
}
document.getElementById("site-theme").addEventListener("keyup", () => {
    document.getElementById("site-theme").style.width = `${0.35 + (0.5625 * document.getElementById("site-theme").value.length)}em`;
    if (document.getElementById("site-theme").value === "\t") {
        document.getElementById("site-theme").style.width = "4.85em";
    } else if (document.getElementById("site-theme").value === "") {
        document.getElementById("site-theme").style.width = "0.35em";
    }
});

/**
Go back to the languages page after clicking the 'Done' button.
*/
document.getElementById("done").addEventListener("click", () => {
    location.assign("..");
});
