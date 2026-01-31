import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const data = [
    { name: 'Jan', revenue: 4000, members: 240 },
    { name: 'Feb', revenue: 3000, members: 139 },
    { name: 'Mar', revenue: 2000, members: 980 },
    { name: 'Apr', revenue: 2780, members: 390 },
    { name: 'May', revenue: 1890, members: 480 },
    { name: 'Jun', revenue: 2390, members: 380 },
    { name: 'Jul', revenue: 3490, members: 430 },
];

const pieData = [
    { name: 'Active', value: 400 },
    { name: 'Expired', value: 300 },
    { name: 'Inactive', value: 300 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const Charts = ({ isDarkMode }) => {
    const chartTextColor = isDarkMode ? '#6B7280' : '#94A3B8';
    const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 shadow-2xl ${isDarkMode ? 'bg-[#1e1e1e] border-white/5 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-100/50'
                }`}>
                <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fiscal Trajectory</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRevenueCharts" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDarkMode ? 0.2 : 0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" vertical={false} stroke={chartGridColor} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10, fontWeight: '800' }} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10, fontWeight: '800' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase'
                                }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenueCharts)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 shadow-2xl ${isDarkMode ? 'bg-[#1e1e1e] border-white/5 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-100/50'
                }`}>
                <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Membership Vitality</h3>
                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                fill="#8884d8"
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;
