import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Upload, File, Trash2, Download, CheckCircle2, X, FileText, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';
import CustomAlert from '../../components/CustomAlert';
import CustomConfirm from '../../components/CustomConfirm';

const MemberDocuments = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const {
        id,
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};

    const memberId = id;

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Alert and Confirm states
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [confirm, setConfirm] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    useEffect(() => {
        fetchDocuments();
    }, [memberId]);

    const fetchDocuments = async () => {
        if (!memberId) return;
        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${memberId}/documents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setAlert({
                isOpen: true,
                type: 'warning',
                title: 'No Files Selected',
                message: 'Please select at least one file to upload before proceeding.'
            });
            return;
        }

        setIsUploading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('documents', file);
            });

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${memberId}/documents`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setSelectedFiles([]);
                fetchDocuments();
            } else {
                const err = await res.json();
                setAlert({
                    isOpen: true,
                    type: 'error',
                    title: 'Upload Failed',
                    message: err.message || 'Failed to upload documents. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
            setAlert({
                isOpen: true,
                type: 'error',
                title: 'Upload Error',
                message: 'An unexpected error occurred while uploading documents.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = (documentId, publicId) => {
        setConfirm({
            isOpen: true,
            title: 'Delete Document',
            message: 'Are you sure you want to delete this document? This action cannot be undone.',
            onConfirm: () => performDelete(documentId, publicId)
        });
    };

    const performDelete = async (documentId, publicId) => {
        setConfirm({ ...confirm, isOpen: false });

        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${memberId}/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchDocuments();
            } else {
                const err = await res.json();
                setAlert({
                    isOpen: true,
                    type: 'error',
                    title: 'Delete Failed',
                    message: err.message || 'Failed to delete document. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            setAlert({
                isOpen: true,
                type: 'error',
                title: 'Delete Error',
                message: 'An unexpected error occurred while deleting the document.'
            });
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            return <ImageIcon size={20} className="text-blue-500" />;
        }
        return <FileText size={20} className="text-red-500" />;
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Documents</h2>

            {/* Info Card */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Mobile Number</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberMobile}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Email ID</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmail}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">DOB</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberDOB}</p>
                    </div>
                </div>
                <div className="border-t dark:border-white/10 border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Anniversary Date</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberAnniversary}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact Name</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyName}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact No</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyNo}</p>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Upload Documents</h3>

                <input
                    type="file"
                    id="documentUpload"
                    className="hidden"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileSelect}
                />

                <div
                    onClick={() => document.getElementById('documentUpload').click()}
                    className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDarkMode ? 'border-white/20 hover:border-orange-500 bg-[#1a1a1a]' : 'border-gray-300 hover:border-orange-500 bg-gray-50'}`}
                >
                    <Upload size={32} className="text-orange-500 mb-3" />
                    <p className={`text-base font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Click to Upload Documents</p>
                    <p className="text-xs text-gray-500">Supports: JPG, JPEG, PNG, PDF</p>
                    <p className="text-xs text-gray-500">Maximum size: 5MB per file</p>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Selected Files ({selectedFiles.length})</h4>
                        {selectedFiles.map((file, index) => (
                            <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <File size={20} className="text-orange-500" />
                                    <div>
                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelectedFile(index);
                                    }}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <X size={18} className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button */}
                {selectedFiles.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className={`px-10 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-3 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload Documents
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Uploaded Documents List */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-6 border-b dark:border-white/10 border-gray-200">
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Uploaded Documents</h3>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No documents uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documents.map((doc) => (
                                <div key={doc._id} className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {getFileIcon(doc.name)}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{doc.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            <Download size={18} className="text-blue-500" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc._id, doc.publicId)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Success Notification */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-green-400/50 backdrop-blur-md">
                        <div className="bg-white/20 p-2 rounded-full">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="font-black text-[15px]">Documents Uploaded!</p>
                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Files saved successfully</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Alert Modal */}
            <CustomAlert
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                isDarkMode={isDarkMode}
            />

            {/* Custom Confirm Modal */}
            <CustomConfirm
                isOpen={confirm.isOpen}
                onConfirm={confirm.onConfirm}
                onCancel={() => setConfirm({ ...confirm, isOpen: false })}
                title={confirm.title}
                message={confirm.message}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default MemberDocuments;
