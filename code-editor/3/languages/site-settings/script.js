if (!localStorage.getItem("site-theme")) {
    localStorage.setItem("site-theme", "light");
}

document.body.setAttribute("theme", localStorage.getItem("site-theme"));

document.getElementById("site-theme").value = localStorage.getItem("site-theme");

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
    localStorage.setItem("site-theme", (document.getElementById("site-theme").value.trim().toLowerCase() == "spooky") ? "spooky" : (document.getElementById("site-theme").value.trim().toLowerCase() == "dark") ? "dark" : "light");
});

document.getElementById("site-theme").style.width = 0.35 + (0.5625 * document.getElementById("site-theme").value.length) + "em";
if (document.getElementById("site-theme").value == "\t") {
    document.getElementById("site-theme").style.width = 4.85 + "em";
} else if (document.getElementById("site-theme").value == "") {
    document.getElementById("site-theme").style.width = 0.35 + "em";
}

document.getElementById("site-theme").addEventListener("keyup", function() {
    document.getElementById("site-theme").style.width = 0.35 + (0.5625 * document.getElementById("site-theme").value.length) + "em";
    if (document.getElementById("site-theme").value == "\t") {
        document.getElementById("site-theme").style.width = 4.85 + "em";
    } else if (document.getElementById("site-theme").value == "") {
        document.getElementById("site-theme").style.width = 0.35 + "em";
    }
});

document.getElementById("done").addEventListener("click", function() {
    location.assign("..");
});