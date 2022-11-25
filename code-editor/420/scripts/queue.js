function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const queueTimePerUser = getRandomInteger(120, 420);
let usersInQueue = getRandomInteger(60, 420);
postMessage({users: usersInQueue});
//document.getElementById("queue-position").innerHTML = `Position in Queue: <strong>${usersInQueue}</strong>`;
let totalQueueTime = queueTimePerUser * usersInQueue;

setInterval(() => {
    usersInQueue--;
    postMessage({users: usersInQueue});
    //document.getElementById("queue-position").innerHTML = `Position in Queue: <strong>${usersInQueue}</strong>`;
}, queueTimePerUser * 1000);

setInterval(() => {
    totalQueueTime--;
    const hours = Math.floor(totalQueueTime / 3600);
    const minutes = Math.floor(totalQueueTime / 60) - (hours * 60);
    const seconds = totalQueueTime - (hours * 3600) - (minutes * 60);
    postMessage({hours, minutes, seconds});
    //document.getElementById("queue-time").innerHTML = `Time Left: <strong>${hours}h ${minutes}m ${seconds}s</strong>`;
}, 1000);
