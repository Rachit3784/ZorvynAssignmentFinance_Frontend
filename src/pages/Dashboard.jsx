import React, { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [summaryRes, recentRes] = await Promise.all([
                api.get('/dashboard/summary'),
                api.get('/dashboard/recent')
            ]);
            
            setSummary(summaryRes.data);
            setRecent(recentRes.data.transactions);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Income" value={summary.totalIncome} type="income" />
                <StatCard title="Total Expenses" value={summary.totalExpense} type="expense" />
                <StatCard title="Net Balance" value={summary.netBalance} type="balance" />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="glass-panel rounded-2xl overflow-hidden">
                    {recent.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No recent transactions found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-dark-900 border-b border-dark-800 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-800">
                                    {recent.map((tx) => (
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
