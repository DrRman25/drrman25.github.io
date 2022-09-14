if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));

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

document.getElementById("screen-width").addEventListener("click", function(e) {
    displayNotification(e.target, "Width: " + innerWidth + "px", 2000);
});