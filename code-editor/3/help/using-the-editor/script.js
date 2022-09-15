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

var frameDoc1 = document.getElementById("frame-1").contentDocument || document.getElementById("frame-1").contentWindow.document;

frameDoc1.open();
frameDoc1.write(`<!DOCTYPE html>
<html>

<head>
    <title>My HTML</title>
</head>

<body>
    <p>Hello, this is my code!</p>
</body>

</html>`);
frameDoc1.close();
