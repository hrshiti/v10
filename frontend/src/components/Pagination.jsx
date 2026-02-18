import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    isDarkMode,
    size = 'normal' // 'small' or 'normal'
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 3; // Number of pages to show around current page

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    const btnSize = size === 'small' ? 'w-9 h-9' : 'w-11 h-11';
    const padding = size === 'small' ? 'px-4 py-2' : 'px-6 py-2.5';

    return (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`${padding} border rounded-xl text-[12px] font-black transition-all ${isDarkMode
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-30'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                    }`}
            >
                « Previous
            </button>

            <div className="flex items-center gap-1 md:gap-2">
                {getPageNumbers().map((num, idx) => (
                    <button
                        key={idx}
                        onClick={() => typeof num === 'number' && onPageChange(num)}
                        disabled={typeof num !== 'number'}
                        className={`${btnSize} border rounded-xl text-[12px] font-black transition-all ${currentPage === num
                                ? 'bg-[#f97316] text-white shadow-lg border-[#f97316]'
                                : typeof num !== 'number'
                                    ? 'border-transparent cursor-default'
                                    : isDarkMode
                                        ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {num}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`${padding} border rounded-xl text-[12px] font-black transition-all ${isDarkMode
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-30'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                    }`}
            >
                Next »
            </button>
        </div>
    );
};

export default Pagination;
