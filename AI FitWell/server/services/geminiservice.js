const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateWithModel(model, message) {
    const response = await ai.models.generateContent({
        model: model,
        contents: message,
        config: {
            systemInstruction:
                "You are AI FitWell, a helpful fitness and wellness assistant. " +
                "Give practical and easy-to-understand guidance about workouts, " +
                "nutrition, hydration, sleep, stress management and healthy habits. " +
                "Do not diagnose medical conditions. For serious medical concerns, " +
                "recommend consulting a qualified healthcare professional."
        }
    });

    return response.text;
}

async function generateAIResponse(message) {

    try {
        // Try the latest Gemini model first
        return await generateWithModel(
            "gemini-3.8-flash",
            message
        );

    } catch (error) {

        console.error(
            "Gemini 3.8 Flash error:",
            error.message
        );

        // If Gemini 3.8 is temporarily unavailable,
        // use Gemini 3.7 Flash.
        if (error.status === 503) {

            console.log(
                "Gemini 3.8 is busy. Trying Gemini 3.7 Flash..."
            );

            return await generateWithModel(
                "gemini-3.7-flash",
                message
            );
        }

        throw error;
    }
}

module.exports = {
    generateAIResponse
};