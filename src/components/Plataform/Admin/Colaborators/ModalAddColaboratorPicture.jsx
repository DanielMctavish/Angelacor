import { Close, CloudUpload } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

function ModalAddColaboratorPicture({ isOpen, onClose, colaboratorId, onSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Por favor, selecione uma imagem');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('triunfo-profile-colaborator', selectedFile);

            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData?.token) {
                throw new Error('Token não encontrado');
            }

            await axios.post(
                `${import.meta.env.VITE_API_URL}/colaborator/upload-cover-profile?colaboratorId=${colaboratorId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            setError('Erro ao fazer upload da imagem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-[400px] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <Close />
                </button>

                <h3 className="text-xl font-bold text-white mb-6">
                    Adicionar Foto de Perfil
                </h3>

                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed 
                            border-white/20 flex items-center justify-center overflow-hidden">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <CloudUpload className="text-4xl text-gray-400" />
                            )}
                        </div>

                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <span className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 
                                rounded-lg transition-colors inline-flex items-center gap-2">
                                <CloudUpload />
                                Selecionar Imagem
                            </span>
                        </label>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                        className="w-full bg-[#e67f00] hover:bg-[#ff8c00] text-white py-2 rounded-lg 
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Enviando...' : 'Enviar Foto'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ModalAddColaboratorPicture;