//Deploy version 1.1

let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

// Load leads from local storage
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

// Function to render leads in the list
function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

// Event listener for adding current tab URL
tabBtn.addEventListener("click", function () {    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    });
});

// Event listener for deleting all leads
deleteBtn.addEventListener("click", function () {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});

// Event listener for adding leads via button click
inputBtn.addEventListener("click", function () {
    addLead();
});

// Event listener for adding leads via "Enter" key press
inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addLead();
    }
});

// Function to add lead
function addLead() {
    const inputValue = inputEl.value.trim(); // Trim whitespace
    if (inputValue) {
        myLeads.push(inputValue);
        inputEl.value = ""; // Clear the input
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    }
}