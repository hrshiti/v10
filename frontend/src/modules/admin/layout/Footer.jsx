import React from 'react';

const Footer = ({ isDarkMode }) => {
    return (
        <footer className={`transition-all duration-300 border-t py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 text-gray-500' : 'bg-white border-gray-100 text-gray-400'}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} <span className="text-orange-500">TITAN</span> Gym Management System.
            </div>
            <div className="flex items-center gap-6">
                <span className="text-[9px] font-bold uppercase tracking-widest hover:text-orange-500 transition-colors cursor-pointer">Support</span>
                <span className="text-[9px] font-bold uppercase tracking-widest hover:text-orange-500 transition-colors cursor-pointer">Privacy Policy</span>
                <div className={`h-1 w-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                <span className="text-[10px] font-black tracking-tighter">v.1.0.4-BETA</span>
            </div>
        </footer>
    );
};

export default Footer;
