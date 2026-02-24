import React from 'react';
import { Flame, Droplets, Wind } from 'lucide-react';

const MealCard = ({ meal }) => {
    return (
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="relative h-48 w-full">
                <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-primary-green">
                    {meal.type}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{meal.name}</h3>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">
                        <Flame size={14} />
                        <span className="font-semibold">{meal.calories} kcal</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-mint p-2 rounded-xl text-center">
                        <p className="text-[10px] text-gray-500 uppercase">Protein</p>
                        <p className="font-bold text-gray-800">{meal.macros.protein}g</p>
                    </div>
                    <div className="bg-soft-orange/20 p-2 rounded-xl text-center">
                        <p className="text-[10px] text-gray-500 uppercase">Carbs</p>
                        <p className="font-bold text-gray-800">{meal.macros.carbs}g</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-xl text-center">
                        <p className="text-[10px] text-gray-500 uppercase">Fat</p>
                        <p className="font-bold text-gray-800">{meal.macros.fat}g</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealCard;
