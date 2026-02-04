import { API_BASE_URL } from '../../../../config/api';

const TransferMembership = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { id, memberName, memberId: mId, memberMobile, memberEmail, memberDOB, memberAnniversary, packageName: currentPkg, durationMonths: currentDur, startDate: currentStart, endDate: currentEnd, assignedTrainer: currentTrainer } = context || {};

    const [isLoading, setIsLoading] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTargetMember, setSelectedTargetMember] = useState(null);

    const [form, setForm] = useState({
        clientId: mId || '',
        mobile: memberMobile || '',
        email: (memberEmail !== '-' && memberEmail) ? memberEmail : '',
        dob: (memberDOB !== '-' && memberDOB) ? new Date(memberDOB).toISOString().split('T')[0] : '',
        anniversary: (memberAnniversary !== '-' && memberAnniversary) ? new Date(memberAnniversary).toISOString().split('T')[0] : '',
        membershipName: currentPkg || '-',
        duration: `${currentDur || 0} Month`,
        totalSessions: '-',
        sessionTransferred: '-',
        startDate: currentStart ? new Date(currentStart).toISOString().split('T')[0] : '',
        endDate: currentEnd ? new Date(currentEnd).toISOString().split('T')[0] : '',
        assignedTrainer: currentTrainer?.firstName ? `${currentTrainer.firstName} ${currentTrainer.lastName || ''}` : '-',
        transferTo: '',
        paymentMethod: 'Online',
        comment: '',
        transferAmount: 0,
        subtotal: 0,
        surcharges: 0,
        payableAmount: 0,
        applyTaxes: false,
        taxPercentage: 0,
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const taxDropdownRef = useRef(null);
    const trainerDropdownRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const res = await fetch(`${API_BASE_URL}/api/admin/employees?role=Trainer`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTrainers(data.employees || data || []);
                }
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };
        fetchTrainers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
            if (trainerDropdownRef.current && !trainerDropdownRef.current.contains(event.target)) setShowTrainerDropdown(false);
            if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (query) => {
        setForm({ ...form, transferTo: query });
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/admin/members?keyword=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter out current member
                setSearchResults(data.members.filter(m => m._id !== id));
                setShowSearchDropdown(true);
            }
        } catch (error) {
            console.error('Error searching members:', error);
        }
    };

    const handleTaxSelect = (val) => {
        setForm({ ...form, taxPercentage: val });
        setShowTaxDropdown(false);
    };

    const calculateTaxes = () => {
        const subtotal = parseFloat(form.subtotal || 0);
        const surcharges = parseFloat(form.surcharges || 0);
        const base = subtotal + surcharges;
        const taxAmount = (base * form.taxPercentage) / 100;
        const cgst = taxAmount / 2;
        const sgst = taxAmount / 2;
        return {
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            total: taxAmount.toFixed(2),
            cgstPerc: (form.taxPercentage / 2).toFixed(1),
            sgstPerc: (form.taxPercentage / 2).toFixed(1)
        };
    };

    const taxes = calculateTaxes();

    const handleSubmit = async () => {
        if (!selectedTargetMember) {
            alert('Please select a member to transfer to');
            return;
        }

        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const payload = {
                transferToMemberId: selectedTargetMember._id,
                transferCharge: form.transferAmount,
                subTotal: (parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0)),
                taxAmount: form.applyTaxes ? taxes.total : 0,
                paymentMode: form.paymentMethod,
                comment: form.comment,
                closedBy: adminInfo?._id
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Membership transferred successfully');
                navigate(-1);
            } else {
                const data = await res.json();
                alert(data.message || 'Error transferring membership');
            }
        } catch (error) {
            console.error('Error transferring membership:', error);
            alert('Failed to transfer membership');
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({ label, value, placeholder, type = "text", required = false, onChange, readonly = false }) => (
        <div className="space-y-1.5 flex-1 min-w-[240px]">
            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    readOnly={readonly}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                        ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                        } ${readonly ? 'opacity-70 cursor-not-allowed bg-gray-50' : ''}`}
                />
                {type === 'date' && (
                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                    <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-orange-500 text-sm font-bold">Members Profile</span>
                </div>
            </div>

            <h2 className={`text-xl font-bold px-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Transfer Membership ({mId || '-'})
            </h2>

            {/* Transfer Plan Section */}
            <div className="space-y-6">
                <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transfer Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Client ID" value={form.clientId} readonly />
                    <InputField label="Mobile Number" value={form.mobile} required readonly />
                    <InputField label="Email Address" placeholder="Ex : abc@gmail.com" value={form.email} readonly />
                    <InputField label="Date of Birth" type="date" value={form.dob} readonly />
                    <InputField label="Anniversary Date" type="date" value={form.anniversary} readonly />
                </div>
            </div>

            {/* Transfer Membership Section */}
            <div className="space-y-6 pt-4">
                <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transfer Membership ({mId || '-'})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Membership Name" value={form.membershipName} readonly />
                    <InputField label="Duration" value={form.duration} readonly />
                    <InputField label="Total Sessions" value={form.totalSessions} readonly />
                    <InputField label="Session Transferred" value={form.sessionTransferred} onChange={(e) => setForm({ ...form, sessionTransferred: e.target.value })} />
                    <InputField label="Start Date" type="date" value={form.startDate} readonly />
                    <InputField label="End Date" type="date" value={form.endDate} readonly />

                    <div className="space-y-1.5 flex-1">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assigned Trainer</label>
                        <div className="relative" ref={trainerDropdownRef}>
                            <button
                                onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-all ${isDarkMode
                                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                            >
                                <span className={form.assignedTrainer ? '' : 'text-gray-400'}>{form.assignedTrainer || 'Select Trainer'}</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                            {showTrainerDropdown && (
                                <div className={`absolute left-0 top-full mt-1 w-full rounded-xl shadow-xl border z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                    {trainers.map(t => (
                                        <div
                                            key={t._id}
                                            onClick={() => { setForm({ ...form, assignedTrainer: `${t.firstName} ${t.lastName}` }); setShowTrainerDropdown(false); }}
                                            className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {t.firstName} {t.lastName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5 flex-1" ref={searchRef}>
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transfer To*</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Member Name/Mobile"
                                value={form.transferTo}
                                onChange={(e) => handleSearch(e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                                    ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                                    }`}
                            />
                            {showSearchDropdown && searchResults.length > 0 && (
                                <div className={`absolute left-0 top-full mt-1 w-full rounded-xl shadow-xl border z-[60] py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                    {searchResults.map(m => (
                                        <div
                                            key={m._id}
                                            onClick={() => {
                                                setSelectedTargetMember(m);
                                                setForm({ ...form, transferTo: `${m.firstName} ${m.lastName} (${m.memberId})` });
                                                setShowSearchDropdown(false);
                                            }}
                                            className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors border-b last:border-0 ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex justify-between">
                                                <span>{m.firstName} {m.lastName}</span>
                                                <span className="text-orange-500">#{m.memberId}</span>
                                            </div>
                                            <div className="text-[11px] text-gray-500">{m.mobile}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => navigate('/admin/members/add')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border text-sm font-bold transition-all ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-300' : 'border-gray-200 bg-white text-gray-700 shadow-sm'}`}
                    >
                        <Plus size={16} />
                        Add New Member
                    </button>
                </div>
            </div>

            {/* Payment Row */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t dark:border-white/10 border-gray-100`}>
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        {['Online', 'Wallet', 'Cheque', 'Cash', 'Other'].map(method => (
                            <label key={method} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.paymentMethod === method ? 'border-orange-500' : 'border-gray-400'}`}>
                                    {form.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                </div>
                                <input type="radio" className="hidden" name="payment" checked={form.paymentMethod === method} onChange={() => setForm({ ...form, paymentMethod: method })} />
                                <span className={`text-sm font-bold ${form.paymentMethod === method ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>{method}</span>
                            </label>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Comment</label>
                        <textarea
                            placeholder="Comment"
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-32 resize-none outline-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50' : 'bg-white border-gray-200 focus:border-orange-500'}`}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    {[
                        { label: 'Transfer Amount', field: 'transferAmount' },
                        { label: 'Subtotal', value: form.subtotal, display: true },
                        { label: 'Surcharges', field: 'surcharges' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{row.label}</span>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                    <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                    {row.display ? (
                                        <div className="w-28 px-3 py-2 text-sm font-bold">{row.value || '0'}</div>
                                    ) : (
                                        <input
                                            type="number"
                                            value={form[row.field]}
                                            onChange={(e) => setForm({ ...form, [row.field]: e.target.value, subtotal: row.field === 'transferAmount' ? e.target.value : form.subtotal })}
                                            className="w-28 px-3 py-2 bg-transparent outline-none text-sm font-bold"
                                        />
                                    )}
                                </div>
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>₹</div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Payable Amount</span>
                        <span className="text-lg font-black">₹{parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0)}</span>
                    </div>

                    <div className={`border rounded-xl p-5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b dark:border-white/10 border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={form.applyTaxes}
                                    onChange={(e) => setForm({ ...form, applyTaxes: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                                <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Apply Taxes*</span>
                            </label>

                            <div className="relative" ref={taxDropdownRef}>
                                <button
                                    onClick={() => setShowTaxDropdown(!showTaxDropdown)}
                                    className={`flex items-center justify-between px-4 py-2 border rounded-lg w-32 bg-white dark:bg-[#1a1a1a] transition-all font-bold text-sm ${form.taxPercentage > 0 ? 'border-orange-500 text-orange-500' : 'border-gray-200 text-gray-400'}`}
                                >
                                    <span>{form.taxPercentage ? `${form.taxPercentage}%` : 'Select Tax'}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${showTaxDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showTaxDropdown && (
                                    <div className={`absolute left-0 top-full mt-1 w-32 rounded-xl shadow-xl border z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                        {[5, 12, 18].map(val => (
                                            <div
                                                key={val}
                                                onClick={() => handleTaxSelect(val)}
                                                className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {val}%
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>CGST ({form.applyTaxes ? taxes.cgstPerc : '0'}%)</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{form.applyTaxes ? taxes.cgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>SGST ({form.applyTaxes ? taxes.sgstPerc : '0'}%)</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{form.applyTaxes ? taxes.sgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-black pt-5 mt-4 border-t border-dashed dark:border-white/10 border-gray-200">
                                <span className="text-gray-400">Total Taxes (₹)</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{form.applyTaxes ? taxes.total : '0.00'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`mt-10 p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">I want to make payment and generate invoice</p>
                <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase text-[15px] py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 tracking-wider disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : `₹${(parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0) + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2)} Submit`}
                </button>
            </div>
        </div>
    );
};

export default TransferMembership;
