
import React, { useState, useEffect } from 'react';
import { Transaction, Dealer } from '../types';

interface Props {
  onSave: (data: {
    dealerId: string;
    date: string;
    chickenCount: number;
    weightKg: number;
    pricePerKg: number;
    isPaid: boolean;
    note?: string;
  }) => void;
  onCancel: () => void;
  transaction?: Transaction;
  dealers: Dealer[];
  onAddDealer: (name: string) => void;
}

const TransactionForm: React.FC<Props> = ({ onSave, onCancel, transaction, dealers, onAddDealer }) => {
  const [formData, setFormData] = useState({
    dealerId: transaction?.dealerId || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    chickenCount: transaction?.chickenCount || 0,
    weightKg: transaction?.weightKg || 0,
    pricePerKg: transaction?.pricePerKg || 0,
    isPaid: transaction?.isPaid || false,
    note: transaction?.note || ''
  });

  const [total, setTotal] = useState(0);
  const [newDealerName, setNewDealerName] = useState('');
  const [showAddDealer, setShowAddDealer] = useState(false);

  useEffect(() => {
    setTotal(formData.weightKg * formData.pricePerKg);
  }, [formData.weightKg, formData.pricePerKg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.weightKg <= 0 || formData.pricePerKg <= 0) {
      alert("Please enter valid weight and price.");
      return;
    }
    onSave(formData);
  };

  return (
  
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
    <div className="bg-emerald-600 p-3 sm:p-5 text-white">
      <h2 className="text-lg sm:text-xl font-bold">{transaction ? 'Edit Delivery' : 'New Delivery'}</h2>
      <p className="opacity-80 text-xs">{transaction ? 'Update chicken delivery details' : 'Enter chicken delivery details for the dealer'}</p>
    </div>
    
    <form onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-3">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Dealer Name</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              required
              className="flex-1 w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.dealerId}
              onChange={e => setFormData({...formData, dealerId: e.target.value})}
            >
              <option value="">Select Dealer</option>
              {dealers.map(dealer => (
                <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddDealer(!showAddDealer)}
              className="w-full sm:w-auto px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          {showAddDealer && (
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="New dealer name"
                value={newDealerName}
                onChange={e => setNewDealerName(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (newDealerName.trim()) {
                      onAddDealer(newDealerName.trim());
                      setNewDealerName('');
                      setShowAddDealer(false);
                    }
                  }}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-xs font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDealer(false)}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-all text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input 
              required
              type="date" 
              className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chicken Count</label>
            <input 
              required
              type="number" 
              min="0"
              className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.chickenCount || ''}
              onChange={e => setFormData({...formData, chickenCount: Number(e.target.value)})}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Weight (kg)</label>
            <input 
              required
              type="number" 
              step="0.01"
              min="0"
              className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.weightKg || ''}
              onChange={e => setFormData({...formData, weightKg: Number(e.target.value)})}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Price per kg (LKR)</label>
            <input 
              required
              type="number" 
              min="0"
              className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.pricePerKg || ''}
              onChange={e => setFormData({...formData, pricePerKg: Number(e.target.value)})}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
          <textarea
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
            rows={2}
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="bg-slate-50 p-3 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Estimated Total</p>
            <p className="text-xl font-black text-emerald-700">LKR {total.toLocaleString()}</p>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
              checked={formData.isPaid}
              onChange={e => setFormData({...formData, isPaid: e.target.checked})}
            />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">Already Paid?</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-2 px-4 text-sm rounded-lg border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 py-2 px-6 text-sm rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
          >
            {transaction ? 'Update Record' : 'Add Record'}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>




  );
};

export default TransactionForm;
