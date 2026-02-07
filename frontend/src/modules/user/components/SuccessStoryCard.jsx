import { User, Pencil, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const SuccessStoryCard = ({ story, onEdit, onDelete }) => {
    const {
        title,
        memberName,
        beforeImage,
        afterImage,
        duration,
        trainerId,
    } = story;

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/${path}`;
    };

    const trainerName = trainerId ? `${trainerId.firstName}` : 'Coach';

    return (
        <div className="bg-white dark:bg-[#1A1F2B] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 transition-all duration-500 group relative">
            {/* Actions: Edit/Delete (If provided) */}
            {(onEdit || onDelete) && (
                <div className="absolute top-4 right-4 z-30 flex gap-2">
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(story); }}
                            className="p-3 bg-white/90 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-xl text-blue-500 hover:scale-110 active:scale-90 transition-all border border-white/20"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(story._id); }}
                            className="p-3 bg-white/90 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-xl text-red-500 hover:scale-110 active:scale-90 transition-all border border-white/20"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            )}

            {/* Visual: Transformation Only */}
            <div className="relative flex gap-0.5 h-80 overflow-hidden">
                {/* Before */}
                <div className="relative w-1/2 h-full">
                    <img
                        src={getImageUrl(beforeImage)}
                        alt="Before"
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white/90 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-white/10">
                        Before
                    </div>
                </div>

                {/* After */}
                <div className="relative w-1/2 h-full">
                    <img
                        src={getImageUrl(afterImage)}
                        alt="After"
                        className="w-full h-full object-cover transition-all duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">
                        After
                    </div>
                </div>

                {/* Subtitle/Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-white text-base font-black leading-tight mb-1">
                                {title}
                            </h3>
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {memberName} • {duration}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-1">Coach</p>
                            <p className="text-white text-[10px] font-black">{trainerName}</p>
                        </div>
                    </div>
                </div>
            </div>
            {story.description && (
                <div className="p-5 bg-white dark:bg-[#1A1F2B] border-t border-gray-50 dark:border-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                        "{story.description}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default SuccessStoryCard;
