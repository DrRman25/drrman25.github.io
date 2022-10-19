if (!localStorage.getItem("code-editor-my-programs")) {
    localStorage.setItem("code-editor-my-programs", "{}");
}

if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

const myPrograms = JSON.parse(localStorage.getItem("code-editor-my-programs"));

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

if (Object.keys(myPrograms).length === 0) {
    document.getElementById("my-programs-list").style.display = "none";
    document.getElementById("no-programs").style.display = "block";
}

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

document.getElementById("remove-from-programs").addEventListener("click", e => {
    delete myPrograms[document.getElementById("remove-name").value];
    localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
    displayNotification(e.target, "Program successfully deleted!", 2000);
});
