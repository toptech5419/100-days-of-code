const API_URL = "https://www.thecolorapi.com/scheme";
const modes = [
  "monochrome",
  "monochrome-dark",
  "monochrome-light",
  "analogic",
  "complement",
  "analogic-complement",
  "triad",
  "quad",
];

// Populate dropdown with color modes
const colorSchemeDropdown = document.getElementById("color-scheme");
colorSchemeDropdown.innerHTML = modes
  .map((mode) => `<option value="${mode}">${mode}</option>`)
  .join("");

// Handle form submission
document.getElementById("color-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const color = document
    .getElementById("pick-color")
    .value.replace("#", "")
    .toUpperCase();
  const mode = colorSchemeDropdown.value;
  fetchColorScheme(color, mode);
});

// Fetch and display color scheme
function fetchColorScheme(color, mode) {
  const url = `${API_URL}?hex=${color}&mode=${mode}&count=5`;
  const container = document.getElementById("show-container");
  container.innerHTML = "";

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then((data) => displayColors(data.colors))
    .catch((error) => console.error("Error fetching color scheme:", error));
}


// Display fetched colors in the UI
function displayColors(colors) {
  const container = document.getElementById("show-container");
  container.innerHTML = colors
    .map(
      (color) => `
        <div class="color-box">
          <div class="color-swatch" style="background-color:${color.hex.value};"></div>
          <p class="color-hex">${color.hex.value}</p>
        </div>
      `
    )
    .join("");

  // Add click event to each color-box
  document.querySelectorAll(".color-box").forEach((box) => {
    box.addEventListener("click", () => {
      const hexToCopy = box.querySelector(".color-hex").textContent;
      navigator.clipboard
        .writeText(hexToCopy)
        .then(() => {
          alert(`Color ${hexToCopy} copied to clipboard!`);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  });
}


