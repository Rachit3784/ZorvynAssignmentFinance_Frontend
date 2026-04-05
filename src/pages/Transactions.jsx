import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, X } from 'lucide-react';

const Transactions = () => {
    const { user } = useAuth();
    const canManageNode = user?.role === 'admin' || user?.role === 'analyst';
    
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ description: '', amount: '', type: 'expense', category: 'Others' });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [searchTerm, filterCategory, filterType]);

    const fetchTransactions = async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterCategory) params.category = filterCategory;
            if (filterType) params.type = filterType;

            const { data } = await api.get('/transactions', { params });
            setTransactions(data.transactions);
        } catch (error) {
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            toast.success('Transaction deleted');
            fetchTransactions();
        } catch (error) {
            toast.error('Failed to delete transaction');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/transactions', {
                ...formData,
                amount: Number(formData.amount)
            });
            toast.success('Transaction created');
            setIsModalOpen(false);
            setFormData({ description: '', amount: '', type: 'expense', category: 'Others' });
            fetchTransactions();
        } catch (error) {
            toast.error('Failed to create transaction');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
                
                {canManageNode && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-brand-500/25 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Transaction
                    </button>
                )}
            </div>

            <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search transactions..."
                        className="w-full bg-dark-900 border border-dark-800 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select 
                    className="bg-dark-900 border border-dark-800 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-500 text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select 
                    className="bg-dark-900 border border-dark-800 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-500 text-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Salary">Salary</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transport">Transport</option>
                    <option value="Others">Others</option>
                </select>
                
                {(searchTerm || filterType || filterCategory) && (
                    <button 
                        onClick={() => {
                            setSearchTerm(''); setFilterType(''); setFilterCategory('');
                        }}
                        className="text-gray-400 flex items-center gap-1 hover:text-white text-sm"
                    >
                        <X size={16}/> Clear Filters
                    </button>
                )}
            </div>

            <div className="glass-panel flex-1 rounded-2xl overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex-1 flex justify-center items-center text-gray-400">
                        No transactions found.
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900 border-b border-dark-800 text-sm font-semibold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    {user?.role === 'admin' && <th className="px-6 py-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-dark-800 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-200">{tx.description}</div>
                                            <div className="text-xs text-gray-500">{tx.userId?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-dark-950 border border-dark-800">
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(tx._id)}
                                                    className="text-rose-500 hover:text-rose-400 text-sm font-medium px-2 py-1 bg-rose-500/10 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && canManageNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Add Transaction</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <input required type="text" className="w-full bg-dark-900 border border-dark-800 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                                    <input required type="number" min="0" step="0.01" className="w-full bg-dark-900 border border-dark-800 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-500" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                    <select className="w-full bg-dark-900 border border-dark-800 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select className="w-full bg-dark-900 border border-dark-800 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    {['Transport', 'Food', 'Salary', 'Rent', 'Utilities', 'Entertainment', 'Others'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <button disabled={submitLoading} type="submit" className="w-full mt-4 bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50">
                                {submitLoading ? 'Saving...' : 'Save Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
