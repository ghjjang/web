let target = document.querySelector("#dynamic");
let stringArr = ["push-up", "pull-up", "squat", "deadlift", "bench press", "overhead press", "lunge", "leg press", "bicep curl", "tricep dip", "plank", "burpee", "mountain climber", "jumping jack", "high knees"];
let selctString = stringArr[Math.floor(Math.random() * stringArr.length)];
let selctStringArr = selctString.split("");

function randomString() {
    let randomArr = [];
    for(let i = 0; i < selctStringArr.length; i++) {
        let randomIndex = Math.floor(Math.random() * selctStringArr.length);
        randomArr.push(selctStringArr[randomIndex]);
    }
    return randomArr;
}

function dynamic(randomArr) {

    if(randomArr.length > 0) {
        target.innerHTML += randomArr.shift();
        setTimeout(function() {
            dynamic(randomArr);
        }, 80);
    }else {
        setTimeout(function() {
            target.innerHTML = "";
            selctString = stringArr[Math.floor(Math.random() * stringArr.length)];
            selctStringArr = selctString.split("");
            dynamic(selctStringArr);
        }, 2000);
    }
}

dynamic(selctStringArr);

console.log(selctString);
console.log(selctStringArr);

function blink() {
    target.classList.toggle("active");
}
setInterval(blink, 500);