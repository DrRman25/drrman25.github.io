let worker;
const priority = /[?&]priority=([^&]+)/.exec(document.location.search) && parseInt(/[?&]priority=([^&]+)/.exec(document.location.search)[1]) === 1;
const contributor = /[?&]contributor=([^&]+)/.exec(document.location.search) && parseInt(/[?&]contributor=([^&]+)/.exec(document.location.search)[1]) === 1;
window.history.pushState({}, "", document.location.toString().replace(/[#?].*/, ""));

function startQueue() {
    if (typeof worker === "undefined") {
        if (priority) {
            worker = new Worker("scripts/priority-queue.js");
            document.getElementById("queue-priority").innerHTML = `Thank you for donating.
<br/>
You now have priority queue.`;
        } else if (contributor) {
            worker = new Worker("scripts/contributor-queue.js");
            document.getElementById("queue-priority").textContent = "";
        } else {
            worker = new Worker("scripts/basic-queue.js");
        }
    }
    worker.addEventListener("message", e => {
        try {
            if (typeof e.data.users !== "undefined") {
                document.getElementById("queue-position").innerHTML = document.getElementById("queue-position-jumbotron").innerHTML = `Position in Queue: <strong>${e.data.users}</strong>`;
            } else if (typeof e.data.hours !== "undefined" && typeof e.data.minutes !== "undefined" && typeof e.data.seconds !== "undefined") {
                document.getElementById("queue-time").innerHTML = `Time Left: <strong>${e.data.hours}h ${e.data.minutes}m ${e.data.seconds}s</strong>`;
                if (e.data.hours === 0 && e.data.minutes === 0 && e.data.seconds === 0) {
                    stopQueue();
                    location.assign("../3/");
                }
            }
        } catch(err) {
            location.reload();
        }
    });
}

function stopQueue() {
    worker.terminate();
    worker = undefined;
}

setTimeout(startQueue, 500);

addEventListener("beforeinput", e => e.preventDefault());
