// Clearing out the input fields on clicking the submit button
const submitButton = document.querySelector(".contact-submit-button")
submitButton.addEventListener("click", () =>{
    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
    document.getElementById("message").value = ""
})

// document.querySelector(".contact-submit-button").onclick = function() {submitForm()};

// const submitForm = () => {
//     document.getElementById("name").value = ""
//     document.getElementById("email").value = ""
// }

// Clearing out the input fields on clicking the submit button