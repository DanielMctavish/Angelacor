import { Person, EmojiEvents } from "@mui/icons-material";

function ColaboratorNavbar({ user, xp, maxXp,level }) {
    // Calcula a porcentagem de progresso
    const progressPercentage = Math.min((xp / maxXp) * 100, 100);

    return (
        <nav className="w-full min-h-[12vh] flex items-center justify-between 
        bg-white/10 backdrop-blur-sm text-white relative p-4 rounded-xl overflow-hidden
        border border-white/10">
            <div className="flex justify-start items-center w-[300px] gap-3">
                {user ? (
                    <img src={user.avatar} alt="Logo" className="w-[70px] h-[70px] rounded-full bg-[#1f1f1f]" />
                ) : (
                    <div className="w-[70px] h-[70px] rounded-full bg-[#1f1f1f] 
                        flex items-center justify-center border border-white/10">
                        <Person className="text-gray-400 text-3xl" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-semibold">{user?.name || 'Colaborador Tal'}</span>
                    <span className="text-gray-400">{user?.role || 'operacional'}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 bg-[#1f1f1f] px-4 py-2 rounded-lg">
                <EmojiEvents className="text-[#e67f00]" />
                <span className="font-bold text-xl">{level}</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[2vh] bg-[#1f1f1f] flex justify-center items-center">
                {/* Barra de progresso com largura dinâmica baseada no XP */}
                <div 
                    className="h-[1.8vh] bg-gradient-to-r from-[#e67f00] to-[#ff8c00] 
                    rounded-[6px] absolute left-0 transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                />
                
                {/* Container para o texto centralizado */}
                <div className="relative z-10 px-2 flex items-center justify-center w-full">
                    <span className="text-white text-sm font-bold"
                        style={{ textShadow: "2px 1px 2px rgba(0,0,0,0.3)" }}>
                        {xp}/{maxXp} XP
                    </span>
                </div>
            </div>
        </nav>
    );
}

export default ColaboratorNavbar; 