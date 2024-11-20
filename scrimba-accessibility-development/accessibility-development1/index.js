
document.querySelector(".submit-button").onclick = function() {submitForm()};

const submitForm = () => {
    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
}