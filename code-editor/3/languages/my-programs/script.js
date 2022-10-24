/**
Create a fresh, empty My Programs object for new users.
*/
if (!localStorage.getItem("code-editor-my-programs")) {
    localStorage.setItem("code-editor-my-programs", "{}");
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
Parse the My Programs object into an iterable value.
*/
const myPrograms = JSON.parse(localStorage.getItem("code-editor-my-programs"));

/**
Iterate over each of the user's programs.
*/
for (const program in myPrograms) {
    let programLink = document.createElement("a");
    programLink.href = `../${myPrograms[program]["language"]}/?prog=${encodeURIComponent(program)}`;
    programLink.classList.add("blocklink");
    let programLabel = document.createElement("strong");
    programLabel.textContent = program;
    let programListItem = document.createElement("li");
    document.getElementById("my-programs-list").appendChild(programListItem);
    programListItem.appendChild(programLink);
    programLink.appendChild(programLabel);
}

/**
Show a message if the user has no programs.
*/
if (Object.keys(myPrograms).length === 0) {
    document.getElementById("my-programs-list").style.display = "none";
    document.getElementById("no-programs").style.display = "block";
}

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
Remove a specified item from My Programs after clicking on the 'Remove from programs' button.
*/
document.getElementById("remove-from-programs").addEventListener("click", e => {
    delete myPrograms[document.getElementById("remove-name").value];
    localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
    displayNotification(e.target, "Program successfully deleted!", 2000);
});
