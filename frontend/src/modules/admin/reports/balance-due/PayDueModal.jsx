import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const PayDueModal = ({ isOpen, onClose, member, isDarkMode, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [commitmentDate, setCommitmentDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !member) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${API_BASE_URL}/api/admin/members/${member._id}/pay-due`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentMode,
                    commitmentDate: Number(amount) < member.dueAmount ? commitmentDate : null,
                    closedBy: adminInfo.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(data);
                onClose();
            } else {
                throw new Error(data.message || 'Payment failed');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'}`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10 bg-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pay Balance Due</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{member.firstName} {member.lastName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Due Summary */}
                    <div className={`p-4 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-blue-50'}`}>
                        <div>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`}>Total Outstanding</p>
                            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-blue-700'}`}>₹{member.dueAmount?.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            {member.commitmentDate && (
                                <div className="mb-1">
                                    <p className="text-[10px] font-bold text-orange-500 uppercase">Commitment Date</p>
                                    <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {new Date(member.commitmentDate).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            )}
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Package</p>
                            <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{member.packageName}</p>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment Amount*</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</div>
                            <input
                                type="number"
                                required
                                max={member.dueAmount}
                                min="1"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'}`}
                            />
                        </div>
                        <div className="flex justify-between px-1">
                            <button
                                type="button"
                                onClick={() => setAmount(member.dueAmount)}
                                className="text-[10px] font-black text-emerald-500 uppercase hover:underline"
                            >
                                Pay Full Due
                            </button>
                        </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="space-y-2">
                        <label className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Cash', 'Online', 'Card'].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setPaymentMode(mode)}
                                    className={`py-2 rounded-xl text-[11px] font-black uppercase transition-all border ${paymentMode === mode
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Commitment Date (Only for partial payment) */}
                    {amount && Number(amount) < member.dueAmount && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Next Payment Commitment*
                            </label>
                            <input
                                type="date"
                                required
                                value={commitmentDate}
                                onChange={(e) => setCommitmentDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-red-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-500'}`}
                            />
                            <p className="text-[10px] font-bold text-red-500 uppercase">Required for partial payment</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
                            <AlertCircle size={18} />
                            <p className="text-[11px] font-bold">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !amount}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest transition-all shadow-xl ${isLoading ? 'opacity-70 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95'}`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Record Payment
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PayDueModal;
