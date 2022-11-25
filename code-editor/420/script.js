let worker;

function startQueue() {
    if (typeof worker === "undefined") {
        worker = new Worker("scripts/queue.js");
    }
    worker.addEventListener("message", e => {
        if (typeof e.data.users !== "undefined") {
            document.getElementById("queue-position").innerHTML = `Position in Queue: <strong>${e.data.users}</strong>`;
        } else if (typeof e.data.hours !== "undefined" && typeof e.data.minutes !== "undefined" && typeof e.data.seconds !== "undefined") {
            document.getElementById("queue-time").innerHTML = `Time Left: <strong>${e.data.hours}h ${e.data.minutes}m ${e.data.seconds}s</strong>`;
        }
    });
}

function stopQueue() {
    worker.terminate();
    worker = undefined;
}

startQueue();
