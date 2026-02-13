import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Printer, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
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
        email: 'info@v10fitness.com',
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
                            email: gymData.email || 'info@v10fitness.com',
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
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Hide non-printable elements */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Reset margins */
                    @page {
                        margin: 5mm;
                        size: A4;
                    }
                    
                    /* Ensure proper sizing and compact layout */
                    #invoice-print-area {
                        max-width: 100%;
                        margin: 0;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    
                    /* Reduce spacing for print */
                    .print-compact-gap {
                        gap: 1rem !important;
                    }

                    .print-no-padding {
                        padding: 0 !important;
                    }
                    
                    .print-text-sm {
                        font-size: 10px !important;
                        line-height: 1.2 !important;
                    }
                    
                    .print-text-md {
                        font-size: 12px !important;
                    }
                    
                    .print-text-lg {
                        font-size: 16px !important;
                    }

                    .print-header-gap {
                        margin-bottom: 10px !important;
                    }
                    
                    .w-32 {
                         width: 80px !important;
                         height: auto !important;
                    }

                    /* Tables */
                    th, td {
                        padding: 6px 8px !important;
                        border: 1px solid #e5e7eb !important;
                    }
                    
                    /* Colors */
                    * {
                        color: #000 !important;
                        background: white !important;
                        border-color: #e5e7eb !important;
                    }
                    
                    .text-orange-500, .bg-orange-500, .border-orange-500 {
                        color: #f97316 !important;
                        border-color: #f97316 !important;
                    }
                    
                    .bg-orange-500 {
                         background-color: #f97316 !important;
                         color: white !important;
                    }

                    .bg-gray-50 {
                        background-color: #f9fafb !important;
                    }
                    
                    /* Shadows */
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
                        Download / Print
                    </button>
                </div>

                {/* Invoice Main Card - Printable Area */}
                <div id="invoice-print-area" ref={printRef} className={`relative max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-2xl overflow-hidden text-gray-900 ${isDarkMode ? 'dark:bg-white text-gray-900' : ''}`}>

                    {/* Top Brand Bar */}
                    <div className="bg-[#f97316] h-3 w-full"></div>

                    <div className="p-8 md:p-12 flex flex-col h-full justify-between">

                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-12 print-header-gap">
                            <div className="flex gap-4">
                                {gymInfo.logo ? (
                                    <img src={gymInfo.logo} alt="Logo" className="w-24 h-24 object-contain" />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-center p-2">
                                        <div>
                                            <p className="font-black text-xl leading-none">V-10</p>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Fitness</p>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1 mt-1">
                                    <h2 className="text-2xl font-black tracking-tight uppercase text-gray-900">{gymInfo.name}</h2>
                                    <div className="text-[12px] font-medium text-gray-600 max-w-[200px] leading-relaxed">
                                        {gymInfo.address}
                                    </div>
                                    <div className="flex items-center gap-3 text-[12px] font-medium text-gray-600 pt-1">
                                        <div className="flex items-center gap-1">
                                            <Phone size={12} className="text-[#f97316]" />
                                            <span>{gymInfo.contactNumber}</span>
                                        </div>
                                        {gymInfo.email && (
                                            <div className="flex items-center gap-1">
                                                <Mail size={12} className="text-[#f97316]" />
                                                <span>{gymInfo.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <h1 className="text-5xl font-black text-gray-100 tracking-tighter uppercase mb-2" style={{ color: '#e5e7eb' }}>INVOICE</h1>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-600">Invoice No: <span className="text-black ml-2 font-black text-lg">#{invoiceData.invoiceNumber}</span></p>
                                    <p className="text-sm font-bold text-gray-600">Date: <span className="text-black ml-2">{new Date(invoiceData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase rounded-full mt-2">Paid</div>
                                </div>
                            </div>
                        </div>

                        {/* Client Info Section */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 print-no-padding print-compact-gap">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#f97316] mb-4 border-b border-gray-200 pb-2">Bill To</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-lg font-bold text-gray-900 mb-1">{invoiceData.memberId?.firstName} {invoiceData.memberId?.lastName}</p>
                                    <p className="text-sm text-gray-600 mb-1 font-medium">{invoiceData.memberId?.address || 'No address provided'}</p>
                                    <p className="text-sm text-gray-600 font-medium">{invoiceData.memberId?.mobile}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Member ID</p>
                                    <p className="text-base font-black text-gray-900 mb-3">{invoiceData.memberId?.memberId}</p>

                                    <p className="text-sm text-gray-500 font-medium mb-1">Payment Method</p>
                                    <p className="text-base font-black text-gray-900">{invoiceData.paymentMode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8 flex-1">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-3 px-4 text-xs font-black uppercase text-gray-600 border-y border-gray-200">Description</th>
                                        <th className="py-3 px-4 text-xs font-black uppercase text-gray-600 border-y border-gray-200">Date Range</th>
                                        <th className="py-3 px-4 text-xs font-black uppercase text-gray-600 border-y border-gray-200 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-4 px-4 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-900">{invoiceData.description || (relatedSub ? relatedSub.packageName : 'Membership Fee')}</p>
                                            <p className="text-xs text-gray-500 mt-1">{invoiceData.type} - {relatedSub ? `${relatedSub.duration || '--'} ${relatedSub.durationType || 'Months'}` : ''}</p>
                                        </td>
                                        <td className="py-4 px-4 border-b border-gray-100 text-sm font-medium text-gray-600">
                                            {relatedSub ? (
                                                <div className="flex flex-col">
                                                    <span>Start: {new Date(relatedSub.startDate).toLocaleDateString('en-GB')}</span>
                                                    <span>End: {new Date(relatedSub.endDate).toLocaleDateString('en-GB')}</span>
                                                </div>
                                            ) : '--'}
                                        </td>
                                        <td className="py-4 px-4 border-b border-gray-100 text-right text-sm font-bold text-gray-900">
                                            ₹{invoiceData.subTotal?.toFixed(2) || invoiceData.amount?.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Financials & Footer */}
                        <div>
                            <div className="flex justify-end mb-12">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{invoiceData.subTotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                                        <span>Discount</span>
                                        <span>- ₹{invoiceData.discountAmount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                                        <span>Tax</span>
                                        <span>+ ₹{invoiceData.taxAmount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="border-t-2 border-gray-900 pt-3 flex justify-between items-center mt-2">
                                        <span className="text-base font-black uppercase text-gray-900">Total</span>
                                        <span className="text-xl font-black text-[#f97316]">₹{((invoiceData.subTotal || 0) + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 font-medium pt-1">
                                        <span>Paid Amount</span>
                                        <span className="text-green-600 font-bold">₹{invoiceData.amount?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                                        <span>Balance Due</span>
                                        <span className="text-red-500 font-bold">₹{Math.max(0, ((invoiceData.subTotal || 0) + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0)) - (invoiceData.amount || 0)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 print-compact-gap">
                                <div>
                                    <h4 className="text-xs font-black uppercase text-gray-400 mb-2">Terms & Conditions</h4>
                                    <ul className="text-[10px] text-gray-500 space-y-1 list-disc pl-3">
                                        <li>Fees are non-refundable and non-transferable.</li>
                                        <li>Retain this invoice for future reference.</li>
                                        <li>Subject to gym policies and rules.</li>
                                    </ul>
                                </div>
                                <div className="flex flex-col items-end justify-end space-y-8">
                                    <div className="w-32 border-b border-gray-300"></div>
                                    <p className="text-xs font-bold uppercase text-gray-400">Authorized Signature</p>
                                </div>
                            </div>

                            <div className="text-center mt-12 pt-6 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Thank you for your business!
                            </div>
                        </div>
                    </div>

                    {/* Bottom Brand Bar */}
                    <div className="bg-gray-900 h-2 w-full"></div>
                </div>
            </div>
        </>
    );
};

export default InvoiceDetail;
