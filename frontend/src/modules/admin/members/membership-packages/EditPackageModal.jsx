import React, { useState, useEffect } from 'react';
import { X, Info, Plus, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';
import CustomAlert from '../../components/CustomAlert';

const EditPackageModal = ({ isOpen, onClose, isDarkMode, packageData, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('Months');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        activity: '',
        timing: '',
        description: '',
        durationType: 'Months',
        durationValue: '',
        sessions: '',
        rackRate: '',
        baseRate: '',
        transferDays: 0,
        upgradeDays: 0,
        freezeFrequency: 0,
        freezeDuration: 0,
        soldLimit: false,
        sessionDays: []
    });

    useEffect(() => {
        if (packageData && isOpen) {
            setFormData({
                name: packageData.name || '',
                type: packageData.type || '',
                activity: packageData.activity || '',
                timing: packageData.timing || '',
                description: packageData.description || '',
                durationType: packageData.durationType || 'Months',
                durationValue: packageData.durationValue || '',
                sessions: packageData.sessions || '',
                rackRate: packageData.rackRate || '',
                baseRate: packageData.baseRate || '',
                transferDays: packageData.transferDays || 0,
                upgradeDays: packageData.upgradeDays || 0,
                freezeFrequency: packageData.freezeFrequency || 0,
                freezeDuration: packageData.freezeDuration || 0,
                soldLimit: packageData.soldLimit || false,
                sessionDays: packageData.sessionDays || []
            });
            setActiveTab(packageData.durationType || 'Months');
        }
    }, [packageData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSessionDayToggle = (day) => {
        if (day === 'All Days') {
            if (formData.sessionDays.length === 7) {
                setFormData(prev => ({ ...prev, sessionDays: [] }));
            } else {
                setFormData(prev => ({ ...prev, sessionDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                sessionDays: prev.sessionDays.includes(day)
                    ? prev.sessionDays.filter(d => d !== day)
                    : [...prev.sessionDays, day]
            }));
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name || !formData.type || !formData.activity || !formData.timing) {
            setAlert({
                isOpen: true,
                type: 'warning',
                title: 'Missing Required Fields',
                message: 'Please fill in all required fields: Plan Name, Plan Type, Activities, and Plan Timing.'
            });
            return;
        }

        if (!formData.durationValue || !formData.sessions || !formData.rackRate || !formData.baseRate) {
            setAlert({
                isOpen: true,
                type: 'warning',
                title: 'Missing Required Fields',
                message: 'Please fill in Duration, Sessions, Rack Rate, and Base Rate.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const payload = {
                name: formData.name,
                type: formData.type,
                activity: formData.activity,
                timing: formData.timing,
                description: formData.description,
                durationType: activeTab,
                durationValue: parseInt(formData.durationValue),
                sessions: parseInt(formData.sessions),
                rackRate: parseFloat(formData.rackRate),
                baseRate: parseFloat(formData.baseRate),
                transferDays: parseInt(formData.transferDays) || 0,
                upgradeDays: parseInt(formData.upgradeDays) || 0,
                freezeFrequency: parseInt(formData.freezeFrequency) || 0,
                freezeDuration: parseInt(formData.freezeDuration) || 0,
                soldLimit: formData.soldLimit,
                sessionDays: formData.sessionDays
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/packages/${packageData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setAlert({
                    isOpen: true,
                    type: 'success',
                    title: 'Package Updated!',
                    message: 'The membership package has been updated successfully.'
                });

                // Call success callback and close after delay
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    onClose();
                }, 1500);
            } else {
                const err = await res.json();
                setAlert({
                    isOpen: true,
                    type: 'error',
                    title: 'Update Failed',
                    message: err.message || 'Failed to update package. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error updating package:', error);
            setAlert({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred while updating the package.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                <div className={`w-full max-w-xl my-8 rounded-lg shadow-2xl transition-all overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                    {/* Header */}
                    <div className={`p-5 px-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10 bg-[#252525]' : 'border-gray-200 bg-[#f3f4f6]'}`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-2 rounded-lg">
                                <Plus size={18} strokeWidth={4} />
                            </div>
                            <h3 className={`text-[18px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Edit Package</h3>
                        </div>
                        <button onClick={onClose} className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-black transition-colors'}>
                            <X size={24} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Basic Info */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
                                <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-full">
                                    <Info size={20} className="text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Plan Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Type Plan Name"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Plan Type*</label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                                    >
                                        <option value="">Select</option>
                                        <option value="general">General Training</option>
                                        <option value="pt">Personal Training</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Activities*</label>
                                <div className="relative">
                                    <select
                                        name="activity"
                                        value={formData.activity}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                                    >
                                        <option value="">Select</option>
                                        <option value="gym">Gym</option>
                                        <option value="yoga">Yoga</option>
                                        <option value="zumba">Zumba</option>
                                        <option value="crossfit">Crossfit</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Plan Timing*</label>
                                <div className="relative">
                                    <select
                                        name="timing"
                                        value={formData.timing}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                                    >
                                        <option value="">Select</option>
                                        <option value="anytime">Anytime</option>
                                        <option value="morning">Morning</option>
                                        <option value="evening">Evening</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the plan here..."
                                    rows={4}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                />
                            </div>
                        </div>

                        {/* Optional Section */}
                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                            <div className="flex items-center gap-2">
                                <h3 className={`text-[17px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Optional</h3>
                                <Info size={18} className="text-gray-400" />
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transfer Days</label>
                                    <input
                                        type="number"
                                        name="transferDays"
                                        value={formData.transferDays}
                                        onChange={handleInputChange}
                                        placeholder="Enter Transfer Days"
                                        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold outline-none transition-all focus:border-[#f97316] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                    <span className="text-[11px] text-gray-500 mt-2 block font-medium">Example : 20</span>
                                </div>

                                <div>
                                    <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upgrade Days</label>
                                    <input
                                        type="number"
                                        name="upgradeDays"
                                        value={formData.upgradeDays}
                                        onChange={handleInputChange}
                                        placeholder="Enter Upgrade Days"
                                        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold outline-none transition-all focus:border-[#f97316] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                    <span className="text-[11px] text-gray-500 mt-2 block font-medium">Example : 20</span>
                                </div>

                                <div>
                                    <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Freeze Frequency</label>
                                    <input
                                        type="number"
                                        name="freezeFrequency"
                                        value={formData.freezeFrequency}
                                        onChange={handleInputChange}
                                        placeholder="Enter Freeze Frequency"
                                        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold outline-none transition-all focus:border-[#f97316] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                    <span className="text-[11px] text-gray-500 mt-2 block font-medium">Example : 20</span>
                                </div>

                                <div>
                                    <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Freeze Duration</label>
                                    <input
                                        type="number"
                                        name="freezeDuration"
                                        value={formData.freezeDuration}
                                        onChange={handleInputChange}
                                        placeholder="Enter Freeze Duration"
                                        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold outline-none transition-all focus:border-[#f97316] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                    <span className="text-[11px] text-gray-500 mt-2 block font-medium">Example : 20</span>
                                </div>
                            </div>
                        </div>

                        {/* Duration Type Selection */}
                        <div className={`p-1.5 rounded-xl border flex items-center gap-2 ${isDarkMode ? 'bg-[#252525] border-white/10' : 'bg-gray-100 border-gray-200 shadow-inner'}`}>
                            <label className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg cursor-pointer transition-all ${activeTab === 'Months' ? 'bg-white shadow-sm' : ''}`}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activeTab === 'Months' ? 'border-[#f97316]' : 'border-gray-300'}`}>
                                    {activeTab === 'Months' && <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />}
                                </div>
                                <input
                                    type="radio"
                                    name="duration_type"
                                    checked={activeTab === 'Months'}
                                    onChange={() => setActiveTab('Months')}
                                    className="hidden"
                                />
                                <span className={`text-[14px] font-black ${isDarkMode ? (activeTab === 'Months' ? 'text-black' : 'text-gray-400') : (activeTab === 'Months' ? 'text-gray-900' : 'text-gray-500')}`}>Months</span>
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg cursor-pointer transition-all ${activeTab === 'Days' ? 'bg-white shadow-sm' : ''}`}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activeTab === 'Days' ? 'border-[#f97316]' : 'border-gray-300'}`}>
                                    {activeTab === 'Days' && <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />}
                                </div>
                                <input
                                    type="radio"
                                    name="duration_type"
                                    checked={activeTab === 'Days'}
                                    onChange={() => setActiveTab('Days')}
                                    className="hidden"
                                />
                                <span className={`text-[14px] font-black ${isDarkMode ? (activeTab === 'Days' ? 'text-black' : 'text-gray-400') : (activeTab === 'Days' ? 'text-gray-900' : 'text-gray-500')}`}>Days</span>
                            </label>
                        </div>

                        {/* Detailed Plan Info */}
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration*</label>
                                <input
                                    type="number"
                                    name="durationValue"
                                    value={formData.durationValue}
                                    onChange={handleInputChange}
                                    placeholder="Enter Duration"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sessions*</label>
                                <input
                                    type="number"
                                    name="sessions"
                                    value={formData.sessions}
                                    onChange={handleInputChange}
                                    placeholder="Enter Sessions"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rack Rate*</label>
                                <input
                                    type="number"
                                    name="rackRate"
                                    value={formData.rackRate}
                                    onChange={handleInputChange}
                                    placeholder="Enter Rack Rate"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-[14px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Base Rate*</label>
                                <input
                                    type="number"
                                    name="baseRate"
                                    value={formData.baseRate}
                                    onChange={handleInputChange}
                                    placeholder="Enter Base Rate"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="soldLimit"
                                    checked={formData.soldLimit}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-[#f97316] rounded border-gray-300"
                                    id="soldLimit"
                                />
                                <label htmlFor="soldLimit" className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sold limit</label>
                            </div>

                            <div className="space-y-3">
                                <label className={`block text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Session Days*</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['All Days', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <div key={day} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={day === 'All Days' ? formData.sessionDays.length === 7 : formData.sessionDays.includes(day)}
                                                onChange={() => handleSessionDayToggle(day)}
                                                className="w-5 h-5 accent-[#f97316] rounded border-gray-300"
                                                id={day}
                                            />
                                            <label htmlFor={day} className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{day}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`p-5 px-6 border-t flex justify-end ${isDarkMode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-[#f9fafb]'}`}>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`bg-[#f97316] hover:bg-orange-600 text-white px-10 py-3 rounded-lg text-[15px] font-black shadow-lg transition-all active:scale-95 uppercase tracking-wider flex items-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Alert */}
            <CustomAlert
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                isDarkMode={isDarkMode}
            />
        </>
    );
};

export default EditPackageModal;
