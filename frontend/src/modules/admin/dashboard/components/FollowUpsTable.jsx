import React from 'react';
import { MoreVertical } from 'lucide-react';

const FollowUpsTable = ({ isDarkMode }) => {
    const followUps = [
        {
            name: 'KUNAL CHAUHAN',
            number: '9978145629',
            type: 'Balance Due',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'Follow up for balance payment of Rs. 4000 due on 31-01-2026 against invoice number V10FL/2025-26/554.'
        },
        {
            name: 'Riya patel',
            number: '9099031248',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 14-02-2026.'
        },
        {
            name: 'satish badgujar',
            number: '8488800551',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 14-02-2026.'
        },
        {
            name: 'KRISHNA PRAJAPATI',
            number: '9726540860',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 13-02-2026.'
        },
        {
            name: 'SHASTHA MUDOLIAR',
            number: '9712244420',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 13-02-2026.'
        }
    ];

    return (
        <div className="w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className={`text-[13px] font-bold border-b transition-none ${isDarkMode ? 'border-white/5 text-gray-400' : 'border-gray-100 text-black'}`}>
                        <th className="px-6 py-4">Name & Number</th>
                        <th className="px-6 py-4">Follow Up Type</th>
                        <th className="px-6 py-4">Follow Up Date & Time</th>
                        <th className="px-6 py-4">Convertibility Status</th>
                        <th className="px-6 py-4">Comment</th>
                        <th className="px-6 py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className={`text-[13px] transition-none ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                    {followUps.map((item, idx) => (
                        <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                            <td className="px-6 py-6 transition-none">
                                <div className="flex flex-col gap-0.5 transition-none">
                                    <span className="text-blue-500 font-bold hover:underline cursor-pointer">{item.name}</span>
                                    <span className="text-blue-400 font-medium">{item.number}</span>
                                </div>
                            </td>
                            <td className={`px-6 py-6 font-medium transition-none ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{item.type}</td>
                            <td className={`px-6 py-6 font-medium transition-none ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{item.dateTime}</td>
                            <td className="px-6 py-6 transition-none">
                                <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight shadow-md">
                                    {item.status}
                                </span>
                            </td>
                            <td className={`px-6 py-6 text-[12px] font-medium max-w-sm leading-relaxed transition-none ${isDarkMode ? 'text-gray-400' : 'text-black opacity-80'}`}>
                                {item.comment}
                            </td>
                            <td className="px-6 py-6 text-right transition-none">
                                <button className={`p-1 transition-none ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}>
                                    <MoreVertical size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FollowUpsTable;
