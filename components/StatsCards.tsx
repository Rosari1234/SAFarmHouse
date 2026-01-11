
import React from 'react';
import { BusinessStats } from '../types';

interface Props {
  stats: BusinessStats;
}

const StatsCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    { label: 'Total Weight', value: `${stats.totalWeight.toFixed(2)} kg`, icon: 'fa-weight-hanging', color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `LKR ${stats.totalRevenue.toLocaleString()}`, icon: 'fa-money-bill-wave', color: 'bg-emerald-500' },
    { label: 'Pending Payment', value: `LKR ${stats.pendingAmount.toLocaleString()}`, icon: 'fa-clock', color: 'bg-amber-500' },
    { label: 'Chickens Sold', value: stats.totalChickens.toString(), icon: 'fa-kiwi-bird', color: 'bg-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-opacity-20`}>
            <i className={`fas ${card.icon}`}></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="text-xl font-bold text-slate-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
