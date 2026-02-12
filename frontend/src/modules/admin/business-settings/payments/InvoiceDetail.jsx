import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const InvoiceDetail = () => {
    const { isDarkMode } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get('id');
    const printRef = useRef();

    const [isLoading, setIsLoading] = useState(true);
    const [invoiceData, setInvoiceData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [gymInfo, setGymInfo] = useState({
        name: 'V-10 Fitness Lab',
        address: '1st Floor, Rajshree Skyz Near Baroda Express Highway, CTM, Ahmedabad Gujarat 380026',
        contactNumber: '8347008511',
        logo: ''
    });

    useEffect(() => {
        const fetchInvoiceData = async () => {
            if (!invoiceId) return;
            setIsLoading(true);
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const res = await fetch(`${API_BASE_URL}/api/admin/sales/invoice/${invoiceId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setInvoiceData(data);

                    // Fetch gym info
                    const gymRes = await fetch(`${API_BASE_URL}/api/admin/gym-details`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (gymRes.ok) {
                        const gymData = await gymRes.json();
                        setGymInfo({
                            name: gymData.name || 'V-10 Fitness Lab',
                            address: gymData.address || '1st Floor, Rajshree Skyz Near Baroda Express Highway, CTM, Ahmedabad Gujarat 380026',
                            contactNumber: gymData.contactNumber || '8347008511',
                            logo: gymData.logo ? (gymData.logo.startsWith('http') ? gymData.logo : `${API_BASE_URL}/uploads/${gymData.logo}`) : ''
                        });
                    }

                    // Fetch subscriptions for this member to show plan details
                    if (data.memberId?._id) {
                        const subRes = await fetch(`${API_BASE_URL}/api/admin/members/${data.memberId._id}/subscriptions`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (subRes.ok) {
                            const subData = await subRes.json();
                            setSubscriptions(subData);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching invoice:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoiceData();
    }, [invoiceId]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!invoiceData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <p className="text-gray-500 font-bold">Invoice not found</p>
                <button onClick={() => navigate(-1)} className="text-orange-500 font-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> Go Back
                </button>
            </div>
        );
    }

    // Try to find the subscription that matches this sale
    const relatedSub = subscriptions.length > 0 ? subscriptions[0] : null;

    return (
        <>
            {/* Print Styles */}
            <style>{`
                @media print {
                    /* Hide everything except the invoice */
                    body * {
                        visibility: hidden;
                    }
                    
                    #invoice-print-area,
                    #invoice-print-area * {
                        visibility: visible;
                    }
                    
                    #invoice-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                    }
                    
                    /* Hide non-printable elements */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Reset page margins */
                    @page {
                        margin: 0.5cm;
                        size: A4;
                    }
                    
                    /* Ensure proper sizing */
                    #invoice-print-area {
                        max-width: 100%;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    /* Force light theme for print */
                    * {
                        color: #000 !important;
                        background: white !important;
                        border-color: #e5e7eb !important;
                    }
                    
                    /* Keep specific colors */
                    .print-orange {
                        color: #f97316 !important;
                    }
                    
                    .print-emerald {
                        color: #10b981 !important;
                    }
                    
                    .print-red {
                        color: #ef4444 !important;
                    }
                    
                    .print-bg-orange {
                        background: #f97316 !important;
                    }
                    
                    .print-bg-gray {
                        background: #f9fafb !important;
                    }
                    
                    /* Ensure borders are visible */
                    table, th, td {
                        border: 1px solid #e5e7eb !important;
                    }
                    
                    /* Remove shadows in print */
                    * {
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }
                }
            `}</style>

            <div className={`space-y-6 animate-in fade-in duration-500 pb-10 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {/* Header Area - No Print */}
                <div className="flex items-center justify-between no-print">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight">Invoice Report</h1>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                    >
                        <Printer size={18} />
                        Generate & Print Invoice
                    </button>
                </div>

                {/* Invoice Main Card - Printable Area */}
                <div id="invoice-print-area" ref={printRef} className={`relative max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                    {/* Diagonal Stripe Header */}
                    <div className="h-4 w-full print-bg-orange" style={{
                        background: '#f97316',
                        backgroundImage: 'linear-gradient(45deg, #f97316 25%, #fdba74 25%, #fdba74 50%, #f97316 50%, #f97316 75%, #fdba74 75%, #fdba74 100%)',
                        backgroundSize: '40px 40px'
                    }}></div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Top Row: Logo and Bill Info */}
                        <div className="flex flex-col md:flex-row justify-between gap-8">
                            <div className="space-y-4">
                                <div className="w-24 h-24 rounded-lg flex items-center justify-center p-2 border bg-white border-gray-100 overflow-hidden">
                                    {gymInfo.logo ? (
                                        <img src={gymInfo.logo} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-[14px] font-black leading-tight text-black">V-10</p>
                                            <p className="text-[12px] font-black leading-tight text-black uppercase">Fitness Lab</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-[13px] space-y-1 font-medium">
                                    <p className="text-gray-500"><span className="font-bold">Invoice ID :</span> {invoiceData.invoiceNumber}</p>
                                    <p className="text-gray-500"><span className="font-bold">Invoice Date :</span> {new Date(invoiceData.date).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900">Invoice</h2>
                                <p className="text-[13px] font-bold text-gray-500 mt-2">Bill No: {invoiceData.invoiceNumber}</p>
                                <p className="text-[13px] font-bold text-gray-500">Payment Type: {invoiceData.type}</p>
                            </div>
                        </div>

                        {/* Billing Info Row */}
                        <div className="flex flex-col md:flex-row justify-between gap-8 py-8 border-y border-dashed border-gray-200">
                            <div className="space-y-3">
                                <h3 className="print-orange font-black uppercase text-sm" style={{ color: '#f97316' }}>Bill From</h3>
                                <div className="space-y-1">
                                    <p className="text-lg font-black uppercase text-gray-900">{gymInfo.name}</p>
                                    <p className="max-w-[300px] text-[13px] leading-relaxed font-bold text-gray-600">
                                        {gymInfo.address}
                                    </p>
                                    <p className="text-[13px] font-black text-gray-900">{gymInfo.contactNumber}</p>
                                </div>
                            </div>

                            <div className="md:text-right space-y-3">
                                <h3 className="print-orange font-black uppercase text-sm" style={{ color: '#f97316' }}>Bill To</h3>
                                <div className="space-y-1">
                                    <p className="text-lg font-black uppercase text-gray-900">{invoiceData.memberId?.firstName} {invoiceData.memberId?.lastName}</p>
                                    <p className="text-[13px] font-bold text-gray-600">Client ID: {invoiceData.memberId?.memberId || '--'}</p>
                                    <p className="text-[13px] font-black text-gray-900">{invoiceData.memberId?.mobile}</p>
                                </div>
                            </div>
                        </div>

                        {/* Plans Table */}
                        <div className="space-y-4">
                            <h4 className="text-[13px] font-black uppercase tracking-widest pb-2 border-b-2 w-fit text-gray-800 border-gray-100">Plan Details</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-gray-100">
                                    <thead>
                                        <tr className="text-[11px] font-black uppercase tracking-wider print-bg-gray text-gray-500" style={{ background: '#f9fafb' }}>
                                            <th className="px-6 py-4 border border-gray-100">Plan Name</th>
                                            <th className="px-6 py-4 border border-gray-100">Duration</th>
                                            <th className="px-6 py-4 border border-gray-100">Start Date</th>
                                            <th className="px-6 py-4 border border-gray-100">End Date</th>
                                            <th className="px-6 py-4 text-right border border-gray-100">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[13px] font-black text-gray-700">
                                        <tr className="border-b border-gray-50">
                                            <td className="px-6 py-5 print-orange border border-gray-100" style={{ color: '#f97316' }}>
                                                {invoiceData.description || (relatedSub ? relatedSub.packageName : 'Membership Fee')}
                                            </td>
                                            <td className="px-6 py-5 border border-gray-100">
                                                {relatedSub ? `${relatedSub.duration || relatedSub.packageId?.durationValue || '--'} ${relatedSub.durationType || relatedSub.packageId?.durationType || 'Months'}` : '--'}
                                            </td>
                                            <td className="px-6 py-5 border border-gray-100">{relatedSub ? new Date(relatedSub.startDate).toLocaleDateString('en-GB') : '--'}</td>
                                            <td className="px-6 py-5 border border-gray-100">{relatedSub ? new Date(relatedSub.endDate).toLocaleDateString('en-GB') : '--'}</td>
                                            <td className="px-6 py-5 text-right whitespace-nowrap border border-gray-100">₹{invoiceData.subTotal?.toFixed(2) || invoiceData.amount?.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="flex flex-col md:flex-row justify-between gap-12 pt-8">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-[14px] font-black uppercase print-orange" style={{ color: '#f97316' }}>Receipt Info</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-bold uppercase">Payment Mode</span>
                                        <span className="font-black print-orange" style={{ color: '#f97316' }}>{invoiceData.paymentMode}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-bold uppercase">Received By</span>
                                        <span className="font-black text-gray-900">{invoiceData.closedBy ? `${invoiceData.closedBy.firstName} ${invoiceData.closedBy.lastName}` : 'Admin'}</span>
                                    </div>
                                    {invoiceData.transactionId && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-bold uppercase">Transaction ID</span>
                                            <span className="font-black text-xs text-gray-900">{invoiceData.transactionId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 max-w-sm space-y-3">
                                <div className="flex justify-between items-center text-[14px] font-bold text-gray-600">
                                    <span>Sub Total :</span>
                                    <span className="text-black">₹{invoiceData.subTotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[14px] font-bold text-gray-600">
                                    <span>Discount :</span>
                                    <span className="text-black">₹{invoiceData.discountAmount?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[14px] font-bold text-gray-600">
                                    <span>Tax Amount :</span>
                                    <span className="text-black">₹{invoiceData.taxAmount?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-lg font-black uppercase print-orange" style={{ color: '#f97316' }}>Net Pay :</span>
                                    <span className="text-xl font-black text-gray-900">₹{((invoiceData.subTotal || 0) + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[14px] font-bold pt-2 text-gray-600">
                                    <span>Amount Paid :</span>
                                    <span className="print-emerald font-black" style={{ color: '#10b981' }}>₹{invoiceData.amount?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[14px] font-bold text-gray-600">
                                    <span>Balance Due :</span>
                                    <span className="print-red font-black" style={{ color: '#ef4444' }}>₹{Math.max(0, ((invoiceData.subTotal || 0) + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0)) - (invoiceData.amount || 0)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Terms & Signs */}
                        <div className="pt-8 space-y-12">
                            <div className="space-y-4">
                                <h4 className="text-[14px] font-black uppercase print-orange" style={{ color: '#f97316' }}>Comments</h4>
                                <p className="text-sm font-bold text-gray-600">
                                    {invoiceData.description || 'No additional comments.'}
                                </p>
                            </div>
                            <div className="space-y-8">
                                <h4 className="text-[14px] font-black uppercase print-orange" style={{ color: '#f97316' }}>Terms & conditions</h4>
                                <ul className="text-[11px] font-bold space-y-1 text-gray-400">
                                    <li>1. Fees once paid are non-refundable and non-transferable under any circumstances.</li>
                                    <li>2. Membership can be frozen for a maximum of 30 days with a valid reason.</li>
                                    <li>3. Management is not responsible for any loss of personal belongings.</li>
                                    <li>4. Please maintain discipline and follow gym rules at all times.</li>
                                </ul>
                                <div className="flex flex-col md:flex-row justify-between gap-8 pt-8 px-4">
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-black uppercase tracking-tight text-gray-900">Authorized by: <span className="print-orange" style={{ color: '#f97316' }}>Abdulla Pathan</span></p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[13px] font-black uppercase tracking-tight text-gray-500">Member signature: <span className="text-black ml-2">............................</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Decor Stripe */}
                    <div className="h-2 w-full bg-gray-50"></div>
                </div>
            </div>
        </>
    );
};

export default InvoiceDetail;
