import { useState } from 'react';
import axios from 'axios';
import { ChefHat, Target, Utensils, Zap, Loader2 } from 'lucide-react';
import MealCard from './components/MealCard';
import ChatBot from './components/ChatBot';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    goal: 'Weight Loss',
    dietType: 'Vegetarian',
    targetCalories: 2000
  });
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-diet', formData);
      setDietPlan(response.data.dietPlan);
    } catch (error) {
      console.error('Error generating diet:', error);
      alert('Failed to generate diet plan. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 pb-20">
      {/* Hero Section */}
      <header className="relative py-16 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-mint/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/2 bg-soft-orange/30 blur-[100px] rounded-full" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="bg-primary-green p-2 rounded-xl text-white">
              <ChefHat size={28} />
            </div>
            <span className="text-2xl font-black tracking-tight text-primary-green">NutriGen</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Your AI-Powered <br />
            <span className="text-primary-green">Personalized Diet</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg mb-10 max-w-2xl"
          >
            Enter your details below and our AI will generate a customized meal plan tailored to your fitness goals and dietary preferences.
          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl glass-card p-8 rounded-3xl"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="flex flex-col items-start gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Target size={16} /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-primary-green outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col items-start gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Utensils size={16} /> Diet Type
                </label>
                <select
                  className="w-full bg-white border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-primary-green outline-none transition-all"
                  value={formData.dietType}
                  onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                >
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Keto</option>
                  <option>High-Protein</option>
                </select>
              </div>

              <div className="flex flex-col items-start gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Zap size={16} /> Target Calories
                </label>
                <input
                  type="number"
                  step="100"
                  className="w-full bg-white border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-primary-green outline-none transition-all"
                  value={formData.targetCalories}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setFormData({ ...formData, targetCalories: parseInt(e.target.value) || 0 })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#2D5A27] hover:bg-[#1a3a1a] text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-green-100 w-full"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Generate Plan'}
              </button>
            </form>
          </motion.div>
        </div>
      </header>

      {/* Results Section */}
      <AnimatePresence>
        {dietPlan && (
          <section className="max-w-6xl mx-auto px-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <h2 className="text-3xl font-black">Daily Meal Plan</h2>
              <div className="bg-mint px-4 py-2 rounded-2xl font-bold text-primary-green">
                Total: {dietPlan.totalCalories} kcal
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {dietPlan.meals.map((meal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MealCard meal={meal} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </AnimatePresence>
      <ChatBot currentDietPlan={dietPlan} />
    </div>
  );
}

export default App;
