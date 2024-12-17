const pickedItems = JSON.parse(localStorage.getItem("pickedItems")) || [];

export let userName = "";

function inputName() {
  const form = document.getElementById("payment-form");

  form.addEventListener("submit", (e) => {
    const nameInput = document.getElementById("name").value;
    if (!nameInput) {
      e.preventDefault(); // Prevent form submission if no name is entered
      alert("Please enter your name!");
    } else {
      userName = nameInput; // Update the userName value
      localStorage.setItem("userName", userName); // Save to localStorage
      console.log("Saved userName to localStorage:", localStorage.getItem("userName"));
    }
  });
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", inputName);





document.addEventListener("DOMContentLoaded", () => {
    const buyItemsContainer = document.getElementById("buy-items");
    let totalAmount = 0;
  
    if (pickedItems.length > 0) {
      pickedItems.forEach(item => {
        const itemsPrice = item.price * item.quantity
        totalAmount += itemsPrice
        const itemHTML = `
          <div class="buy-item">
            <img src="${item.image}" alt="${item.name}" class="buy-item-image">
            <div class="buy-item-details">
              <h2>${item.name}</h2>
              <p>$${item.price}</p>
              <p>Quantity: ${item.quantity}</p>
              </div>
              <div class="items-price">
              <p>$ ${itemsPrice}</p>
            </div>
          </div>
        `;
        buyItemsContainer.innerHTML += itemHTML;
      });
    } else {
      buyItemsContainer.innerHTML = "<p>No items selected.</p>";
    }
    const totalAmountSection = document.createElement('div');
    totalAmountSection.classList.add('total-amount');
    totalAmountSection.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    buyItemsContainer.appendChild(totalAmountSection);
  });


