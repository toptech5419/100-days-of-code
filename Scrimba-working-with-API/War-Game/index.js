let deckId;
let computerScore = 0;
let myScore = 0;

// DOM Elements
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const header = document.getElementById("header");
const remainingText = document.getElementById("remaining");
const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("my-score");
const loadingText = document.getElementById("loading-text"); 

// Show loading status
function showLoading() {
    loadingText.style.display = "block"; 
    document.body.classList.add("loading"); 
}

// Hide loading status
function hideLoading() {
    loadingText.style.display = "none"; 
    document.body.classList.remove("loading"); 
}

// Add down arrow to New Deck button
function addDownArrow() {
    const arrowContainer = document.createElement("div");
    const arrow = document.createElement("span");
    arrow.innerHTML = "&#8595;"; 
    arrow.className = "down-arrow"; 
    arrowContainer.appendChild(arrow);
    arrowContainer.className = "arrow-container"; 
    newDeckBtn.parentNode.insertBefore(arrowContainer, newDeckBtn.nextSibling);
}

// Remove down arrow from New Deck button
function removeDownArrow() {
    const arrowContainer = document.querySelector(".arrow-container");
    if (arrowContainer) {
        arrowContainer.remove();
    }
}

// Start a new deck
async function handleClick() {
    showLoading(); 
    const res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/");
    const data = await res.json();
    
    remainingText.textContent = `Remaining cards: ${data.remaining}`;
    deckId = data.deck_id;
    
    hideLoading(); 
    removeDownArrow(); 
    drawCardBtn.focus(); 
}

// Draw cards
drawCardBtn.addEventListener("click", async () => {
    showLoading(); 
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`);
    const data = await res.json();
    
    remainingText.textContent = `Remaining cards: ${data.remaining}`;

    // Animate card drawing
    for (let i = 0; i < data.cards.length; i++) {
        const cardSlot = cardsContainer.children[i];
        cardSlot.innerHTML = `<img src=${data.cards[i].image} class="card" />`;
        animateCard(cardSlot); 
    }
    
    const winnerText = determineCardWinner(data.cards[0], data.cards[1]);
    header.textContent = winnerText;

    hideLoading(); 

    if (data.remaining === 0) {
        drawCardBtn.disabled = true;
        displayFinalResult();
    }
});


function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"];
    const card1ValueIndex = valueOptions.indexOf(card1.value);
    const card2ValueIndex = valueOptions.indexOf(card2.value);
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++;
        computerScoreEl.textContent = `Computer score: ${computerScore}`;
        return "Computer wins!";
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++;
        myScoreEl.textContent = `My score: ${myScore}`;
        return "You win!";
    } else {
        return "War!";
    }
}

// Display the final result
function displayFinalResult() {
    const finalMessage = computerScore > myScore
        ? "The computer won the game!"
        : myScore > computerScore
        ? "You won the game!"
        : "It's a tie game!";
    
    header.textContent = finalMessage;

    const banner = document.createElement("div");
    banner.className = "winner-banner";
    banner.innerText = finalMessage;
    document.body.appendChild(banner);
    
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart Game";
    restartBtn.className = "restart-button";
    restartBtn.onclick = () => location.reload(); 
    banner.appendChild(restartBtn); 

    banner.style.display = "block"; 
    banner.style.width = "300px"; 
    banner.style.height = "100px"; 
    banner.style.position = "fixed"; 
    banner.style.top = "50%"; 
    banner.style.left = "50%"; 
    banner.style.transform = "translate(-50%, -50%)"; 
    banner.style.textAlign = "center";
    animateBanner(banner); 
}

// Animate card movement
function animateCard(cardSlot) {
    cardSlot.classList.add("animate-card");
    setTimeout(() => {
        cardSlot.classList.remove("animate-card");
    }, 1000);
}

// Animate winner announcement banner
function animateBanner(banner) {
    banner.classList.add("bounce-in");
}

// Initialize game
newDeckBtn.addEventListener("click", handleClick);
addDownArrow();