import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import RoleBadge from '../components/RoleBadge';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-full relative">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">System Users</h1>
            </div>

            <div className="glass-panel flex-1 rounded-2xl overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex-1 flex justify-center items-center text-gray-400">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {users.map((user) => (
                                <div key={user._id} className="bg-dark-900/50 border border-dark-800 rounded-xl p-5 hover:border-dark-700 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-500 border border-brand-500/30 flex items-center justify-center font-bold text-lg">
                                                {(user.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">{user.name || 'Unknown User'}</h3>
                                                <p className="text-sm text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-800">
                                        <div className="flex items-center gap-2">
                                            <RoleBadge role={user.role} />
                                            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 capitalize">
                                                {user.status}
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="text-rose-500 hover:text-white hover:bg-rose-500 text-sm font-medium px-3 py-1 bg-rose-500/10 rounded transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="mt-4 text-xs text-gray-500">
                                        Joined: {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
