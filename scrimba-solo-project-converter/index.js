/*
1 meter = 3.281 feet
1 liter = 0.264 gallon
1 kilogram = 2.204 pound
*/

const inputEl = document.getElementById('input-el');
const convertBtn = document.getElementById('convert-btn');
const lengthResult = document.querySelector('.length-result');
const volumeResult = document.querySelector('.volume-result');
const massResult = document.querySelector('.mass-result');

function lengthConvert() {
    const meters = parseFloat(inputEl.value);
    const feet = (meters * 3.281).toFixed(3);
    const convertedFeet = (meters * 0.305).toFixed(3);
    lengthResult.innerText = `${meters} meters ≈ ${feet} feet | ${meters} feet ≈ ${convertedFeet} meters`;
}

function volumeConvert() {
    const liters = parseFloat(inputEl.value);
    const gallons = (liters * 0.264).toFixed(3);
    const convertedLiters = (liters * 3.785).toFixed(3);
    volumeResult.innerText = `${liters} liters ≈ ${gallons} gallons | ${liters} gallons ≈ ${convertedLiters} liters`;
}

function massConvert() {
    const kilos = parseFloat(inputEl.value);
    const pounds = (kilos * 2.204).toFixed(3);
    const convertedKilos = (kilos * 0.453).toFixed(3);
    massResult.innerText = `${kilos} kilos ≈ ${pounds} pounds | ${kilos} pounds ≈ ${convertedKilos} kilos`;
}

function convert() {
    lengthConvert();
    volumeConvert();
    massConvert();
    inputEl.value = '';
}

convertBtn.addEventListener('click', convert);