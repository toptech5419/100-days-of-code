function orderCompleted() {
    const orderPageElement = document.getElementById("order-complete");
  
    // Retrieve userName from localStorage
    const userName = localStorage.getItem("userName") || "Guest";
  
    const orderPage = `
      <h1>Thanks, ${userName}! Your order is on its way!</h1>
      <a href="../index.html">
        <button id="back-to-homepage">Back to Homepage</button>
      </a>
    `;
  
    
    orderPageElement.innerHTML = orderPage;

  document.getElementById("back-to-homepage").addEventListener("click", function () {
    localStorage.clear();
    });
}
  // Wait until DOM is fully loaded
  document.addEventListener("DOMContentLoaded", orderCompleted);

 
  