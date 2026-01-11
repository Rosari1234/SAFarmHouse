
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, BusinessStats, AppState, FilterType } from './types';
import { db } from './services/db';
import { getAIInsights } from './services/geminiService';
import StatsCards from './components/StatsCards';
import TransactionForm from './components/TransactionForm';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    transactions: [],
    isLoading: true,
    filters: {
      search: '',
      status: 'all',
      startDate: '',
      endDate: ''
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  // Initial Sync with MongoDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const loaded = await db.getTransactions();
        setState(prev => ({ ...prev, transactions: loaded, isLoading: false }));
      } catch (error) {
        console.error("MongoDB Sync Failed:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    loadData();
  }, []);

  const stats = useMemo((): BusinessStats => {
    return state.transactions.reduce((acc, t) => {
      acc.totalWeight += t.weightKg;
      acc.totalRevenue += t.totalAmount;
      acc.totalChickens += t.chickenCount;
      if (t.isPaid) acc.paidAmount += t.totalAmount;
      else acc.pendingAmount += t.totalAmount;
      acc.transactionCount++;
      return acc;
    }, {
      totalWeight: 0,
      totalRevenue: 0,
      totalChickens: 0,
      pendingAmount: 0,
      paidAmount: 0,
      transactionCount: 0
    });
  }, [state.transactions]);

  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(t => {
      const matchesSearch = t.dealerName.toLowerCase().includes(state.filters.search.toLowerCase());
      const matchesStatus = state.filters.status === 'all' || 
                           (state.filters.status === 'paid' && t.isPaid) || 
                           (state.filters.status === 'unpaid' && !t.isPaid);
      const matchesDate = (!state.filters.startDate || t.date >= state.filters.startDate) &&
                         (!state.filters.endDate || t.date <= state.filters.endDate);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [state.transactions, state.filters]);

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>) => {
    setIsActionLoading('adding');
    try {
      const newTx = await db.saveTransaction(data);
      setState(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
      setShowForm(false);
    } catch (error) {
      alert("Error saving to MongoDB. Verify your network and credentials.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const togglePaid = async (id: string, current: boolean) => {
    setIsActionLoading(id);
    try {
      const updated = await db.updatePaymentStatus(id, !current);
      setState(prev => ({ ...prev, transactions: updated }));
    } catch (error) {
      alert("Failed to update payment status in database.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const deleteTx = async (id: string) => {
    if (confirm("Permanently delete this record from MongoDB?")) {
      setIsActionLoading(id);
      try {
        const updated = await db.deleteTransaction(id);
        setState(prev => ({ ...prev, transactions: updated }));
      } catch (error) {
        alert("Failed to delete record.");
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const fetchAIAnalysis = async () => {
    setIsAiLoading(true);
    const result = await getAIInsights(state.transactions);
    setAiInsight(result);
    setIsAiLoading(false);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-black text-2xl tracking-tight">Syncing with MongoDB</p>
          <p className="text-slate-400 font-medium mt-1">Establishing secure connection to your farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-200 rotate-3">
              <i className="fas fa-kiwi-bird -rotate-3"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">SA Farmshop</h1>
              <div className="flex items-center mt-1 space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MongoDB Atlas v3.1</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-2xl shadow-slate-300 flex items-center space-x-3 active:scale-95"
          >
            <i className="fas fa-plus-circle text-lg"></i>
            <span>Register Batch</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StatsCards stats={stats} />

        {/* AI Insight Hero 
        
         <div className="mb-12 group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-slate-800 overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <i className="fas fa-brain text-[12rem] -rotate-12"></i>
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-start space-x-8">
                  <div className="bg-emerald-500/20 p-5 rounded-3xl border border-emerald-500/30">
                    <i className="fas fa-wand-magic-sparkles text-4xl text-emerald-400"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3">Cloud AI Analytics</h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                      {aiInsight || "Your farm records are securely hosted on MongoDB. Analyze them now to detect payment risks and track dealer growth."}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={fetchAIAnalysis}
                  disabled={isAiLoading || state.transactions.length === 0}
                  className="bg-emerald-500 text-slate-900 px-12 py-5 rounded-[2rem] font-black hover:bg-emerald-400 transition-all disabled:opacity-30 whitespace-nowrap shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  {isAiLoading ? (
                    <><i className="fas fa-circle-notch fa-spin mr-3"></i>Analyzing MongoDB...</>
                  ) : (
                    <><i className="fas fa-microchip mr-3"></i>Generate Insight</>
                  )}
                </button>
             </div>
          </div>
        </div>
        */}
       

        {/* Inventory Management Table */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          {/* Advanced Filtering Toolbar */}
          <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-8 bg-slate-50/40">
            <div className="flex-1 relative group">
              <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors text-lg"></i>
              <input 
                type="text" 
                placeholder="Search dealer database by name..." 
                className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] border-2 border-slate-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all text-sm font-black placeholder:text-slate-300 bg-white shadow-sm"
                value={state.filters.search}
                onChange={e => setState(prev => ({ ...prev, filters: { ...prev.filters, search: e.target.value }}))}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center bg-white border-2 border-slate-100 rounded-[1.5rem] p-2 pr-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mr-4">
                  <i className="fas fa-sliders text-lg"></i>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Filter Status</div>
                  <select 
                    className="outline-none bg-transparent text-sm font-black text-slate-800 cursor-pointer pr-4"
                    value={state.filters.status}
                    onChange={e => setState(prev => ({ ...prev, filters: { ...prev.filters, status: e.target.value as FilterType }}))}
                  >
                    <option value="all">Full Ledger</option>
                    <option value="paid">Verified Paid</option>
                    <option value="unpaid">Due Payments</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white border-2 border-slate-100 p-2 rounded-[1.5rem] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <i className="fas fa-calendar-check text-lg"></i>
                </div>
                <div className="flex items-center space-x-3 px-2">
                  <input 
                    type="date" 
                    className="bg-transparent text-xs font-black outline-none text-slate-800 cursor-pointer"
                    value={state.filters.startDate}
                    onChange={e => setState(prev => ({ ...prev, filters: { ...prev.filters, startDate: e.target.value }}))}
                  />
                  <div className="w-4 h-[2px] bg-slate-200"></div>
                  <input 
                    type="date" 
                    className="bg-transparent text-xs font-black outline-none text-slate-800 cursor-pointer"
                    value={state.filters.endDate}
                    onChange={e => setState(prev => ({ ...prev, filters: { ...prev.filters, endDate: e.target.value }}))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100">
                  <th className="px-10 py-7 text-left">Timeline</th>
                  <th className="px-10 py-7 text-left">Dealer / Unit Price</th>
                  <th className="px-10 py-7 text-center">Batch Count</th>
                  <th className="px-10 py-7 text-right">Net Weight</th>
                  <th className="px-10 py-7 text-right">Total Payable</th>
                  <th className="px-10 py-7 text-center">Verification</th>
                  <th className="px-10 py-7 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                  <tr key={tx.id} className={`group transition-all ${isActionLoading === tx.id ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-emerald-50/30'}`}>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-900">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Batch ID: {tx.id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                          {tx.dealerName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xl tracking-tight group-hover:text-emerald-700 transition-colors">{tx.dealerName}</div>
                          <div className="text-xs text-emerald-600/60 font-black mt-0.5 tracking-tight uppercase">LKR {tx.pricePerKg.toLocaleString()} / kg</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex flex-col items-center justify-center min-w-[3rem] h-12 rounded-2xl bg-slate-50 text-slate-800 font-black">
                        <span className="text-base leading-none">{tx.chickenCount}</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-40 mt-1">units</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="text-xl font-black text-slate-900">{tx.weightKg.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Kilograms</div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="text-2xl font-black text-slate-900 tracking-tighter">LKR {tx.totalAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight italic">Secure Sync</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => togglePaid(tx.id, tx.isPaid)}
                          className={`group relative flex items-center space-x-3 px-6 py-3 rounded-[1.25rem] text-[11px] font-black transition-all border-2 shadow-sm active:scale-95 ${
                            tx.isPaid 
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-100' 
                              : 'bg-white text-rose-500 border-rose-100 hover:border-rose-300 hover:bg-rose-50'
                          }`}
                        >
                          {tx.isPaid ? (
                            <>
                              <i className="fas fa-circle-check text-sm animate-bounce-slow"></i>
                              <span>VERIFIED PAID</span>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-clock-rotate-left text-sm"></i>
                              <span>MARK AS PAID</span>
                            </>
                          )}
                          {!tx.isPaid && (
                             <span className="absolute -top-1 -right-1 flex h-4 w-4">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                             </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => deleteTx(tx.id)}
                          className="w-14 h-14 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-[1.25rem] transition-all active:scale-90"
                        >
                          <i className="fas fa-trash-can text-xl"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-10 py-40 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                          <i className="fas fa-cloud-upload text-4xl text-slate-200"></i>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">MongoDB Ledger Empty</h4>
                        <p className="text-slate-400 font-medium text-lg px-8">No records found matching your filters. Register a new chicken delivery batch to begin cloud tracking.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showForm && (
        <TransactionForm 
          onSave={handleAddTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Persistence Status Footer */}
      <footer className="py-24 border-t border-slate-200/60 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="flex items-center space-x-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
               <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Primary Cluster: Healthy</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
               <i className="fas fa-shield-halved text-emerald-600 text-sm"></i>
               <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">SSL Encryption: Active</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-slate-900 mb-4 opacity-80">
            <i className="fas fa-kiwi-bird text-2xl text-emerald-600"></i>
            <span className="font-black tracking-tighter text-2xl">FarmTrack Manager</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-center">Live Chicken Inventory & Sales Intelligence</p>
          
          <div className="h-[1px] w-full max-w-lg bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-10"></div>
          
          <div className="text-slate-300 text-[10px] font-bold text-center leading-loose">
            &copy; {new Date().getFullYear()} Farm Management Ecosystems. Proprietary Software License.<br/>
            Connected to MongoDB Atlas: lakshan@mycluster.ptkz1tc.mongodb.net
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
