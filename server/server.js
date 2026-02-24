const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const DietPlan = require('./models/DietPlan');
const mealsDataset = require('./data/meals');

const app = express();
app.use(cors());
app.use(express.json());

const chatRoutes = require('./routes/chatRoutes');
app.use('/api', chatRoutes);

// Helper function to find a matching meal
const findMeal = (type, dietType, caloriesBudget) => {
    // 1. Try to find meal matching type, diet, and calorie budget
    let match = mealsDataset.find(meal =>
        meal.type === type &&
        (meal.dietType === dietType || meal.dietType === 'Any') &&
        meal.calories <= caloriesBudget
    );

    // 2. If not found, try to find meal matching type and diet (ignore budget)
    if (!match) {
        match = mealsDataset.find(meal =>
            meal.type === type &&
            (meal.dietType === dietType || meal.dietType === 'Any')
        );
    }

    return match || null;
};

app.post('/api/generate-diet', async (req, res) => {
    try {
        const { name, goal, dietType, targetCalories } = req.body;

        // 1. Create User
        const user = new User({ name, goal, dietType, targetCalories });
        await user.save();

        // 2. Simplistic Algorithm to generate meal plan
        // Divide calories roughly: 25% Breakfast, 35% Lunch, 30% Dinner, 10% Snack
        const breakfast = findMeal('Breakfast', dietType, targetCalories * 0.25);
        const lunch = findMeal('Lunch', dietType, targetCalories * 0.35);
        const dinner = findMeal('Dinner', dietType, targetCalories * 0.30);
        const snack = findMeal('Snack', dietType, targetCalories * 0.10);

        const generatedMeals = [breakfast, lunch, dinner, snack].filter(Boolean);
        const totalCals = generatedMeals.reduce((sum, meal) => sum + meal.calories, 0);

        // 3. Save Diet Plan
        const dietPlan = new DietPlan({
            userId: user._id,
            meals: generatedMeals,
            totalCalories: totalCals
        });
        await dietPlan.save();

        res.json({
            user,
            dietPlan
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate diet plan' });
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/diet-planner';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
