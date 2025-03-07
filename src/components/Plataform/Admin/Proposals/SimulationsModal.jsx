import { Close, Calculate } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

function SimulationsModal({ isOpen, onClose, simulations }) {
    if (!isOpen) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const sortedSimulations = [...simulations].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-[#1a4ba1] to-[#133785] rounded-xl w-full max-w-3xl shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Calculate className="text-[#e67f00]" />
                        <h3 className="text-lg font-semibold text-white">
                            Simulações ({simulations.length})
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/70 hover:text-white hover:bg-[#e67f00] rounded-lg transition-all"
                    >
                        <Close />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {sortedSimulations.map((simulation, idx) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-[#a9f1ff] text-sm">Saldo Devedor</span>
                                    <p className="text-green-400 font-medium">
                                        {formatCurrency(simulation.saldoDevedor)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[#a9f1ff] text-sm">Parcela</span>
                                    <p className="text-white font-medium">
                                        {formatCurrency(Number(simulation.parcela))}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[#a9f1ff] text-sm">Prazo</span>
                                    <p className="text-white font-medium">{simulation.prazoRestante}x</p>
                                </div>
                                <div>
                                    <span className="text-[#a9f1ff] text-sm">Taxa</span>
                                    <p className="text-white font-medium">{simulation.taxa}% a.m.</p>
                                </div>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-xs text-gray-400">
                                    {new Date(simulation.date).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default SimulationsModal; 