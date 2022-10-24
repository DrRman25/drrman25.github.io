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
Helper function that displays a notification, and removes it after a specified time.
*/
function displayNotification(relativeElement, messageText, notificationTime) {
    var notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.textContent = messageText;
    var notificationCoords = relativeElement.getBoundingClientRect();
    notificationElement.style.left = `${notificationCoords.left}px`;
    notificationElement.style.top = `${notificationCoords.bottom + 3}px`;
    document.body.appendChild(notificationElement);
    setTimeout(() => {
        notificationElement.remove();
    }, notificationTime);
}

/**
Show screen width when 'Check screen width' button is clicked.
*/
document.getElementById("screen-width").addEventListener("click", e => {
    displayNotification(e.target, `Width: ${innerWidth}px`, 2000);
});

/**
Show a working demo of the HTML code found in the page.
*/
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
