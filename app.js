let model;
const aiStatus = document.getElementById('ai-status');
const previewImg = document.getElementById('preview');

// 1. Load the AI model with UI feedback
async function loadAI() {
    console.log("Loading AI...");
    if (aiStatus) aiStatus.innerHTML = "<span class='pulse'>🤖 Initializing AI Scanner...</span>";
    
    try {
        model = await mobilenet.load();
        console.log("AI Model Loaded!");
        if (aiStatus) aiStatus.innerHTML = "✅ AI Scanner Ready. Upload a photo to begin.";
    } catch (error) {
        console.error("AI Loading Failed:", error);
        if (aiStatus) aiStatus.innerText = "❌ Error: AI Model failed to load.";
    }
}

// 2. The Unique "Waste Classifier" Logic
async function classifyWaste() {
    if (!model) {
        alert("AI is still loading. Please wait a moment.");
        return;
    }

    if (!previewImg || !previewImg.src) {
        alert("Please upload or take a photo first!");
        return;
    }

    aiStatus.innerHTML = "<span class='pulse'>🔍 AI is analyzing waste type...</span>";

    // Perform the prediction
    const predictions = await model.classify(previewImg);
    
    // Get the top prediction
    const topResult = predictions[0].className.toLowerCase();
    const probability = Math.round(predictions[0].probability * 100);

    // 3. Custom Categorization Logic for your project
    let category = "General Waste";
    if (topResult.includes("bottle") || topResult.includes("plastic") || topResult.includes("container")) {
        category = "♻️ Plastic / Recyclable";
    } else if (topResult.includes("paper") || topResult.includes("cardboard") || topResult.includes("box")) {
        category = "📦 Paper / Cardboard";
    } else if (topResult.includes("keyboard") || topResult.includes("screen") || topResult.includes("phone") || topResult.includes("wire")) {
        category = "🔌 E-Waste (Priority)";
    } else if (topResult.includes("fruit") || topResult.includes("vegetable") || topResult.includes("food")) {
        category = "🍎 Organic / Biodegradable";
    }

    // Display the result in your UI
    aiStatus.innerHTML = `
        <strong>AI Detection:</strong> ${topResult} (${probability}%)<br>
        <strong>Category Suggestion:</strong> ${category}
    `;
    
    // Automatically select the category in your HTML dropdown (if it exists)
    const categorySelect = document.getElementById('waste-category');
    if (categorySelect) categorySelect.value = category.split(' ')[1].toLowerCase(); 
}

// Initialize on page start
loadAI();
