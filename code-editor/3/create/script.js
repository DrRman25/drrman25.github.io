/**
Import default code templates and user's saved programs.
*/
import myPrograms from "./scripts/my-programs.js";
import defaultCodes from "./scripts/default-codes.js";

/**
Add the site theme and seasonal extras attributes to the body element.
*/
document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));

/**
When the language selection menu is changed, change the name of the program as well. 
*/
document.getElementById("languages").addEventListener("change", () => {
    if (document.getElementById("languages").selectedIndex !== 0) {
        const adjectives = [
            "Gangly",
            "Stupifying",
            "Jawdropping",
            "Mindblowing",
            "Deceiving",
            "Ungainly",
            "Unexpected",
            "Traumatizing",
            "Entertaining",
            "Horrifying",
            "Breathtaking",
            "Terrifying",
            "Lethal",
            "Unusual",
            "Mollifying",
            "Dirty",
            "Smelly",
            "Slippery",
            "Shiny",
            "Lumpy",
            "Sentient",
            "Overcooked",
            "Undercooked",
            "Melted",
            "Holy",
            "Cursed",
            "Traumatized",
            "Petrified",
            "Petrifying",
            "Beautiful",
            "Sunburnt"
        ];
        const plurals = [
            "Toasters",
            "Peanutbutter",
            "Apples",
            "Bellybuttonlint",
            "Toejam",
            "Breadtags",
            "Farts",
            "Dangleberries",
            "Catfur",
            "Elephants",
            "Blackheadremovers",
            "Toiletbrushes",
            "Bananas",
            "Monkeys",
            "Eyeballs",
            "Earwax",
            "Earwigs",
            "Bogans",
            "Armhairs",
            "Fingernails",
            "Trees",
            "Frogs",
            "Water",
            "Leaves",
            "Humans",
            "Onezies",
            "Snails",
            "Lightsabers",
            "Simpsons",
            "Coconuts",
            "Suitcases",
            "Dogs",
            "Cats",
            "Fish",
            "Umbrellas",
            "Animegirls",
            "Hammocks",
            "Printers",
            "Stormtroopers",
            "Snakes",
            "Snacks",
            "Bats",
            "Athletes",
            "Shoes",
            "Batarangs",
            "Gorillas"
        ];
        const adjective1 = adjectives[Math.floor(Math.random() * adjectives.length)];
        adjectives.splice(adjectives.indexOf(adjective1), 1);
        const adjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];
        const plural = plurals[Math.floor(Math.random() * plurals.length)];
        document.getElementById("program-name").value = `${adjective1}${adjective2}${plural}`;
        document.getElementById("program-name").disabled = false;
    } else {
        document.getElementById("program-name").value = "";
        document.getElementById("program-name").disabled = true;
    }
});

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
When the 'Create' button is clicked, save the program, and then open it.
*/
document.getElementById("create").addEventListener("click", e => {
    if (document.getElementById("languages").selectedIndex !== 0) {
        const languageNames = {
            "html-css-js": "HTML, CSS, JS",
            javascript: "Plain JavaScript",
            markdown: "Markdown (experimental)",
            python: "Python",
        }
        const originalProgramName = document.getElementById("program-name").value || languageNames[document.getElementById("languages").value];
        let programName = originalProgramName;
        let programNumber = 1;
        while (myPrograms.hasOwnProperty(programName)) {
            programName = `${originalProgramName} (${programNumber})`;
            programNumber++;
        }
        myPrograms[programName] = {};
        myPrograms[programName]["language"] = document.getElementById("languages").value;
        myPrograms[programName]["program"] = defaultCodes[document.getElementById("languages").value];
        displayNotification(e.target, "Program successfully created!", 2000);
        localStorage.setItem("code-editor-my-programs", JSON.stringify(myPrograms));
        location.assign(`../languages/${document.getElementById("languages").value}/?prog=${programName}`);
    } else {
        displayNotification(e.target, "You did not select a language.", 2000);
    }
});
