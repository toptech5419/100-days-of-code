const ageInput = document.getElementById('age')
const resultDisplay = document.getElementById('result-display')
const checkButton = document.getElementById('btn-check')

//set minimum drinking and driving ages for a jurisdiction 
const minDrinkAge = 16
const minDriveAge = 18

//check button click event listener
checkButton.addEventListener('click', function () {
    let message = ''
    const age = ageInput.value
        // Age is below the minDrinkAge and minDriveAge
        if (age < minDrinkAge && age < minDriveAge) {
            message = `I'm sorry, you cannot drink or drive ⛔`
        // Relevant to countries where minDrinkAge is less than minDriveAge
        } else if (age >= minDrinkAge && age < minDriveAge) {
            message = "You can drink 🍺 but you cannot drive"
        // Relevant to countries where minDriveAge is less than minDrinkAge
        } else if (age >= minDriveAge && age < minDrinkAge) {
            message = "You can drive 🚗 but you cannot drink"
        // Age is above the minDrinkAge and minDriveAge
        } else {
            message = "You can drink 🍺 and drive 🚗 (not at the same time though!)"
        } 
        renderMessage(message)
})

function renderMessage(message) {
    resultDisplay.innerText = message
}


