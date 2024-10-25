let saveEl = document.getElementById('save-el');
let count = 0;
let passengerCount = document.getElementById('passenger-count');
function increasePassenger() {
    count++;
    passengerCount.textContent = count;
}

function save() { 
    let countStr = count + " - ";
    saveEl.textContent += countStr;
    passengerCount.textContent = 0;
    count = 0;
}

