// // Whisk & Whisper v23 — Modular Edition (Final Stable + Voice Fixes)

// let recipes = {};
// let currentRecipe = null;
// let currentStep = 0;
// let recognition = null;
// let isSpeaking = false;

// let micPermissionGranted = false;
// let cookingSessionStarted = false;
// let ingredientsConfirmed = false;
// let waitingForConfirmation = false;
// let confirmationTimeout = null;

// // ===================== LOAD RECIPES THEN INIT ===================== //
// fetch("../data/recipes.json")
//   .then((response) => {
//     if (!response.ok) throw new Error("Failed to load recipes.json");
//     return response.json();
//   })
//   .then((data) => {
//     recipes = data;
//     console.log("📖 Recipes loaded:", Object.keys(recipes));
//     initApp();
//   })
//   .catch((err) => console.error("❌ Error loading recipes:", err));

// function initApp() {
//   console.log("✅ Whisk & Whisper initialized");
//   checkVoiceSupport();
//   setupEventListeners();
//   showEmptyState();
// }

// // ===================== EVENT LISTENERS ===================== //
// function setupEventListeners() {
//   const recipeSelect = document.getElementById("recipeSelect");
//   if (recipeSelect) {
//     recipeSelect.addEventListener("change", selectRecipe);
//   }
// }

// // ===================== RECIPE SELECTION ===================== //
// function selectRecipe(e) {
//   const recipeKey = e.target.value;
//   if (!recipeKey) {
//     currentRecipe = null;
//     document.getElementById("ingredientsSection").classList.add("hidden");
//     showEmptyState();
//     return;
//   }

//   currentRecipe = recipes[recipeKey];
//   currentStep = 0;
//   cookingSessionStarted = false;
//   ingredientsConfirmed = false;
//   waitingForConfirmation = false;
//   if (confirmationTimeout) clearTimeout(confirmationTimeout);

//   displayIngredients();
//   displayCookingInterface();
// }

// // ===================== DISPLAY SECTIONS ===================== //
// function displayIngredients() {
//   const ingredientsList = document.getElementById("ingredientsList");
//   ingredientsList.innerHTML = "";

//   currentRecipe.ingredients.forEach((ingredient) => {
//     const li = document.createElement("li");
//     li.textContent = ingredient;
//     ingredientsList.appendChild(li);
//   });

//   document.getElementById("ingredientsSection").classList.remove("hidden");
// }

// function displayCookingInterface() {
//   const stepDisplay = document.getElementById("stepDisplay");
//   const step = currentRecipe.steps[0];

//   stepDisplay.innerHTML = `
//     <div class="step-display">
//       <div class="recipe-image">${currentRecipe.image}</div>
//       <div class="step-header">
//         <div class="step-number" id="stepNumber">Step 1</div>
//         <div class="progress-text" id="progressText">1 of ${currentRecipe.steps.length}</div>
//       </div>
//       <div class="step-icon" id="stepIcon">${step.icon}</div>
//       <div class="step-content" id="stepContent">${step.instruction}</div>
//       <div class="tip-section hidden" id="tipSection">
//         <h3>💡 Pro Tip</h3>
//         <p id="tipContent"></p>
//       </div>
//     </div>
//   `;

//   appendControls(stepDisplay);
// }

// function appendControls(container) {
//   const controls = document.createElement("div");
//   controls.className = "controls";
//   controls.innerHTML = `
//     <button class="btn-primary" onclick="startCooking()">Start Cooking</button>
//     <button class="btn-secondary" onclick="requestMicPermission()">🎤 Voice Control</button>
//     <button class="btn-outline" onclick="previousStep()">← Previous</button>
//     <button class="btn-outline" onclick="repeatStep()">🔄 Repeat</button>
//     <button class="btn-outline" onclick="showTip()">💡 Tip</button>
//     <button class="btn-outline" onclick="nextStep()">Next →</button>
//   `;
//   container.appendChild(controls);
// }

// function showEmptyState() {
//   const stepDisplay = document.getElementById("stepDisplay");
//   stepDisplay.innerHTML = `
//     <div class="empty-state">
//       <div class="empty-state-icon">👨‍🍳</div>
//       <h3>Select a recipe to get started!</h3>
//       <p>Choose from the dropdown and start cooking with voice commands.</p>
//     </div>
//   `;
// }

// // ===================== START COOKING FLOW ===================== //
// function startCooking() {
//   if (!currentRecipe) {
//     speak("Please select a recipe first.");
//     return;
//   }

//   if (!cookingSessionStarted) {
//     cookingSessionStarted = true;
//     speak("Before we begin, let me make sure you have all the ingredients.");
//     readIngredientsAloud();
//   } else {
//     speak("You are already cooking!");
//   }
// }

// // ===================== VOICE CONTROL ===================== //
// function checkVoiceSupport() {
//   const supportDiv = document.getElementById("voiceSupport");
//   if ("webkitSpeechRecognition" in window && "speechSynthesis" in window) {
//     supportDiv.innerHTML =
//       '<span style="color: #10b981;">✓ Voice Control Available</span>';
//     initSpeechRecognition();
//   } else {
//     supportDiv.innerHTML =
//       '<span style="color: #ef4444;">✗ Voice Control Not Supported</span>';
//   }
// }

// function initSpeechRecognition() {
//   recognition = new webkitSpeechRecognition();
//   recognition.continuous = true; // Continuous listening enabled
//   recognition.interimResults = false;
//   recognition.lang = "en-US";

//   recognition.onresult = (event) => {
//     const command = event.results[event.results.length - 1][0].transcript
//       .toLowerCase()
//       .trim();
//     console.log("🎤 Voice command:", command);
//     handleVoiceCommand(command);
//   };

//   recognition.onerror = (event) => {
//     console.error("Speech recognition error:", event.error);
//     updateStatus("ready");
//   };
// }

// function requestMicPermission() {
//   if (!recognition) {
//     alert("Voice control is not supported in this browser.");
//     return;
//   }
//   if (!micPermissionGranted) {
//     document.getElementById("permissionModal").classList.add("active");
//   } else {
//     startVoiceControl();
//   }
// }

// function confirmMicPermission() {
//   micPermissionGranted = true;
//   closePermissionModal();
//   startVoiceControl();
// }

// function closePermissionModal() {
//   document.getElementById("permissionModal").classList.remove("active");
// }

// function startVoiceControl() {
//   if (!recognition) {
//     alert("Voice control not supported.");
//     return;
//   }

//   document.getElementById("voiceModal").classList.add("active");
//   document.querySelector(".container").classList.add("listening-active");
//   updateStatus("listening");
//   recognition.start();
// }

// function stopVoiceControl() {
//   if (recognition) recognition.stop();
//   document.getElementById("voiceModal").classList.remove("active");
//   document.querySelector(".container").classList.remove("listening-active");
//   updateStatus("ready");

//   if (waitingForConfirmation && confirmationTimeout) {
//     clearTimeout(confirmationTimeout);
//     waitingForConfirmation = false;
//   }
// }

// // ===================== VOICE COMMANDS ===================== //
// function handleVoiceCommand(command) {
//   if (!cookingSessionStarted) {
//     if (command.includes("start cooking") || command.includes("start")) {
//       startCooking();
//       return;
//     }
//     speak("Say 'start cooking' to begin.");
//     return;
//   }

//   if (waitingForConfirmation) {
//     clearTimeout(confirmationTimeout);

//     if (
//       ["yes", "go ahead", "move forward", "continue", "start"].some((kw) =>
//         command.includes(kw)
//       )
//     ) {
//       waitingForConfirmation = false;
//       ingredientsConfirmed = true;
//       speak("Great! Let's begin with step one.");
//       readStep();
//       return;
//     } else if (command.includes("no")) {
//       waitingForConfirmation = false;
//       speak("Would you like me to repeat the ingredients?");
//       return;
//     } else if (command.includes("repeat")) {
//       readIngredientsAloud();
//       return;
//     }
//   }

//   if (!ingredientsConfirmed) {
//     speak("Please confirm the ingredients first.");
//     return;
//   }

//   if (command.includes("next")) nextStep();
//   else if (command.includes("previous") || command.includes("back"))
//     previousStep();
//   else if (command.includes("repeat") || command.includes("again"))
//     repeatStep();
//   else if (command.includes("tip") || command.includes("hint")) showTip();
// }

// // ===================== SPEECH SYNTHESIS ===================== //
// function speak(text) {
//   if (isSpeaking) window.speechSynthesis.cancel();

//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.rate = 0.95;
//   utterance.pitch = 1;

//   utterance.onstart = () => {
//     isSpeaking = true;
//     updateStatus("speaking");
//     if (recognition) recognition.stop(); // prevent overlap
//   };

//   utterance.onend = () => {
//     isSpeaking = false;
//     updateStatus("listening");
//     // Resume listening automatically
//     if (micPermissionGranted && recognition) {
//       setTimeout(() => recognition.start(), 500);
//     }
//   };

//   window.speechSynthesis.speak(utterance);
// }

// // ===================== COOKING STEPS ===================== //
// function readIngredientsAloud() {
//   if (!currentRecipe) return;
//   let ingredientsText =
//     "Before we begin, let me make sure you have all the ingredients. ";
//   currentRecipe.ingredients.forEach((ingredient, i) => {
//     ingredientsText += `Item ${i + 1}: ${ingredient}. `;
//   });
//   ingredientsText += "Do you want to move forward?";

//   waitingForConfirmation = true;
//   speak(ingredientsText);

//   if (confirmationTimeout) clearTimeout(confirmationTimeout);
//   confirmationTimeout = setTimeout(() => {
//     if (waitingForConfirmation) {
//       speak("Would you like me to repeat the ingredients?");
//     }
//   }, 10000);
// }

// function readStep() {
//   if (currentStep < currentRecipe.steps.length) {
//     const step = currentRecipe.steps[currentStep];
//     updateStepDisplay(step);
//     speak(`Step ${currentStep + 1}: ${step.instruction}`);
//   } else {
//     showCompletionMessage();
//   }
// }

// function nextStep() {
//   if (currentStep < currentRecipe.steps.length - 1) {
//     currentStep++;
//     readStep();
//   } else {
//     showCompletionMessage();
//   }
// }

// function previousStep() {
//   if (currentStep > 0) {
//     currentStep--;
//     readStep();
//   } else {
//     speak("You are already at the first step.");
//   }
// }

// function repeatStep() {
//   readStep();
// }

// function showTip() {
//   const tip = currentRecipe.steps[currentStep].tip;
//   document.getElementById("tipContent").textContent = tip;
//   document.getElementById("tipSection").classList.remove("hidden");
//   speak("Here's a tip: " + tip);
// }

// // ===================== UPDATE STEP DISPLAY ===================== //
// function updateStepDisplay(step) {
//   const stepDisplay = document.getElementById("stepDisplay");
//   stepDisplay.innerHTML = `
//     <div class="step-header">
//       <div class="step-number">Step ${currentStep + 1}</div>
//       <div class="progress-text">of ${currentRecipe.steps.length}</div>
//     </div>
//     <div class="step-content">${step.instruction}</div>
//     <div class="step-icon">${step.icon}</div>
//     <div class="tip-section">
//       <h3>Tip:</h3>
//       <p>${step.tip}</p>
//     </div>
//   `;
//   appendControls(stepDisplay);
// }

// function showCompletionMessage() {
//   const stepDisplay = document.getElementById("stepDisplay");
//   stepDisplay.innerHTML = `
//     <div class="completion-message">
//       <div class="completion-icon">🎉</div>
//       <h2>Congratulations!</h2>
//       <p>You completed ${currentRecipe.title}. Enjoy your meal!</p>
//     </div>
//   `;
//   speak(
//     "Congratulations, you completed the cooking instruction. Enjoy your meal!"
//   );
// }

// // ===================== STATUS BAR ===================== //
// function updateStatus(status) {
//   const dot = document.getElementById("statusDot");
//   const text = document.getElementById("statusText");
//   dot.className = "status-dot";

//   switch (status) {
//     case "listening":
//       dot.classList.add("listening");
//       text.textContent = "Listening";
//       break;
//     case "speaking":
//       dot.classList.add("speaking");
//       text.textContent = "Speaking";
//       break;
//     default:
//       text.textContent = "Ready";
//   }
// }

// // ===================== EXPORT FUNCTIONS TO WINDOW ===================== //
// window.startCooking = startCooking;
// window.requestMicPermission = requestMicPermission;
// window.closePermissionModal = closePermissionModal;
// window.confirmMicPermission = confirmMicPermission;
// window.stopVoiceControl = stopVoiceControl;
// window.nextStep = nextStep;
// window.previousStep = previousStep;
// window.repeatStep = repeatStep;
// window.showTip = showTip;

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
    speak("Before we begin, let me make sure you have all the ingredients.");
    readIngredientsAloud();
  } else {
    speak("You are already cooking!");
  }
}

// ===================== INGREDIENT CONFIRM POPUP ===================== //
function readIngredientsAloud() {
  if (!currentRecipe) return;

  let ingredientsText =
    "Before we begin, let me make sure you have all the ingredients. ";
  currentRecipe.ingredients.forEach((ingredient, i) => {
    ingredientsText += `Item ${i + 1}: ${ingredient}. `;
  });
  ingredientsText +=
    "Please review the ingredients, then press confirm when you're ready to start cooking.";

  waitingForConfirmation = true;
  speak(ingredientsText);
  showIngredientConfirmPopup();
}

function showIngredientConfirmPopup() {
  const modal = document.createElement("div");
  modal.id = "ingredientConfirmModal";
  modal.className = "fade-modal";
  modal.innerHTML = `
    <div class="fade-modal-content">
      <h3>✅ Ingredients Reviewed</h3>
      <p>Click below to confirm and start Step 1.</p>
      <button class="btn-primary" id="confirmIngredientsBtn">Confirm</button>
    </div>
  `;
  document.body.appendChild(modal);

  requestAnimationFrame(() => modal.classList.add("active"));

  document
    .getElementById("confirmIngredientsBtn")
    .addEventListener("click", () => {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.remove();
        waitingForConfirmation = false;
        ingredientsConfirmed = true;
        speak("Great! Let's begin with step one.");
        readStep();
      }, 300);
    });
}

// ===================== VOICE RECOGNITION ===================== //
function checkVoiceSupport() {
  const supportDiv = document.getElementById("voiceSupport");
  if ("webkitSpeechRecognition" in window && "speechSynthesis" in window) {
    supportDiv.innerHTML =
      '<span style="color: #10b981;">✓ Voice Control Available</span>';
    initSpeechRecognition();
  } else {
    supportDiv.innerHTML =
      '<span style="color: #ef4444;">✗ Voice Control Not Supported</span>';
  }
}

function initSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0].transcript
      .toLowerCase()
      .trim();
    console.log("🎤 Voice command:", command);
    handleVoiceCommand(command);
  };

  recognition.onerror = (e) => console.error("Speech recognition error:", e.error);
}

function requestMicPermission() {
  if (!recognition) {
    alert("Voice control is not supported in this browser.");
    return;
  }
  if (!micPermissionGranted) {
    document.getElementById("permissionModal").classList.add("active");
  } else {
    startVoiceControl();
  }
}

function confirmMicPermission() {
  micPermissionGranted = true;
  document.getElementById("permissionModal").classList.remove("active");
  startVoiceControl();
}

function startVoiceControl() {
  if (!recognition) return;
  document.getElementById("voiceModal").classList.add("active");
  document.querySelector(".container").classList.add("listening-active");
  recognition.start();
}

function stopVoiceControl() {
  if (recognition) recognition.stop();
  document.getElementById("voiceModal").classList.remove("active");
  document.querySelector(".container").classList.remove("listening-active");
}

// ===================== VOICE COMMAND HANDLING ===================== //
function handleVoiceCommand(command) {
  // Normalize the input
  command = command.toLowerCase().trim();

  // 1️⃣ Voice "start" command before cooking begins
  if (!cookingSessionStarted && (command.includes("start cooking") || command === "start")) {
    cookingSessionStarted = true;
    speak("Before we begin, let me make sure you have all the ingredients.");
    readIngredientsAloud();
    return;
  }

  // 2️⃣ Voice "confirm" while ingredient popup is visible
  if (command.includes("confirm")) {
    const modal = document.getElementById("ingredientConfirmModal");
    if (modal) {
      // Close modal and start step 1
      modal.classList.remove("active");
      setTimeout(() => {
        modal.remove();
        waitingForConfirmation = false;
        ingredientsConfirmed = true;
        speak("Great! Let's begin with step one.");
        readStep();
      }, 300);
      return;
    }
  }

  // 3️⃣ Require confirmation before continuing
  if (!ingredientsConfirmed) {
    speak("Please confirm your ingredients first.");
    return;
  }

  // 4️⃣ Step navigation and actions
  if (command.includes("next")) {
    nextStep();
    return;
  }

  if (command.includes("previous") || command.includes("back")) {
    previousStep();
    return;
  }

  if (command.includes("repeat") || command.includes("again")) {
    repeatStep();
    return;
  }

  // 💡 Voice “Tip” or “Hint”
  if (command.includes("tip") || command.includes("hint")) {
    console.log("🗣️ Tip command detected");
    showTip(true);
    return;
  }

  // 🛑 Voice “Stop” to end session
  if (command.includes("stop")) {
    stopVoiceControl();
    return;
  }

  // 🧠 Default fallback
  speak("Sorry, I didn't catch that. Try saying next, repeat, or tip.");
}


// ===================== SPEECH SYNTHESIS ===================== //
function speak(text) {
  if (isSpeaking) window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.onstart = () => {
    isSpeaking = true;
    if (recognition) recognition.stop();
  };
  utter.onend = () => {
    isSpeaking = false;
    if (micPermissionGranted && recognition)
      setTimeout(() => recognition.start(), 400);
  };
  window.speechSynthesis.speak(utter);
}

// ===================== STEPS CONTROL ===================== //
function readStep() {
  if (currentStep < currentRecipe.steps.length) {
    const step = currentRecipe.steps[currentStep];
    updateStepDisplay(step);
    speak(`Step ${currentStep + 1}: ${step.instruction}`);
  } else {
    showCompletionMessage();
  }
}

function nextStep() {
  if (currentStep < currentRecipe.steps.length - 1) {
    currentStep++;
    readStep();
  } else {
    showCompletionMessage();
  }
}

function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    readStep();
  } else {
    speak("You are already at the first step.");
  }
}

function repeatStep() {
  readStep();
}

function showTip(forceSpeak = false) {
  if (!currentRecipe || !currentRecipe.steps[currentStep]) {
    speak("There is no tip available right now.");
    return;
  }

  const tip = currentRecipe.steps[currentStep].tip;

  // Update on-screen UI
  const tipSection = document.getElementById("tipSection");
  const tipContent = document.getElementById("tipContent");
  if (tipSection && tipContent) {
    tipContent.textContent = tip;
    tipSection.classList.remove("hidden");
  }

  // Always speak the tip aloud
  speak(`Here's a tip: ${tip}`);

  // Restart recognition safely after speech ends
  if (micPermissionGranted && recognition) {
    setTimeout(() => {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition restart skipped:", err);
      }
    }, 1500); // give it enough breathing room
  }
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

function showCompletionMessage() {
  const stepDisplay = document.getElementById("stepDisplay");
  stepDisplay.innerHTML = `
    <div class="completion-message">
      <div class="completion-icon">🎉</div>
      <h2>Congratulations!</h2>
      <p>You completed ${currentRecipe.title}. Enjoy your meal!</p>
    </div>
  `;
  speak(
    "Congratulations, you completed the cooking instruction. Enjoy your meal!"
  );
}

// ===================== GLOBAL EXPORT ===================== //
window.startCooking = startCooking;
window.requestMicPermission = requestMicPermission;
window.confirmMicPermission = confirmMicPermission;
window.stopVoiceControl = stopVoiceControl;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.repeatStep = repeatStep;
window.showTip = showTip;