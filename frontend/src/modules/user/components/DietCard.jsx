import React from 'react';
import { Plus } from 'lucide-react';

const DietCard = ({ title, icon: Icon, bgColor, iconColor, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer shadow-sm relative group`}
            style={{ backgroundColor: bgColor }}
        >
            <button className="absolute top-2 right-2 w-6 h-6 bg-white/60 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                <Plus size={14} />
            </button>

            <div
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
                style={{ color: iconColor }}
            >
                <Icon size={20} />
            </div>
            <h3 className="text-gray-600 font-bold text-sm capitalize">{title}</h3>
        </div>
    );
};

export default DietCard;
