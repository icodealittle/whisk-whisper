// =============================================================
// Whisk & Whisper v27 — Natural Flow + Reactive Glow Fix
// =============================================================

const API_BASE = "http://localhost:3000";

let recipes = {};
let currentRecipe = null;
let currentStep = 0;
let recognition = null;
let isSpeaking = false;

let micPermissionGranted = false;
let cookingSessionStarted = false;
let ingredientsConfirmed = false;
let waitingForConfirmation = false;

// ===================== LOAD RECIPES ===================== //
fetch("../data/recipes.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load recipes.json");
    return res.json();
  })
  .then((data) => {
    recipes = data;
    console.log("📖 Recipes loaded:", Object.keys(recipes));
    initApp();
  })
  .catch((err) => console.error("❌ Error loading recipes:", err));

// ===================== INITIALIZATION ===================== //
function initApp() {
  console.log("✅ Whisk & Whisper initialized");
  checkVoiceSupport();
  setupEventListeners();
  showEmptyState();
}

function setupEventListeners() {
  const recipeSelect = document.getElementById("recipeSelect");
  if (recipeSelect) recipeSelect.addEventListener("change", selectRecipe);
}

// ===================== RECIPE SELECTION ===================== //
function selectRecipe(e) {
  const recipeKey = e.target.value;
  if (!recipeKey) {
    currentRecipe = null;
    showEmptyState();
    return;
  }

  currentRecipe = recipes[recipeKey];
  currentStep = 0;
  cookingSessionStarted = false;
  ingredientsConfirmed = false;
  waitingForConfirmation = false;

  displayIngredients();
  displayCookingInterface();
}

function displayIngredients() {
  const ingredientsList = document.getElementById("ingredientsList");
  ingredientsList.innerHTML = "";
  currentRecipe.ingredients.forEach((i) => {
    const li = document.createElement("li");
    li.textContent = i;
    ingredientsList.appendChild(li);
  });
  document.getElementById("ingredientsSection").classList.remove("hidden");
}

function displayCookingInterface() {
  const stepDisplay = document.getElementById("stepDisplay");
  const step = currentRecipe.steps[0];
  stepDisplay.innerHTML = `
    <div class="step-display">
      <div class="recipe-image">${currentRecipe.image}</div>
      <div class="step-header">
        <div class="step-number">Step 1</div>
        <div class="progress-text">1 of ${currentRecipe.steps.length}</div>
      </div>
      <div class="step-icon">${step.icon}</div>
      <div class="step-content">${step.instruction}</div>
      <div class="tip-section hidden" id="tipSection">
        <h3>💡 Pro Tip</h3>
        <p id="tipContent"></p>
      </div>
    </div>
  `;
  appendControls(stepDisplay);
}

function appendControls(container) {
  const controls = document.createElement("div");
  controls.className = "controls";
  controls.innerHTML = `
    <button class="btn-primary" onclick="startCooking()">Start Cooking</button>
    <button class="btn-secondary" onclick="requestMicPermission()">🎤 Voice Control</button>
    <button class="btn-outline" onclick="previousStep()">← Previous</button>
    <button class="btn-outline" onclick="repeatStep()">🔄 Repeat</button>
    <button class="btn-outline" onclick="showTip()">💡 Tip</button>
    <button class="btn-outline" onclick="nextStep()">Next →</button>
  `;
  container.appendChild(controls);
}

// ===================== EMPTY STATE ===================== //
function showEmptyState() {
  const stepDisplay = document.getElementById("stepDisplay");
  stepDisplay.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">👨‍🍳</div>
      <h3>Select a recipe to get started!</h3>
      <p>Choose from the dropdown and start cooking with voice commands.</p>
    </div>
  `;
}

// ===================== START COOKING FLOW ===================== //
function startCooking() {
  if (!currentRecipe) {
    speak("Please select a recipe first.");
    return;
  }

  if (!cookingSessionStarted) {
    cookingSessionStarted = true;
    ingredientsConfirmed = false;
    waitingForConfirmation = true;

    speak("Before we begin, let's make sure you have everything you need for this recipe.", () => {
      readIngredientsAloud();
    });
  } else {
    speak("You're already cooking this recipe.");
  }
}

// ===================== INGREDIENT CONFIRMATION ===================== //
function readIngredientsAloud() {
  if (!currentRecipe) return;

  let ingredientsText = "Here's what you'll need: ";
  currentRecipe.ingredients.forEach((ingredient, i) => {
    ingredientsText += `Ingredient ${i + 1}: ${ingredient}. `;
  });
  ingredientsText += "Once you've checked everything, press confirm to begin.";

  speak(ingredientsText, () => showIngredientConfirmPopup());
}

function showIngredientConfirmPopup() {
  const existing = document.getElementById("ingredientConfirmModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "ingredientConfirmModal";
  modal.className = "ingredient-confirm-bar";
  modal.innerHTML = `
    <div class="ingredient-confirm-content">
      <div class="confirm-icon">✅</div>
      <div class="confirm-text">
        <strong>Ingredients Reviewed</strong>
        <p>Click below to confirm and start Step 1.</p>
      </div>
      <button class="btn-primary" id="confirmIngredientsBtn">Confirm</button>
    </div>
  `;
  document.body.appendChild(modal);

  requestAnimationFrame(() => modal.classList.add("active"));

  document.getElementById("confirmIngredientsBtn").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
      waitingForConfirmation = false;
      ingredientsConfirmed = true;
      speak("Great! Let's begin with step one.", () => readStep());
    }, 300);
  });
}

// ===================== REACTIVE GLOW INDICATOR ===================== //
const glowIndicator = document.getElementById("listeningIndicator");
function setGlowState(state) {
  if (!glowIndicator) return;
  glowIndicator.classList.remove("listening", "speaking", "responding");
  if (state) glowIndicator.classList.add(state);
}

// ===================== VOICE RECOGNITION ===================== //
function checkVoiceSupport() {
  const supportDiv = document.getElementById("voiceSupport");
  if ("webkitSpeechRecognition" in window && "speechSynthesis" in window) {
    supportDiv.innerHTML = '<span style="color: #10b981;">✓ Voice Control Available</span>';
    initSpeechRecognition();
  } else {
    supportDiv.innerHTML = '<span style="color: #ef4444;">✗ Voice Control Not Supported</span>';
  }
}

function initSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log("🎤 Voice command:", command);
    handleVoiceCommand(command);
  };

  recognition.onspeechstart = () => setGlowState("responding");
  recognition.onspeechend = () => setGlowState("listening");
  recognition.onerror = (e) => console.error("Speech recognition error:", e.error);
}

function requestMicPermission() {
  if (!recognition) {
    alert("Voice control is not supported in this browser.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => {
      micPermissionGranted = true;
      showToast("🎤 Voice control enabled!");
      startVoiceControl();
    })
    .catch(() => alert("Microphone access denied. Please enable it in browser settings."));
}

function startVoiceControl() {
  if (!recognition) return;
  recognition.start();
  setGlowState("listening");
}

function stopVoiceControl() {
  if (recognition) recognition.stop();
  setGlowState(null);
}

// ===================== VOICE COMMAND HANDLING ===================== //
function handleVoiceCommand(command) {
  command = command.toLowerCase().trim();

  if (!cookingSessionStarted && (command.includes("start cooking") || command === "start")) {
    cookingSessionStarted = true;
    speak("Before we begin, let's make sure you have all the ingredients.", () => readIngredientsAloud());
    return;
  }

  if (command.includes("confirm")) {
    const modal = document.getElementById("ingredientConfirmModal");
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.remove();
        waitingForConfirmation = false;
        ingredientsConfirmed = true;
        speak("Great! Let's begin with step one.", () => readStep());
      }, 300);
      return;
    }
  }

  if (!ingredientsConfirmed) {
    speak("Please confirm your ingredients first.");
    return;
  }

  if (command.includes("next")) {
    speak("Got it, moving to the next step.", () => nextStep());
    return;
  }

  if (command.includes("previous") || command.includes("back")) {
    speak("Going back to the previous step.", () => previousStep());
    return;
  }

  if (command.includes("repeat") || command.includes("again")) {
    speak("Repeating this step for you.", () => repeatStep());
    return;
  }

  if (command.includes("tip") || command.includes("hint")) {
    showTip(true);
    return;
  }

  if (command.includes("stop")) {
    stopVoiceControl();
    speak("Stopping voice control. You can continue manually.");
    return;
  }

  speak("Sorry, I didn't catch that. Try saying next, repeat, or tip.");
}

// ===================== SPEECH SYNTHESIS ===================== //
function disableControlsDuringSpeech(disabled = true) {
  document.querySelectorAll("button").forEach((btn) => {
    if (!btn.classList.contains("no-lock")) btn.disabled = disabled;
  });
}

async function speak(text, onComplete) {
  const voice = "fable";
  if (!text || text.trim() === "") return;
  if (isSpeaking) return;

  if (recognition) recognition.stop();
  isSpeaking = true;
  disableControlsDuringSpeech(true);
  setGlowState("speaking");

  try {
    const response = await fetch(`${API_BASE}/api/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice })
    });

    if (!response.ok) throw new Error("OpenAI voice unavailable");
    const blob = await response.blob();
    const audio = new Audio(URL.createObjectURL(blob));

    audio.onended = () => {
      isSpeaking = false;
      disableControlsDuringSpeech(false);
      if (onComplete) onComplete();
      if (micPermissionGranted && recognition) setTimeout(() => recognition.start(), 800);
      setGlowState("listening");
    };

    audio.play();
  } catch (err) {
    console.warn("🎙️ Fallback TTS used:", err);
    if (isSpeaking) window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.2;

    utter.onend = () => {
      isSpeaking = false;
      disableControlsDuringSpeech(false);
      if (onComplete) onComplete();
      if (micPermissionGranted && recognition) setTimeout(() => recognition.start(), 800);
      setGlowState("listening");
    };

    window.speechSynthesis.speak(utter);
  }
}

function readStep() {
  if (!currentRecipe) return;
  if (currentStep >= currentRecipe.steps.length) return showCompletionMessage();

  const step = currentRecipe.steps[currentStep];
  updateStepDisplay(step);

  const intro = `Step ${currentStep + 1}.`;
  const instruction = step.instruction;
  const tipText =
    step.tip && step.tip.trim() !== ""
      ? `Here's a helpful tip: ${step.tip.trim()}`
      : "";

  // Speak in sequence with ~1s pause before the tip
  speak(intro, () => {
    speak(instruction, () => {
      if (tipText) {
        setTimeout(() => speak(tipText), 1000); // shorter, more natural delay
      }
    });
  });
}


function nextStep() {
  if (currentStep < currentRecipe.steps.length - 1) {
    currentStep++;
    readStep();
  } else showCompletionMessage();
}

function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    readStep();
  } else speak("You are already at the first step.");
}

function repeatStep() {
  readStep();
}

function showTip(forceSpeak = false) {
  if (!currentRecipe || !currentRecipe.steps[currentStep]) return;
  const tip = currentRecipe.steps[currentStep].tip;
  const tipSection = document.getElementById("tipSection");
  const tipContent = document.getElementById("tipContent");
  if (tipSection && tipContent) {
    tipContent.textContent = tip;
    tipSection.classList.remove("hidden");
  }
  speak(`Here's a tip: ${tip}`);
}

// ===================== UI UPDATE ===================== //
function updateStepDisplay(step) {
  const stepDisplay = document.getElementById("stepDisplay");
  stepDisplay.innerHTML = `
    <div class="step-header">
      <div class="step-number">Step ${currentStep + 1}</div>
      <div class="progress-text">of ${currentRecipe.steps.length}</div>
    </div>
    <div class="step-content">${step.instruction}</div>
    <div class="step-icon">${step.icon}</div>
    <div class="tip-section">
      <h3>Tip:</h3>
      <p>${step.tip}</p>
    </div>
  `;
  appendControls(stepDisplay);
}

// ===================== COMPLETION ===================== //
function showCompletionMessage() {
  const stepDisplay = document.getElementById("stepDisplay");
  stepDisplay.innerHTML = `
    <div class="completion-message">
      <div class="completion-icon">🎉</div>
      <h2>Congratulations!</h2>
      <p>You completed ${currentRecipe.title}. Enjoy your meal!</p>
    </div>
  `;
  speak("Congratulations! You've completed this recipe. Enjoy your meal!");
}

// ===================== TOAST ===================== //
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===================== EXPORT ===================== //
window.startCooking = startCooking;
window.requestMicPermission = requestMicPermission;
window.stopVoiceControl = stopVoiceControl;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.repeatStep = repeatStep;
window.showTip = showTip;
