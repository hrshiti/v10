import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from 'recharts';
import { User, Flame, ThermometerSun, Snowflake, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const DashboardCharts = ({ isDarkMode }) => {
    const [timePeriod, setTimePeriod] = useState('This year');
    const [leadData, setLeadData] = useState([]);
    const [memberTrendData, setMemberTrendData] = useState([]);
    const [financialData, setFinancialData] = useState([]);
    const [summaryStats, setSummaryStats] = useState({ revenue: 0, pending: 0, expenses: 0, profit: 0 });

    // Theme-aware colors
    const chartTextColor = isDarkMode ? '#6B7280' : '#94A3B8';
    const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

    useEffect(() => {
        const fetchCharts = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;

                // Fetch Chart Data
                const res = await fetch(`${API_BASE_URL}/api/admin/dashboard/charts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                setLeadData(data.leadTypes || []);
                setMemberTrendData(data.memberTrendData || []);
                setFinancialData(data.financialData || []);

                // Calculate Totals from Chart Data where possible
                const rev = (data.financialData || []).reduce((acc, curr) => acc + (curr.revenue || 0), 0);
                const exp = (data.financialData || []).reduce((acc, curr) => acc + (curr.expenses || 0), 0);

                // Fetch Global Stats for accurate 'Pending' (Accounts Receivable)
                const statsRes = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();

                setSummaryStats({
                    revenue: rev,
                    expenses: exp,
                    profit: rev - exp,
                    pending: statsData.financial?.pendingPayment || 0
                });

            } catch (error) {
                console.error('Error fetching dashboard charts:', error);
            }
        };
        fetchCharts();
    }, []);

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Top Row: Lead Types & Members Counting */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lead Types - Donut Chart */}
                <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#1e1e1e] border-white/5 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-100/50'
                    }`}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lead Distribution</h3>
                        </div>
                        <div className="relative group">
                            <select
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                                className={`appearance-none rounded-xl px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <option>This year</option>
                                <option>Last year</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none group-focus-within:text-orange-500" />
                        </div>
                    </div>

                    <div className="relative h-64 mb-8 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={leadData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={95}
                                    paddingAngle={2}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {leadData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {leadData.reduce((acc, curr) => acc + curr.value, 0)}
                            </div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Total</div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        {leadData.map((lead, idx) => (
                            <div key={idx} className="flex items-center justify-between group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full shadow-lg shadow-${lead.color}/20`} style={{ backgroundColor: lead.color }}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>{lead.name}</span>
                                </div>
                                <span className={`text-xs font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{lead.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Members Trend - Bar Chart */}
                <div className={`lg:col-span-2 p-8 rounded-[2.5rem] border transition-all duration-300 shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#1e1e1e] border-white/5 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-100/50'
                    }`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Membership Velocity</h3>
                        <div className="flex flex-wrap gap-5 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span>Active</span>
                            </div>
                            <div className="flex items-center gap-2 text-rose-500">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                <span>Inactive</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-500">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span>Renewal</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={memberTrendData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={0.5}>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke={chartGridColor} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTextColor, fontSize: 10, fontWeight: '800' }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTextColor, fontSize: 10, fontWeight: '800' }}
                                />
                                <Tooltip
                                    cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                                        borderColor: 'transparent',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        padding: '12px 16px'
                                    }}
                                />
                                <Bar dataKey="active" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={28} />
                                <Bar dataKey="inactive" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} barSize={28} />
                                <Bar dataKey="upcoming" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Financial Analytics - Area Chart */}
            <div className={`p-10 rounded-[3rem] border transition-all duration-300 shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#1e1e1e] border-white/5 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-100/50'
                }`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fiscal Intelligence</h3>
                        <p className={`text-xl font-black tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Revenue vs Expenditure Matrix</p>
                    </div>
                    <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-2.5 group cursor-default">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform shadow-lg shadow-emerald-400/20"></div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Net Profit</span>
                        </div>
                        <div className="flex items-center gap-2.5 group cursor-default">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-400 group-hover:scale-125 transition-transform shadow-lg shadow-orange-400/20"></div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Debt Risk</span>
                        </div>
                    </div>
                </div>

                <div className="h-96 w-full mb-12">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financialData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={isDarkMode ? 0.2 : 0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={isDarkMode ? 0.15 : 0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" vertical={false} stroke={chartGridColor} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: chartTextColor, fontSize: 10, fontWeight: '800' }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: chartTextColor, fontSize: 10, fontWeight: '800' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                                    borderColor: 'transparent',
                                    borderRadius: '20px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    padding: '16px 20px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                animationDuration={2000}
                            />
                            <Area
                                type="monotone"
                                dataKey="pending"
                                stroke="#f97316"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorPending)"
                                animationDuration={2500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-10 border-t pt-10 transition-colors ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    {[
                        { label: 'Cumulative Revenue', value: `₹${summaryStats.revenue.toLocaleString('en-IN')}`, color: 'emerald' },
                        { label: 'Accounts Receivable', value: `₹${summaryStats.pending.toLocaleString('en-IN')}`, color: 'orange' },
                        { label: 'Operational Costs', value: `₹${summaryStats.expenses.toLocaleString('en-IN')}`, color: 'rose' },
                        { label: 'Total Earnings', value: `₹${summaryStats.profit.toLocaleString('en-IN')}`, color: 'indigo' }
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full shadow-lg transition-all group-hover:scale-150 ${stat.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-500/40' :
                                    stat.color === 'orange' ? 'bg-orange-500 shadow-orange-500/40' :
                                        stat.color === 'rose' ? 'bg-rose-500 shadow-rose-500/40' : 'bg-indigo-500 shadow-indigo-500/40'
                                    }`}></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                            </div>
                            <div className={`text-2xl font-black tracking-tighter transition-transform group-hover:scale-110 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
