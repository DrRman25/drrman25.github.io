function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const queueTimePerUser = getRandomInteger(60, 180);
let usersInQueue = getRandomInteger(30, 120);
postMessage({users: usersInQueue});
let totalQueueTime = queueTimePerUser * usersInQueue;

setInterval(() => {
    usersInQueue--;
    postMessage({users: usersInQueue});
}, queueTimePerUser * 1000);

setInterval(() => {
    totalQueueTime--;
    const hours = Math.floor(totalQueueTime / 3600);
    const minutes = Math.floor(totalQueueTime / 60) - (hours * 60);
    const seconds = totalQueueTime - (hours * 3600) - (minutes * 60);
    postMessage({hours, minutes, seconds});
}, 1000);
