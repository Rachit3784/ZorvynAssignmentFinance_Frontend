import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ReceiptText, 
    PieChart, 
    Users as UsersIcon, 
    LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    
    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['viewer', 'analyst', 'admin'] },
        { name: 'Transactions', path: '/transactions', icon: ReceiptText, roles: ['viewer', 'analyst', 'admin'] },
        { name: 'Analytics', path: '/analytics', icon: PieChart, roles: ['analyst', 'admin'] },
        { name: 'Users', path: '/users', icon: UsersIcon, roles: ['admin'] },
    ];

    return (
        <aside className="w-64 bg-dark-900 border-r border-dark-800 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-emerald-400 bg-clip-text text-transparent">
                    FinanceFlow
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 text-gray-400">
                {navItems.map((item) => {
                    if (!item.roles.includes(user.role)) return null;
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive 
                                    ? 'bg-brand-500/10 text-brand-500 font-medium' 
                                    : 'hover:bg-dark-800 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-dark-800">
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
