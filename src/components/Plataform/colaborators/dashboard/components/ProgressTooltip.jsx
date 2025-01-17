function ProgressTooltip({ description, xp }) {
    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
            hidden group-hover:block w-max z-50">
            <div className="bg-[#1f1f1f] text-white text-xs py-2 px-3 
                rounded-lg shadow-lg border border-white/10 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                    <span>{description}</span>
                    <span className="text-[#e67f00] font-semibold">
                        +{xp} XP
                    </span>
                </div>

                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                    w-2 h-2 bg-[#1f1f1f] border-r border-b border-white/10 
                    transform rotate-45">
                </div>
            </div>
        </div>
    );
}

export default ProgressTooltip; 