import { Add, Search, Groups } from '@mui/icons-material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminNavbar from '../Navigation/AdminNavbar';
import logoAngelCor from "../../../../../public/angelcor_logo.png";
import RankingSection from './RankingSection';
import { mockColaborators } from './mockData';
import ColaboratorsList from './ColaboratorsList';

function ColaboratorsArea() {
    const [colaborators, setColaborators] = useState(mockColaborators);
    const [topColaborators] = useState([...mockColaborators].sort((a, b) => b.proposalsCount - a.proposalsCount));

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white">
            {/* Navbar com animação de cima para baixo */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AdminNavbar logo={logoAngelCor} area="Colaboradores"/>
            </motion.div>

            <main className="w-full max-w-[1200px] mx-auto p-4 space-y-6">
                {/* Actions Bar com fade in */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                >
                    <button
                        className="w-full md:w-auto flex items-center justify-center gap-2 
                        bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                        rounded-lg transition-all text-base"
                    >
                        <Add />
                        Novo Colaborador
                    </button>

                    <div className="w-full md:w-auto flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-3 md:py-2">
                        <Search className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar colaborador..."
                            className="bg-transparent outline-none text-sm w-full md:w-[300px]"
                        />
                    </div>
                </motion.div>

                {/* Dashboard Cards com animação sequencial */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                    >
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Total de Colaboradores</h3>
                        <p className="text-2xl md:text-3xl font-bold text-[#e67f00]">{colaborators.length}</p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                    >
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Colaboradores Ativos</h3>
                        <p className="text-2xl md:text-3xl font-bold text-green-500">
                            {colaborators.filter(colab => colab.status === 'Ativo').length}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                    >
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Colaboradores Inativos</h3>
                        <p className="text-2xl md:text-3xl font-bold text-red-500">
                            {colaborators.filter(colab => colab.status === 'Inativo').length}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Ranking Section deslizando da direita */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
                >
                    <RankingSection topColaborators={topColaborators} />
                </motion.div>

                {/* Lista de Colaboradores deslizando da esquerda */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                >
                    <ColaboratorsList colaborators={colaborators} />
                </motion.div>
            </main>
        </div>
    );
}

export default ColaboratorsArea;