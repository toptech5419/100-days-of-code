// index.js
document.getElementById("button").addEventListener("click", function () {
    fetch("https://apis.scrimba.com/bored/api/activity")
      .then(response => response.json())
      .then(data => {
        document.getElementById("activity").textContent = data.activity;
        document.getElementById("title").textContent = "🦾 HappyBot 🦿";
        document.body.classList.add("fun");
      });
  
    // Trigger the animation by showing the emoji
    const animatedEmoji = document.getElementById("animated-emoji");
    animatedEmoji.style.display = "block";
  
    // Reset animation by removing and re-adding the class
    animatedEmoji.classList.remove("animate");
    void animatedEmoji.offsetWidth; // Trigger reflow to restart animation
    animatedEmoji.classList.add("animate");
  });
  