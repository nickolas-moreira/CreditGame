const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const userGuessInput = document.getElementById("userGuess");
const submitGuessBtn = document.getElementById("submitGuess");
const feedback = document.getElementById("feedback");

let creditScore = 0;
let grade = "";
const maxTries = 2;
let tries = 0;

let wins = 0;
let losses = 0;

// Create elements for stats and hint button
const statsDiv = document.createElement("div");
statsDiv.style.marginTop = "15px";

// Create Show Hint button and add class for styling
const hintBtn = document.createElement("button");
hintBtn.textContent = "Show Hint";
hintBtn.classList.add("game-button"); // add shared button styles

// Create a container div for buttons to control layout
function createButtonWrapper() {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.gap = "12px"; // space between buttons
  wrapper.style.marginTop = "20px";
  wrapper.id = "bottomBtnWrapper";
  return wrapper;
}

// Initial setup: add stats and button wrapper with hint button to game area
const buttonWrapper = createButtonWrapper();
buttonWrapper.appendChild(hintBtn);
gameArea.appendChild(statsDiv);
gameArea.appendChild(buttonWrapper);

// Generate credit score and grade
function generateScore() {
  creditScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
  if (creditScore >= 700) {
    grade = "G";
  } else if (creditScore >= 600) {
    grade = "A";
  } else {
    grade = "P";
  }
}

// Update stats display
function updateStats() {
  statsDiv.textContent = `Wins: ${wins} | Losses: ${losses}`;
}

// Show hint message with animation and sparkle
hintBtn.addEventListener("click", () => {
  let hintMsg = "";
  if (grade === "G")
    hintMsg = "Hint: Your score means you handle credit like a pro — low balances and on-time payments.";
  else if (grade === "A")
    hintMsg = "Hint: Not bad, but there’s room to improve — maybe watch your credit card usage a bit.";
  else
    hintMsg = "Hint: Your credit could use some love — try to avoid late payments and high balances.";

  feedback.textContent = hintMsg;
  feedback.classList.remove("fade-in"); // Reset animation
  void feedback.offsetWidth; // Trigger reflow
  feedback.classList.add("fade-in");

  hintBtn.classList.remove("sparkle");
  void hintBtn.offsetWidth;
  hintBtn.classList.add("sparkle");
});

// Start game handler
startBtn.addEventListener("click", () => {
  generateScore();
  tries = 0;
  feedback.textContent = "";
  feedback.style.color = "inherit";
  userGuessInput.value = "";
  gameArea.classList.remove("hidden");
  startBtn.disabled = true;
  submitGuessBtn.disabled = false;
  userGuessInput.disabled = false;
  userGuessInput.focus();
  updateStats();
});

// Guess submit handler
submitGuessBtn.addEventListener("click", () => {
  const guess = userGuessInput.value.trim().toUpperCase();
  if (!["G", "A", "P"].includes(guess)) {
    feedback.textContent = "❌ That's not a valid answer. Try again.";
    userGuessInput.value = "";
    userGuessInput.focus();
    return;
  }

  tries++;

  if (guess === grade) {
    wins++;
    feedback.innerHTML = `✅ Correct! The credit score was <strong>${creditScore}</strong> (${grade}).`;
    endGame(true);
  } else {
    if (tries < maxTries) {
      feedback.textContent = `❌ Incorrect! You have ${maxTries - tries} guess${maxTries - tries === 1 ? "" : "es"} left.`;
      userGuessInput.value = "";
      userGuessInput.focus();
    } else {
      losses++;
      feedback.innerHTML = `❌ You ran out of guesses. The answer was <strong>${grade}</strong> (score: <strong>${creditScore}</strong>).`;
      endGame(false);
    }
  }
  updateStats();
});

// End game function: disable input, allow restart and emoji rain on win
function endGame(won) {
  submitGuessBtn.disabled = true;
  userGuessInput.disabled = true;

  feedback.style.color = won ? "green" : "red";

  // Remove existing restart button and wrapper if any
  const existingRestartBtn = document.getElementById("restartBtn");
  if (existingRestartBtn) existingRestartBtn.remove();

  const existingWrapper = document.getElementById("bottomBtnWrapper");
  if (existingWrapper) existingWrapper.remove();

  // Create new wrapper and add buttons
  const newWrapper = createButtonWrapper();

  // Re-add hintBtn to new wrapper
  newWrapper.appendChild(hintBtn);

  // Create restart button with styles and event listener
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Play Again";
  restartBtn.id = "restartBtn";
  restartBtn.classList.add("game-button");

  restartBtn.addEventListener("click", () => {
    tries = 0;
    feedback.textContent = "";
    feedback.style.color = "inherit";
    userGuessInput.value = "";
    submitGuessBtn.disabled = false;
    userGuessInput.disabled = false;
    newWrapper.remove();
    generateScore();
    userGuessInput.focus();
  });

  newWrapper.appendChild(restartBtn);
  gameArea.appendChild(newWrapper);

  // If user won, create a burst of falling credit card emojis
  if (won) {
    for (let i = 0; i < 15; i++) {
      setTimeout(createFallingEmoji, i * 100);
    }
  }
}

// Create falling credit card emoji animation
function createFallingEmoji() {
  const emoji = document.createElement("div");
  emoji.textContent = "💳";
  emoji.classList.add("falling-emoji");

  emoji.style.left = Math.random() * (window.innerWidth - 40) + 10 + "px";

  document.body.appendChild(emoji);

  setTimeout(() => {
    emoji.remove();
  }, 2000);
}

// Submit guess on Enter key press for better UX
userGuessInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && !submitGuessBtn.disabled) {
    submitGuessBtn.click();
  }
});
