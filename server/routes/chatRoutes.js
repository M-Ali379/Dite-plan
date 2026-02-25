const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper function to generate a local response based on keywords to save API quota
const generateLocalResponse = (message, dietPlan) => {
    if (!message || typeof message !== 'string') return null;
    const lowerMessage = message.toLowerCase().trim();

    // 1. Greetings
    if (['hi', 'hello', 'hey', 'start', 'greetings', 'sup'].includes(lowerMessage)) {
        return "Hello! I'm NutriGen AI. I'm here to safely guide you through your diet plan. What would you like to know about your meals or calories today?";
    }

    if (!dietPlan || !dietPlan.meals) return null;

    // 2. Calories
    if (lowerMessage.includes('calorie') || lowerMessage.includes('calories') || lowerMessage.includes('total calories')) {
        return `Your target total daily calories are ${dietPlan.totalCalories} kcal. Let me know if you want a breakdown for specific meals!`;
    }

    // 3. Specific Meals
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    for (const type of mealTypes) {
        if (lowerMessage.includes(type)) {
            const meal = dietPlan.meals.find(m => m.type.toLowerCase() === type);
            if (meal) {
                return `For ${type}, you have ${meal.name} which is ${meal.calories} calories (Macros: ${meal.macros.protein}g protein, ${meal.macros.carbs}g carbs, ${meal.macros.fat}g fat). Enjoy!`;
            } else {
                return `You don't seem to have a ${type} scheduled in your plan.`;
            }
        }
    }

    // 4. Protein / Macros
    if (lowerMessage.includes('protein') || lowerMessage.includes('carbs') || lowerMessage.includes('fat') || lowerMessage.includes('macro')) {
        let totalProtein = 0, totalCarbs = 0, totalFat = 0;
        dietPlan.meals.forEach(m => {
            if (m.macros) {
                totalProtein += m.macros.protein;
                totalCarbs += m.macros.carbs;
                totalFat += m.macros.fat;
            }
        });
        return `Your total daily macros are approximately ${totalProtein}g Protein, ${totalCarbs}g Carbs, and ${totalFat}g Fat across your ${dietPlan.meals.length} meals.`;
    }

    return null; // Return null if no local match, to fall back to Gemini
};

// POST /api/chat
router.post('/chat', async (req, res) => {
    try {
        const { message, dietPlan } = req.body;

        console.log("------------------------");
        console.log("Chat Request Received:", message);

        // 1. Try to generate a local response first to save API quota
        const localResponse = generateLocalResponse(message, dietPlan);
        if (localResponse) {
            console.log("Responded locally.");
            return res.json({ reply: localResponse });
        }

        // 2. If no local response and no API key, give friendly message
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ reply: "I'm running in offline mode right now without an API key. But I can still answer basic questions about your plan, like your calories, macros, or specific meals!" });
        }

        // 3. Fallback to Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
You are "NutriGen AI", a friendly, highly expert, and empathetic virtual nutritionist.
Your goal is to help the user understand and succeed with their generated diet plan.

Here is the user's specific diet plan in JSON format:
${JSON.stringify(dietPlan || {})}

IMPORTANT RULES FOR YOUR RESPONSE:
1. Be warm, encouraging, and highly specific to the provided diet plan.
2. If the user asks about a specific meal (e.g., breakfast or dinner), list the exact foods they are having.
3. If they ask about calories or macros, use the data in the JSON plan.
4. Keep your answer brief, conversational, and easy to read (max 2-3 short paragraphs).
5. Do NOT use markdown syntax like asterisks or bolding, just use plain text with natural spacing, as the chat widget might not parse markdown well.
6. Do not offer medical advice.

The user asks: "${message}"
Answer now:`;

        const result = await model.generateContent(prompt);
        let reply = result.response.text();

        res.json({ reply });
    } catch (error) {
        console.error("Chat API error:", error);

        // Handle specific Gemini API rate limits
        if (error.status === 429) {
            return res.status(200).json({ reply: "I'm receiving too many complex requests right now so my AI brain is a bit overwhelmed! I can still answer basic questions about your planned meals, calories, and macros instantly, though! Try asking me about those." });
        }

        res.status(500).json({ error: "Failed to generate AI response." });
    }
});

module.exports = router;
