let model;

// Step 1: Load the AI model when the page starts
async function loadAI() {
    console.log("Loading AI...");
    model = await mobilenet.load();
    console.log("AI Model Loaded Successfully!");
    alert("AI Waste Scanner is ready to use!");
}

loadAI();
