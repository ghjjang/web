function getRandomInt(number) {
    return Math.floor(Math.random() * number);
}

function bgChange() {
    const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    document.body.style.background = rndCol;
}
bgChange();