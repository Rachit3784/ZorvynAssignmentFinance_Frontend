import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, type, format = 'currency' }) => {
    const isIncome = type === 'income';
    const isExpense = type === 'expense';
    
    // Formatting helper
    const formattedValue = format === 'currency' 
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
        : value;

    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500" 
                 style={{ 
                    backgroundColor: isIncome ? '#10b981' : isExpense ? '#f43f5e' : '#6366f1' 
                 }}>
            </div>
            
            <p className="text-gray-400 font-medium text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-4">
                {formattedValue}
            </h3>
            
            {(isIncome || isExpense) && (
                <div className={`flex items-center gap-1 text-sm ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{isIncome ? 'Income' : 'Expense'}</span>
                </div>
            )}
            {!isIncome && !isExpense && (
                <div className="flex items-center gap-1 text-sm text-brand-400">
                    <TrendingUp size={16} />
                    <span>Net Balance</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
