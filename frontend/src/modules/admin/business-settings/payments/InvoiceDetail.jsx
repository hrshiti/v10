import React, { useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';

const InvoiceDetail = () => {
    const { isDarkMode } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get('id') || '834212';

    // Simulated data lookup based on ID
    const invoices = {
        '834212': {
            id: '834212',
            billNo: 'V10FL/2024-2025/480',
            paymentType: 'Balance Payment',
            invoiceDate: '23-03-2025',
            status: 'PAID',
            billTo: { name: 'GIRDHAR BHAI', clientId: '--', phone: '9081815118' },
            plans: [{ id: '761552', name: 'GYM WORKOUT', duration: '12 Months', sessions: '360', startDate: '19-02-2025', endDate: '18-02-26', amount: '9000.00' }],
            logs: [
                { id: '834212', receiptNo: 'V10FL / 2024-2025/ 480', amount: '3000.00', paid: '3000.00', mode: 'Google Pay', date: '21-03-2025', receivedBy: 'Admin' },
                { id: '811774', receiptNo: 'V10FL/2024-2025/1', amount: '4000.00', paid: '4000.00', mode: 'Cash', date: '21-02-2025', receivedBy: 'Admin' }
            ],
            summary: {
                subTotal: '7000.00',
                discount: '0.00',
                surcharge: '0.00',
                payable: '3000.00',
            }
        },
        '811774': {
            id: '811774',
            billNo: 'V10FL/2024-2025/1',
            paymentType: 'Fresh Payment',
            invoiceDate: '21-02-2025',
            status: 'BALANCE PAID',
            billTo: { name: 'GIRDHAR BHAI', clientId: '--', phone: '9081815118' },
            plans: [{ id: '761552', name: 'GYM WORKOUT', duration: '12 Months', sessions: '360', startDate: '19-02-2025', endDate: '18-02-26', amount: '9000.00' }],
            logs: [
                { id: '811774', receiptNo: 'V10FL/2024-2025/1', amount: '4000.00', paid: '4000.00', mode: 'Cash', date: '21-02-2025', receivedBy: 'Admin' }
            ],
            summary: {
                selectedPlansTotal: '9000.00',
                subTotal: '7000.00',
                discount: '2000.00',
                surcharge: '0.00',
                payable: '4000.00',
                balanceAmount: '3000.00',
                balanceDueDate: '06-03-2025'
            }
        }
    };

    const invoiceData = invoices[invoiceId] || invoices['834212'];
    const isBalancePaid = invoiceData.status === 'BALANCE PAID';

    return (
        <div className={`space-y-6 animate-in fade-in duration-500 pb-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight">Invoice Report</h1>
                </div>
                <button className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                    <Printer size={18} />
                    Generate & Print Invoice
                </button>
            </div>

            {/* Invoice Main Card */}
            <div className={`relative max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                {/* Diagonal Stripe Header */}
                <div className="h-4 w-full bg-[#f97316]" style={{
                    backgroundImage: 'linear-gradient(45deg, #f97316 25%, #fdba74 25%, #fdba74 50%, #f97316 50%, #f97316 75%, #fdba74 75%, #fdba74 100%)',
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="p-8 md:p-12 space-y-12">
                    {/* Top Row: Logo and Bill Info */}
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="space-y-4">
                            <div className={`w-24 h-24 rounded-lg flex items-center justify-center p-2 border ${isDarkMode ? 'bg-white border-transparent' : 'bg-white border-gray-100'}`}>
                                <div className="text-center">
                                    <p className="text-[12px] font-black leading-tight text-black">V-10</p>
                                    <p className="text-[10px] font-black leading-tight text-black">FITNESS LAB</p>
                                </div>
                            </div>
                            <div className="text-[13px] space-y-1 font-medium">
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}><span className="font-bold">Invoice ID :</span> {invoiceData.billNo}</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}><span className="font-bold">Invoice Date :</span> {invoiceData.invoiceDate}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className={`text-4xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Invoice</h2>
                            <p className="text-[13px] font-bold text-gray-500 mt-2">Bill No: {invoiceData.billNo}</p>
                            <p className="text-[13px] font-bold text-gray-500">Payment Type: {invoiceData.paymentType}</p>
                        </div>
                    </div>

                    {/* Billing Info Row */}
                    <div className="flex flex-col md:flex-row justify-between gap-8 py-8 border-y border-dashed dark:border-white/10 border-gray-200">
                        <div className="space-y-3">
                            <h3 className="text-[#f97316] font-black uppercase text-sm">Bill From</h3>
                            <div className="space-y-1">
                                <p className="text-lg font-black uppercase">V-10 Fitness Lab</p>
                                <p className={`max-w-[300px] text-[13px] leading-relaxed font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    1st Floor, Rajshree Skyz Near Baroda Express Highway, CTM, Ahmedabad Gujarat 380026
                                </p>
                                <p className="text-[13px] font-black">8347008511</p>
                            </div>
                        </div>

                        <div className="md:text-right space-y-3">
                            <h3 className="text-[#f97316] font-black uppercase text-sm">Bill To</h3>
                            <div className="space-y-1">
                                <p className="text-lg font-black uppercase">{invoiceData.billTo.name}</p>
                                <p className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Client ID: {invoiceData.billTo.clientId}</p>
                                <p className="text-[13px] font-black">{invoiceData.billTo.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Plans Table */}
                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-xl overflow-hidden border dark:border-white/5 border-gray-100">
                                <thead>
                                    <tr className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Plan Name</th>
                                        <th className="px-6 py-4">Duration</th>
                                        <th className="px-6 py-4">Sessions</th>
                                        <th className="px-6 py-4">Start Date</th>
                                        <th className="px-6 py-4">End Date</th>
                                        <th className="px-6 py-4 text-right">Plan Amount</th>
                                    </tr>
                                </thead>
                                <tbody className={`text-[13px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {invoiceData.plans.map((plan, i) => (
                                        <tr key={i} className="border-b dark:border-white/5 border-gray-50">
                                            <td className="px-6 py-5">{plan.id}</td>
                                            <td className="px-6 py-5 text-[#f97316]">{plan.name}</td>
                                            <td className="px-6 py-5">{plan.duration}</td>
                                            <td className="px-6 py-5">{plan.sessions}</td>
                                            <td className="px-6 py-5">{plan.startDate}</td>
                                            <td className="px-6 py-5">{plan.endDate}</td>
                                            <td className="px-6 py-5 text-right whitespace-nowrap">₹{plan.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Log Section */}
                    <div className="space-y-6">
                        <h4 className={`text-[13px] font-black uppercase tracking-widest pb-2 border-b-2 w-fit ${isDarkMode ? 'text-gray-200 border-white/10' : 'text-gray-800 border-gray-100'}`}>Payment log</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse border dark:border-white/5 border-gray-100 rounded-xl overflow-hidden">
                                <thead>
                                    <tr className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Invoice/ Receipt No</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Amount Paid</th>
                                        <th className="px-6 py-4">Payment Mode</th>
                                        <th className="px-6 py-4">Payment Date</th>
                                        <th className="px-6 py-4 text-right">Received by</th>
                                    </tr>
                                </thead>
                                <tbody className={`text-[13px] font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {invoiceData.logs.map((log, i) => (
                                        <tr key={i} className="border-b dark:border-white/5 border-gray-50">
                                            <td className="px-6 py-5 text-[#f97316] font-black">{i + 1}</td>
                                            <td className="px-6 py-5">{log.receiptNo}</td>
                                            <td className="px-6 py-5">₹{log.amount}</td>
                                            <td className="px-6 py-5">₹{log.paid}</td>
                                            <td className="px-6 py-5 font-bold">{log.mode}</td>
                                            <td className="px-6 py-5">{log.date}</td>
                                            <td className="px-6 py-5 text-right">{log.receivedBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals and Footer Row */}
                    <div className="flex flex-col md:flex-row justify-between gap-12 pt-8">
                        {/* Summary Column - Left Side */}
                        <div className="flex-1 max-w-sm space-y-3">
                            {isBalancePaid && (
                                <div className={`flex justify-between items-center text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span>Selected Plans Total:</span>
                                    <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{invoiceData.summary.selectedPlansTotal}</span>
                                </div>
                            )}
                            <div className={`flex justify-between items-center text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>Sub Total :</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{invoiceData.summary.subTotal}</span>
                            </div>
                            <div className={`flex justify-between items-center text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>Discount :</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{invoiceData.summary.discount}</span>
                            </div>
                            <div className={`flex justify-between items-center text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>Surcharge(%) :</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{invoiceData.summary.surcharge}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t dark:border-white/10 border-gray-100">
                                <span className="text-lg font-black uppercase text-[#f97316]">Payable Amount :</span>
                                <span className="text-xl font-black">₹{invoiceData.summary.payable}</span>
                            </div>
                        </div>

                        {/* Middle/Right: Balance Info (matching Image 2) */}
                        {isBalancePaid && (
                            <div className="flex-1 flex flex-col items-center justify-start space-y-4 pt-2">
                                <div className="text-[14px] font-black uppercase tracking-tight text-gray-700">
                                    Balance Due Date :<span className="ml-2">{invoiceData.summary.balanceDueDate}</span>
                                </div>
                                <div className="bg-[#e7f9ee] border border-[#22c55e]/20 rounded-xl px-12 py-6 text-center shadow-sm">
                                    <p className="text-[#22c55e] text-sm font-black uppercase tracking-wider mb-1">Balance Amount :</p>
                                    <p className="text-[#22c55e] text-4xl font-black">₹{invoiceData.summary.balanceAmount}</p>
                                </div>
                            </div>
                        )}

                        {/* Right Section: Signatures / Terms (If not showing balance box, this takes precedence) */}
                        {!isBalancePaid && (
                            <div className="flex-1 space-y-12">
                                <div className="space-y-4">
                                    <h4 className="text-[14px] font-black uppercase text-[#f97316]">Comments</h4>
                                    <div className={`h-12 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Terms & Signs (Always at bottom) */}
                    <div className="pt-8 space-y-12">
                        {isBalancePaid && (
                            <div className="space-y-4">
                                <h4 className="text-[14px] font-black uppercase text-[#f97316]">Comments</h4>
                                <div className={`h-12 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}></div>
                            </div>
                        )}
                        <div className="space-y-8">
                            <h4 className="text-[14px] font-black uppercase text-[#f97316]">Terms & conditions</h4>
                            <div className="flex flex-col md:flex-row justify-between gap-8 pt-8 px-4">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-black uppercase tracking-tight">Authorized by: <span className="text-[#f97316]">Abdulla Pathan</span></p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member signature: <span className="text-black dark:text-gray-700 ml-2">............................</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Decor Stripe */}
                <div className="h-2 w-full bg-gray-50 dark:bg-white/5"></div>
            </div>
        </div>
    );
};

export default InvoiceDetail;
