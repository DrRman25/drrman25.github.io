if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

if (!localStorage.getItem("code-editor-site-seasonalExtras")) {
    localStorage.setItem("code-editor-site-seasonalExtras", false);
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));
document.body.setAttribute("seasonal-extras", localStorage.getItem("code-editor-site-seasonalExtras"));


const myPrograms = JSON.parse(localStorage.getItem("code-editor-my-programs"));
const urlMyProgramQuery = /[?&]prog=([^&]+)/.exec(document.location.search);

if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1])) && myPrograms[decodeURIComponent(urlMyProgramQuery[1])].hasOwnProperty("tutorial:text") && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"] instanceof Object && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"].constructor === Object && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"].hasOwnProperty("title") && myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"].hasOwnProperty("body") && typeof myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["title"] === "string" && typeof myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["body"] === "string") {
    document.getElementById("tutorial-title").textContent = myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["title"];
    document.title = `Code Editor: ${myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["title"]}`;
    document.querySelector("md-block").textContent = myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:text"]["body"];
} else {
    document.getElementById("tutorial-title").textContent = "No tutorial found!";
}

if (urlMyProgramQuery && myPrograms.hasOwnProperty(decodeURIComponent(urlMyProgramQuery[1])) && myPrograms[decodeURIComponent(urlMyProgramQuery[1])].hasOwnProperty("tutorial:video") && typeof myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:video"] === "string") {
    document.getElementById("video-tutorial-frame").src = myPrograms[decodeURIComponent(urlMyProgramQuery[1])]["tutorial:video"];
} else {
    document.getElementById("video-tutorial-container").style.display = "none";
}

const position = {x: innerWidth - document.getElementById("video-tutorial-container").offsetWidth, y: innerHeight - document.getElementById("video-tutorial-container").offsetHeight};

document.getElementById("video-tutorial-container").addEventListener("dblclick", () => {
    document.getElementById("video-tutorial-container").style.display = "none";
    document.getElementById("show-video").style.display = "block";
});

document.getElementById("show-video").addEventListener("click", () => {
    document.getElementById("video-tutorial-container").style.display = "block";
    document.getElementById("show-video").style.display = "none";
});

document.getElementById("video-tutorial-container").style.transform = `translate(${position.x}px, ${position.y}px)`;

addEventListener("resize", () => {
    if (position.x > innerWidth - document.getElementById("video-tutorial-container").offsetWidth) {
        position.x = innerWidth - document.getElementById("video-tutorial-container").offsetWidth;
    } else if (position.x < 0) {
        position.x = 0;
    }
    if (position.y > innerHeight - document.getElementById("video-tutorial-container").offsetHeight) {
        position.y = innerHeight - document.getElementById("video-tutorial-container").offsetHeight;
    } else if (position.y < 0) {
        position.y = 0;
    }
    document.getElementById("video-tutorial-container").style.transform = `translate(${position.x}px, ${position.y}px)`;
});

interact(document.getElementById("video-tutorial-container")).resizable({
    edges: {
        top: true,
        right: true,
        bottom: true,
        left: true
    },
    listeners: {
        start: () => {
            document.getElementById("video-tutorial-frame-cover").style.display = "block";
        },
        end: e => {
            document.getElementById("video-tutorial-frame-cover").style.display = "none";
            if (position.x > innerWidth - e.rect.width) {
                position.x = innerWidth - e.rect.width;
            } else if (position.x < 0) {
                position.x = 0;
            }
            if (position.y > innerHeight - e.rect.height) {
                position.y = innerHeight - e.rect.height;
            } else if (position.y < 0) {
                position.y = 0;
            }
            Object.assign(e.target.style, {
                width: `${e.rect.width}px`,
                height: `${e.rect.height}px`,
                transform: `translate(${position.x}px, ${position.y}px)`
            });
        },
        move: e => {
            let {x, y} = e.target.dataset;
            position.x += (parseFloat(x) || 0) + e.deltaRect.left;
            position.y += (parseFloat(y) || 0) + e.deltaRect.top;
            Object.assign(e.target.style, {
                width: `${e.rect.width}px`,
                height: `${e.rect.height}px`,
                transform: `translate(${position.x}px, ${position.y}px)`
            });
            Object.assign(e.target.dataset, {x, y});
        }
    }
});

interact(document.getElementById("video-tutorial-container")).draggable({
    listeners: {
        start: () => {
            document.getElementById("video-tutorial-frame-cover").style.display = "block";
        },
        end: e => {
            document.getElementById("video-tutorial-frame-cover").style.display = "none";
            if (position.x > innerWidth - e.rect.width) {
                position.x = innerWidth - e.rect.width;
            } else if (position.x < 0) {
                position.x = 0;
            }
            if (position.y > innerHeight - e.rect.height) {
                position.y = innerHeight - e.rect.height;
            } else if (position.y < 0) {
                position.y = 0;
            }
            e.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
        move: e => {
            position.x += e.dx;
            position.y += e.dy;
            e.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }
    }
});
