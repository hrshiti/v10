import React from 'react';

const OverviewCard = ({ title, bgHeader, bgBody, col1Label, col1Value, col2Label, col2Value, isDarkMode }) => {
    return (
        <div className={`rounded-[2rem] overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-1 shadow-2xl ${isDarkMode
                ? 'bg-[#1e1e1e] border border-white/5 shadow-black/40'
                : 'shadow-black/5'
            }`}>
            <div className={`px-6 py-4 font-black text-[11px] uppercase tracking-widest border-b ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : `${bgHeader} text-white border-white/10`
                }`}>
                {title}
            </div>
            <div className={`p-6 flex-1 flex transition-colors duration-300 ${isDarkMode ? 'bg-transparent text-white' : `${bgBody} text-white`
                }`}>
                <div className={`w-1/2 pr-4 ${isDarkMode ? 'border-r border-white/5' : 'border-r border-white/20'}`}>
                    <div className="text-3xl font-black mb-1.5 tracking-tighter">{col1Value}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'opacity-80'}`}>{col1Label}</div>
                </div>
                <div className="w-1/2 pl-4">
                    <div className="text-2xl font-black mb-1.5 tracking-tighter">{col2Value}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'opacity-80'}`}>{col2Label}</div>
                </div>
            </div>
        </div>
    );
};

const OverviewCards = ({ isDarkMode }) => {
    const cards = [
        {
            title: 'Members',
            bgHeader: 'bg-blue-600',
            bgBody: 'bg-blue-500',
            col1Label: 'Active',
            col1Value: '416',
            col2Label: 'Upcoming',
            col2Value: '4'
        },
        {
            title: 'Follow Ups Overview',
            bgHeader: 'bg-orange-600',
            bgBody: 'bg-orange-500',
            col1Label: 'Total',
            col1Value: '21',
            col2Label: 'Done',
            col2Value: '0'
        },
        {
            title: 'Enquiry Overview',
            bgHeader: 'bg-teal-600',
            bgBody: 'bg-teal-500',
            col1Label: 'New Enquiries',
            col1Value: '0',
            col2Label: 'Sales',
            col2Value: '2'
        },
        {
            title: 'Attendance',
            secondTitle: 'Engagement',
            bgHeader: 'bg-amber-600',
            bgBody: 'bg-amber-500',
            dual: true,
            data: {
                left: { label: 'Attendance', value: '1', subLabel: 'Absent', subValue: '415' },
                right: { label: 'Birthday', value: '0', subLabel: 'Anniversary', subValue: '0' }
            }
        },
        {
            title: 'Total Sales',
            bgHeader: 'bg-emerald-600',
            bgBody: 'bg-emerald-500',
            col1Label: 'Number',
            col1Value: '1',
            col2Label: 'Amount',
            col2Value: '5500'
        },
        {
            title: 'Fresh Sales',
            secondTitle: 'Renewal',
            bgHeader: 'bg-indigo-600',
            bgBody: 'bg-indigo-500',
            dual: true,
            data: {
                left: { label: 'Number', value: '1', subLabel: 'Amount', subValue: '5500' },
                right: { label: 'Number', value: '0', subLabel: 'Amount', subValue: '0' }
            }
        },
        {
            title: 'Balance Payment',
            bgHeader: 'bg-lime-600',
            bgBody: 'bg-lime-500',
            col1Label: 'Paid',
            col1Value: '0',
            col2Label: 'Due',
            col2Value: '0'
        },
        {
            title: 'Fresh PT Sales',
            secondTitle: 'PT Renewal',
            bgHeader: 'bg-rose-600',
            bgBody: 'bg-rose-500',
            dual: true,
            data: {
                left: { label: 'Number', value: '0', subLabel: 'Amount', subValue: '0' },
                right: { label: 'Number', value: '0', subLabel: 'Amount', subValue: '0' }
            }
        }
    ];

    return (
        <div className="mb-12">
            <h3 className="text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest mb-6">Performance Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, index) => {
                    if (card.dual) {
                        return (
                            <div key={index} className={`rounded-[2rem] overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-1 shadow-2xl ${isDarkMode ? 'bg-[#1e1e1e] border border-white/5 shadow-black/40' : 'shadow-black/5'
                                }`}>
                                <div className={`flex text-[11px] font-black uppercase tracking-widest border-b ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'border-white/10'
                                    }`}>
                                    <div className={`w-1/2 px-5 py-3 border-r ${isDarkMode ? 'border-white/5' : `${card.bgHeader} text-white border-white/10`}`}>{card.title}</div>
                                    <div className={`w-1/2 px-5 py-3 ${isDarkMode ? '' : `${card.bgHeader} text-white`}`}>{card.secondTitle || ''}</div>
                                </div>
                                <div className={`p-6 flex-1 flex transition-colors duration-300 ${isDarkMode ? 'bg-transparent text-white' : `${card.bgBody} text-white`}`}>
                                    <div className={`w-1/2 border-r pr-4 ${isDarkMode ? 'border-white/5' : 'border-white/20'}`}>
                                        <div className="text-2xl font-black mb-1 tracking-tighter">{card.data.left.value}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-gray-500' : 'opacity-80'}`}>{card.data.left.label}</div>
                                        <div className="text-xl font-black mb-1 tracking-tight">{card.data.left.subValue}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'opacity-80'}`}>{card.data.left.subLabel}</div>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <div className="text-2xl font-black mb-1 tracking-tighter">{card.data.right.value}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-gray-500' : 'opacity-80'}`}>{card.data.right.label}</div>
                                        <div className="text-xl font-black mb-1 tracking-tight">{card.data.right.subValue}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'opacity-80'}`}>{card.data.right.subLabel}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return <OverviewCard key={index} {...card} isDarkMode={isDarkMode} />
                })}
            </div>
        </div>
    );
};

export default OverviewCards;
