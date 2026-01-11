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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Dealer Management</h2>
          <p className="opacity-80 text-sm">Manage your dealer database</p>
        </div>

        <div className="p-6">
          {/* Add New Dealer */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Add New Dealer</h3>
            <div className="flex space-x-3">
              <input
                type="text"
                className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Dealer name"
                value={newDealerName}
                onChange={e => setNewDealerName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddDealer()}
              />
              <button
                onClick={handleAddDealer}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
              >
                <i className="fas fa-plus mr-2"></i>Add
              </button>
            </div>
          </div>

          {/* Dealers List */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Current Dealers ({dealers.length})</h3>
            <div className="max-h-96 overflow-y-auto">
              {dealers.length > 0 ? (
                <div className="space-y-2">
                  {dealers.map((dealer, index) => (
                    <div key={dealer.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {dealer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{dealer.name}</div>
                          <div className="text-xs text-slate-500">
                            Added {new Date(dealer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-slate-400 font-mono">
                          #{(index + 1).toString().padStart(2, '0')}
                        </div>
                        <button
                          onClick={() => openEditModal(dealer)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <i className="fas fa-edit text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <i className="fas fa-users text-4xl mb-4"></i>
                  <p className="font-medium">No dealers added yet</p>
                  <p className="text-sm">Add your first dealer above</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit Dealer Modal */}
      {showEditModal && editingDealer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Edit Dealer</h2>
              <p className="opacity-80 text-sm">Update dealer information</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Dealer Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Enter dealer name"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
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