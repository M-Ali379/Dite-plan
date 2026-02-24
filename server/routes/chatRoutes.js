const express = require('express');
const router = express.Router();

// POST /api/chat
router.post('/chat', async (req, res) => {
    try {
        const { message, dietPlan } = req.body;

        // Log to console so we can verify the request works
        console.log("------------------------");
        console.log("Chat Request Received:");
        console.log("Message:", message);
        console.log("Diet Plan Attached:", dietPlan ? 'Yes' : 'No');
        console.log("------------------------");

        // Simulated AI logic
        let reply = "I'm not sure I understand. Try asking about your protein, calories, or specific meals in your plan!";
        const lowerMessage = message.toLowerCase();

        if (!dietPlan || !dietPlan.meals) {
            reply = "I don't see a generated diet plan yet. Please fill out the form above to generate one first!";
        } else if (lowerMessage.includes('protein')) {
            const totalProtein = dietPlan.meals.reduce((sum, meal) => sum + meal.macros.protein, 0);
            reply = `Your current plan provides a total of ${totalProtein}g of protein. This looks great for muscle recovery and satiety!`;
        } else if (lowerMessage.includes('calorie') || lowerMessage.includes('calories')) {
            reply = `Your plan is designed around ${dietPlan.totalCalories} calories to help you reach your goals sustainably.`;
        } else if (lowerMessage.includes('breakfast') || lowerMessage.includes('morning')) {
            const breakfast = dietPlan.meals.find(m => m.type === 'Breakfast');
            reply = breakfast ? `For breakfast, you're having ${breakfast.name}, which is a solid morning kickstart.` : "Hmm, I don't see a breakfast in this plan.";
        } else if (lowerMessage.includes('dinner') || lowerMessage.includes('night')) {
            const dinner = dietPlan.meals.find(m => m.type === 'Dinner');
            reply = dinner ? `Dinner is ${dinner.name}. Very nutritious!` : "I can't find a dinner meal in your plan.";
        } else if (lowerMessage.includes('lunch')) {
            const lunch = dietPlan.meals.find(m => m.type === 'Lunch');
            reply = lunch ? `Your lunch will be ${lunch.name}. A perfect midday refuel.` : "Lunch seems to be missing.";
        } else if (lowerMessage.includes('change') || lowerMessage.includes('swap') || lowerMessage.includes('don\'t like')) {
            reply = "You can generate a new plan by changing the preferences in the form above and clicking 'Generate Plan' again.";
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.includes('hey')) {
            reply = "Hello! I'm here to help you analyze your new meal plan. What would you like to know?";
        } else if (lowerMessage.includes('goal') || lowerMessage.includes('weight')) {
            reply = "This plan is custom-tailored to help you achieve your goals through balanced macros and healthy ingredients.";
        } else {
            // Generic fallback that actually references the plan
            const randomMeal = dietPlan.meals[Math.floor(Math.random() * dietPlan.meals.length)];
            reply = `I'm analyzing your meals... The ${randomMeal.name} looks particularly delicious! Is there anything specific you want to know about it?`;
        }

        res.json({ reply });
    } catch (error) {
        console.error("Chat API error:", error);
        res.status(500).json({ error: "Failed to generate AI response." });
    }
});

module.exports = router;
