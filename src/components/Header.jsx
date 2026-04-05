import React from 'react';
import { useAuth } from '../context/AuthContext';
import RoleBadge from './RoleBadge';

const Header = () => {
    const { user } = useAuth();
    
    if (!user) return null;

    return (
        <header className="h-20 bg-dark-950/80 backdrop-blur-md border-b border-dark-800 sticky top-0 z-10 px-8 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">
                    Welcome back, {user.name}
                </h2>
                <p className="text-sm text-gray-400">Here's what's happening with your finances today.</p>
            </div>
            
            <div className="flex items-center gap-4">
                <RoleBadge role={user.role} />
                <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-lg border border-brand-500/30">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
};

export default Header;
