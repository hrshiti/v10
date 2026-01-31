import React from 'react';
import { Clock, Crown } from 'lucide-react';

const RecommendationCard = ({ image, title, duration, level, tag, tagColor, tagBg }) => {
    return (
        <div className="bg-white dark:bg-[#1A1F2B] rounded-[1.5rem] p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
                {/* Image Container */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mt-1">
                        <div className="flex items-center gap-0.5">
                            <Clock size={12} />
                            <span>{duration}</span>
                        </div>
                        <div className="w-[1px] h-2.5 bg-gray-300"></div>
                        <div className="flex items-center gap-0.5">
                            <Crown size={12} />
                            <span>{level}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tag */}
            <div
                className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide self-center"
                style={{ backgroundColor: tagBg, color: tagColor }}
            >
                {tag}
            </div>
        </div>
    );
};

export default RecommendationCard;
