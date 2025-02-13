import { useState } from 'react';
import { motion } from 'framer-motion';
import { Close, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../../Common/Toast/Toast';
import XpLevels from '../../../Admin/Colaborators/XP/XpLevels';

function UploadClientPhotoModal({ isOpen, onClose, client, onSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Cria preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Selecione uma foto');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('triunfo-profile-client', selectedFile);

        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            // Upload da foto
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/client/upload-cover-profile?clientId=${client.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Atualiza o XP do colaborador (+600 XP por foto adicionada)
            const newXp = (colaboratorData.user.experience || 0) + 600;
            
            // Calcula o novo level baseado no XP
            let newLevel = 1;
            Object.entries(XpLevels).forEach(([levelKey, xpRequired]) => {
                if (newXp >= xpRequired) {
                    newLevel = parseInt(levelKey.replace('level', ''));
                }
            });

            // Atualiza o XP e level no backend
            const xpResponse = await axios.patch(
                `${import.meta.env.VITE_API_URL}/colaborator/update?colaboratorId=${colaboratorData.user.id}`,
                {
                    ...colaboratorData.user,
                    experience: newXp,
                    level: newLevel
                },
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            // Atualiza os dados do colaborador no localStorage
            localStorage.setItem('colaboratorData', JSON.stringify({
                ...colaboratorData,
                user: {
                    ...colaboratorData.user,
                    experience: newXp,
                    level: newLevel
                }
            }));

            toast.success('Foto atualizada com sucesso!');

            // Mostra mensagem de XP ganho
            toast.success(
                <div className="flex flex-col items-center gap-1">
                    <span>+600 XP</span>
                    <span className="text-sm">Foto do cliente adicionada!</span>
                </div>
            );

            // Mostra mensagem de level up se necessário
            if (newLevel > colaboratorData.user.level) {
                toast.success(
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-bold">🎉 Level Up! 🎉</span>
                        <span>Você evoluiu para o nível {newLevel}!</span>
                    </div>
                );
            }

            // Chama onSuccess com os dados atualizados
            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            toast.error('Erro ao fazer upload da foto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Atualizar Foto</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        {/* Área de Preview */}
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-dashed border-white/20">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <CloudUpload className="text-gray-400 text-3xl" />
                                </div>
                            )}
                        </div>

                        {/* Input de Arquivo */}
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg
                                transition-colors text-white flex items-center gap-2">
                                <CloudUpload />
                                Selecionar Foto
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedFile || loading}
                            className="px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg
                                transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center gap-2"
                        >
                            {loading ? 'Enviando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default UploadClientPhotoModal; 