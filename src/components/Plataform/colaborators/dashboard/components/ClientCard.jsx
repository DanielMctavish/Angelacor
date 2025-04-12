import { motion } from 'framer-motion';
import { Person, WhatsApp, Email, Assignment, Description } from '@mui/icons-material';
import { useState } from 'react';
import UploadClientPhotoModal from './UploadClientPhotoModal';

function ClientCard({ client, progressSteps, stepDescriptions, onPhotoUpdate }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const steps = progressSteps(client);
    const progress = (steps.filter(Boolean).length / steps.length) * 100;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
                {/* Cabeçalho do Card */}
                <div className="flex items-start gap-4 mb-4">
                    <div 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex-shrink-0
                            cursor-pointer hover:ring-2 hover:ring-[#e67f00] transition-all
                            group relative"
                    >
                        {client.url_profile_cover ? (
                            <img
                                src={client.url_profile_cover}
                                alt={client.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Person className="text-gray-400 group-hover:text-[#e67f00] transition-colors" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <p className="text-sm text-gray-400">{client.clientType}</p>
                    </div>

                    {/* Badge de Progresso */}
                    <div className="px-3 py-1 rounded-full bg-white/5 text-xs">
                        {Math.round(progress)}% Completo
                    </div>
                </div>

                {/* Informações de Contato */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <WhatsApp className="text-[#e67f00]" fontSize="small" />
                        {client.phone || 'Não cadastrado'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Email className="text-[#e67f00]" fontSize="small" />
                        {client.email || 'Não cadastrado'}
                    </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-[#e67f00] to-[#ff8c00]"
                        />
                    </div>

                    {/* Lista de Etapas */}
                    <div className="grid grid-cols-5 gap-1 text-xs">
                        {steps.map((completed, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center ${
                                    completed ? 'text-[#e67f00]' : 'text-gray-500'
                                }`}
                                title={stepDescriptions[index]}
                            >
                                {index === 0 && <Person fontSize="small" />}
                                {index === 1 && <WhatsApp fontSize="small" />}
                                {index === 2 && <Email fontSize="small" />}
                                {index === 3 && <Assignment fontSize="small" />}
                                {index === 4 && <Description fontSize="small" />}
                                <span className="mt-1">{stepDescriptions[index]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Portal para o Modal */}
            {isUploadModalOpen && (
                <UploadClientPhotoModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    client={client}
                    onSuccess={(updatedClient) => {
                        setIsUploadModalOpen(false);
                        if (onPhotoUpdate) onPhotoUpdate(updatedClient);
                    }}
                />
            )}
        </>
    );
}

export default ClientCard; 