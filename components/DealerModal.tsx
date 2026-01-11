import React, { useState } from 'react';
import { Dealer } from '../types';

interface Props {
  dealers: Dealer[];
  onAddDealer: (name: string) => void;
  onUpdateDealer: (id: string, name: string) => void;
  onClose: () => void;
}

const DealerModal: React.FC<Props> = ({ dealers, onAddDealer, onUpdateDealer, onClose }) => {
  const [newDealerName, setNewDealerName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddDealer = () => {
    if (newDealerName.trim()) {
      onAddDealer(newDealerName.trim());
      setNewDealerName('');
    }
  };

  const openEditModal = (dealer: Dealer) => {
    setEditingDealer(dealer);
    setEditName(dealer.name);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDealer(null);
    setEditName('');
  };

  const saveEdit = () => {
    if (editingDealer && editName.trim()) {
      onUpdateDealer(editingDealer.id, editName.trim());
      closeEditModal();
    }
  };

  return (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[95vh] sm:max-h-none flex flex-col">
        <div className="bg-blue-600 p-4 sm:p-6 text-white flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold">Dealer Management</h2>
          <p className="opacity-80 text-xs sm:text-sm">Manage your dealer database</p>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Add New Dealer */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3">Add New Dealer</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                placeholder="Dealer name"
                value={newDealerName}
                onChange={e => setNewDealerName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddDealer()}
              />
              <button
                onClick={handleAddDealer}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all font-bold text-sm sm:text-base"
              >
                <i className="fas fa-plus mr-2"></i>Add
              </button>
            </div>
          </div>

          {/* Dealers List */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3">Current Dealers ({dealers.length})</h3>
            <div className="max-h-64 sm:max-h-96 overflow-y-auto">
              {dealers.length > 0 ? (
                <div className="space-y-2">
                  {dealers.map((dealer, index) => (
                    <div key={dealer.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm sm:text-base flex-shrink-0">
                          {dealer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-800 text-sm sm:text-base truncate">{dealer.name}</div>
                          <div className="text-[10px] sm:text-xs text-slate-500">
                            Added {new Date(dealer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="text-xs sm:text-sm text-slate-400 font-mono">
                          #{(index + 1).toString().padStart(2, '0')}
                        </div>
                        <button
                          onClick={() => openEditModal(dealer)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <i className="fas fa-edit text-xs sm:text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-slate-400">
                  <i className="fas fa-users text-3xl sm:text-4xl mb-3 sm:mb-4"></i>
                  <p className="font-medium text-sm sm:text-base">No dealers added yet</p>
                  <p className="text-xs sm:text-sm">Add your first dealer above</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all font-bold text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit Dealer Modal */}
      {showEditModal && editingDealer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold">Edit Dealer</h2>
              <p className="opacity-80 text-xs sm:text-sm">Update dealer information</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Dealer Name</label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Enter dealer name"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end space-x-2 sm:space-x-3">
              <button
                onClick={closeEditModal}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all font-bold text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all font-bold text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerModal;