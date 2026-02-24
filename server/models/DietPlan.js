const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    type: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    macros: {
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true }
    },
    imageUrl: { type: String, required: true }
});

const dietPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meals: [mealSchema],
    totalCalories: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
