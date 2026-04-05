import React from 'react';

const RoleBadge = ({ role }) => {
    const colors = {
        admin: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        analyst: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        viewer: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${colors[role] || colors.viewer}`}>
            {role}
        </span>
    );
};

export default RoleBadge;
