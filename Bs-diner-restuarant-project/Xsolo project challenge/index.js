import menuArray from "./data.js";

const clearAll = document.querySelector(".clear-btn");
const buyItemsBtn = document.querySelector(".buy-btn");

// Retrieve saved inputArray from localStorage
let inputArray = JSON.parse(localStorage.getItem("inputArray")) || [];


// Function to save inputArray to localStorage
function saveToLocalStorage() {
  localStorage.setItem("inputArray", JSON.stringify(inputArray));
}

// Function to load input values from localStorage and render them
function loadInputValues() {
  inputArray.forEach(({ id, quantity }) => {
    const inputField = document.getElementById(`${id}-input`);
    const decrementBtn = document.querySelector(`[data-decrement="${id}"]`);

    if (inputField) {
      inputField.value = quantity;
      decrementBtn.disabled = quantity <= 0;
    }
  });

  // Enable/Disable clear and buy buttons based on data
  const hasItems = inputArray.some(item => item.quantity > 0);
  clearAll.disabled = !hasItems;
  buyItemsBtn.disabled = !hasItems;
}

// Function to render the menu
function menu(items) {
  let menuInnerHTML = "";
  items.forEach((item) => {
    menuInnerHTML += `<div class="menu-item">
      <div id="${item.id}" class="item-info">
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-details">
          <h2 class="item-name">${item.name}</h2>
          <p class="item-description">${item.ingredients.join(", ")}</p>
          <p class="item-price">$${item.price}</p>
        </div>
      </div>
      <div class="item-quantity">
        <button type="button" data-decrement="${item.id}" class="decrement-btn" disabled>-</button>
        <input aria-label="quantity" id="${item.id}-input" type="number" placeholder="0" class="quantity-input" min="1">
        <button type="button" data-increment="${item.id}" class="increment-btn">+</button>
      </div>
    </div>`;
  });
  return menuInnerHTML;
}

function renderMenu() {
  document.querySelector(".menu-container").innerHTML = menu(menuArray);
  loadInputValues(); 
}
renderMenu();

// Handle input changes
function handleInputChange(e) {
  const id = parseInt(e.target.id.split("-")[0]);
  const value = parseInt(e.target.value) || 0;
  const decrementBtn = document.querySelector(`[data-decrement="${id}"]`);

  // Update buttons
  decrementBtn.disabled = value <= 0;

  // Update inputArray
  const existingItemIndex = inputArray.findIndex(entry => entry.id === id);
  if (existingItemIndex !== -1) {
    inputArray[existingItemIndex].quantity = value;
  } else {
    inputArray.push({ id, quantity: value });
  }

  // Enable/Disable clear and buy buttons
  updateButtonStates();

  saveToLocalStorage();
}

// Update button states based on inputArray content
function updateButtonStates() {
  const hasItems = inputArray.some(item => item.quantity > 0);
  clearAll.disabled = !hasItems;
  buyItemsBtn.disabled = !hasItems;
}

// Handle decrement button clicks
function handleDecrementClick(e) {
  const id = parseInt(e.target.dataset.decrement);
  const inputField = document.getElementById(`${id}-input`);
  const decrementBtn = e.target;

  if (inputField) {
    let currentValue = parseInt(inputField.value) || 0;

    if (currentValue > 0) {
      currentValue--;
      inputField.value = currentValue;

      decrementBtn.disabled = currentValue === 0;

      // Update inputArray
      const existingItemIndex = inputArray.findIndex(entry => entry.id === id);
      if (existingItemIndex !== -1) {
        inputArray[existingItemIndex].quantity = currentValue;
      }
      saveToLocalStorage();
    }
  }

  updateButtonStates();
}

// Handle increment button clicks
function handleIncrementClick(e) {
  const id = parseInt(e.target.dataset.increment);
  const inputField = document.getElementById(`${id}-input`);
  const decrementBtn = document.querySelector(`[data-decrement="${id}"]`);

  if (inputField) {
    let currentValue = parseInt(inputField.value) || 0;
    currentValue++;
    inputField.value = currentValue;

    decrementBtn.disabled = false;

    // Update inputArray
    const existingItemIndex = inputArray.findIndex(entry => entry.id === id);
    if (existingItemIndex !== -1) {
      inputArray[existingItemIndex].quantity = currentValue;
    } else {
      inputArray.push({ id, quantity: currentValue });
    }

    updateButtonStates();

    saveToLocalStorage();
  }
}

// Clear all button
function clearAllBtn() {
  inputArray = [];
  localStorage.clear();
  location.reload(); 
}

function filterMenu() {
  const filteredArray = menuArray
    .filter(menuItem => {
      const match = inputArray.find(inputItem => inputItem.id === menuItem.id);
      if (match && match.quantity > 0) {
        return true;
      }
      return false;
    })
    .map(({ id, name, image, price}) => {
      const quantity = inputArray.find(inputItem => inputItem.id === id).quantity;
      return { id, name, image, price, quantity };
    });

  return filteredArray;
}

function buyBtn() {
  const filteredMenu = filterMenu();

  if (filteredMenu.length === 0) {
    alert("No items selected to buy!");
  }else{
    window.location.href = './buyPage/buyPage.html';
  localStorage.setItem("pickedItems", JSON.stringify(filteredMenu));
}
}


document.addEventListener("input", (e) => {
  if (e.target.classList.contains("quantity-input")) {
    handleInputChange(e);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("decrement-btn")) {
    handleDecrementClick(e);
  } else if (e.target.classList.contains("increment-btn")) {
    handleIncrementClick(e);
  } else if (e.target.classList.contains("buy-btn")) {
    buyBtn();
  } else if (e.target.classList.contains("clear-btn")) {
    clearAllBtn();
  }
});
  