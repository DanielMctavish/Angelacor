import { Visibility, Delete, Groups, Refresh, EmojiEvents, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalAddColaboratorPicture from './ModalAddColaboratorPicture';
import ColaboratorDetails from './ColaboratorDetails';
import EditColaboratorModal from './EditColaboratorModal';
import ChangeColaboratorPassword from './ChangeColaboratorPassword';
import XpSystem from '../../XP/XpLevels';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, colaboratorName }) {
    if (!isOpen) return null;

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
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-[400px] border border-white/10"
            >
                <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
                <p className="text-gray-300 mb-6">
                    Tem certeza que deseja excluir o colaborador <span className="text-white font-semibold">{colaboratorName}</span>?
                    Esta ação não pode ser desfeita.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                            transition-colors text-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 
                            transition-colors text-white"
                    >
                        Excluir
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ColaboratorsList({ colaborators, loading, error, onRefresh, onDelete, onGiveXp, xpLevels }) {
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, colaborator: null });
    const [pictureModal, setPictureModal] = useState({ isOpen: false, colaboratorId: null });
    const [detailsModal, setDetailsModal] = useState({ isOpen: false, colaborator: null });
    const [editModal, setEditModal] = useState({ isOpen: false, colaborator: null });
    const [passwordModal, setPasswordModal] = useState({ isOpen: false, colaborator: null });

    const handleDeleteClick = (colaborator) => {
        setDeleteModal({ isOpen: true, colaborator });
    };

    const handleConfirmDelete = async () => {
        if (deleteModal.colaborator) {
            await onDelete(deleteModal.colaborator);
            setDeleteModal({ isOpen: false, colaborator: null });
        }
    };

    const handleShowDetails = (colaborator) => {
        const colaboratorWithDefaults = {
            ...colaborator,
            nationality: colaborator.nationality || 'brasileiro(a)',
            address: colaborator.address || 'Não informado',
            cpf: colaborator.cpf || 'Não informado',
            rg: colaborator.rg || 'Não informado',
            function: colaborator.function || 'Não informado',
            salary: colaborator.salary || 0,
            work_contract: colaborator.work_contract || 'Contrato em processo de elaboração.',
        };
        setDetailsModal({ isOpen: true, colaborator: colaboratorWithDefaults });
    };

    const handleEdit = (colaborator) => {
        setDetailsModal({ isOpen: false });
        setEditModal({ isOpen: true, colaborator });
    };

    const handlePictureSuccess = () => {
        onRefresh();
        setPictureModal({ isOpen: false, colaboratorId: null });
    };

    const handleChangePassword = (colaborator) => {
        setPasswordModal({ isOpen: true, colaborator });
    };

    const handlePasswordSuccess = () => {
        onRefresh();
        setPasswordModal({ isOpen: false, colaborator: null });
    };

    if (loading) {
        return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                Carregando colaboradores...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 mx-auto bg-[#1f1f1f] hover:bg-[#e67f00] 
                        px-4 py-2 rounded-lg transition-all text-white"
                >
                    <Refresh />
                    Tentar novamente
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const handleShowModalAddPicture = (colaboratorId) => {
        setPictureModal({ isOpen: true, colaboratorId });
    };

    const calculateProgress = (experience) => {
        const currentXp = experience || 0;
        let nextLevel = null;
        let currentLevelXp = 0;

        // Encontra o próximo nível
        Object.entries(xpLevels).forEach(([level, xpRequired]) => {
            if (currentXp < xpRequired && !nextLevel) {
                nextLevel = {
                    level: parseInt(level.replace('level', '')),
                    xp: xpRequired
                };
            }
            if (currentXp >= xpRequired) {
                currentLevelXp = xpRequired;
            }
        });

        if (!nextLevel) {
            return { progress: 100, nextLevelXp: null };
        }

        const progress = ((currentXp - currentLevelXp) / (nextLevel.xp - currentLevelXp)) * 100;
        return {
            progress: Math.min(100, Math.max(0, progress)),
            nextLevelXp: nextLevel.xp
        };
    };

    // Função para pegar informações do nível
    const getLevelInfo = (experience) => {
        return XpSystem.getCurrentLevel(experience);
    };

    return (
        <>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <Groups />
                        Lista de Colaboradores
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full" style={{ minWidth: '800px' }}>
                        <thead className="text-left text-gray-400 text-sm bg-[#1f1f1f2d]">
                            <tr>
                                <th className="p-4 font-medium">Nome</th>
                                <th className="p-4 font-medium">Função</th>
                                <th className="p-4 font-medium">Level</th>
                                <th className="p-4 font-medium">Criado em</th>
                                <th className="p-4 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colaborators.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-400">
                                        Nenhum colaborador cadastrado
                                    </td>
                                </tr>
                            ) : (
                                colaborators.map(colaborator => {
                                    const levelInfo = getLevelInfo(colaborator.experience);
                                    
                                    return (
                                        <tr key={colaborator.id} className="border-t border-white/10">
                                            <td className="p-4 flex items-center gap-3">
                                                <div className="w-[60px] h-[60px] flex-shrink-0 rounded-full bg-[#1f1f1f] overflow-hidden">
                                                    {colaborator.url_profile_cover ? (
                                                        <img
                                                            src={colaborator.url_profile_cover}
                                                            alt={colaborator.name}
                                                            className="w-full h-full object-cover aspect-square"
                                                        />
                                                    ) : (
                                                        <div 
                                                            onClick={() => handleShowModalAddPicture(colaborator.id)}
                                                            className="w-full h-full flex items-center justify-center cursor-pointer text-gray-500 text-2xl"
                                                        >
                                                            <span>{colaborator.name.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="truncate">{colaborator.name}</span>
                                            </td>
                                            <td className="p-4">{colaborator.function}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        Nível {levelInfo.level}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {levelInfo.currentXp} XP
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Próximo: {levelInfo.xpNeeded} XP
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {formatDate(colaborator.createdAt)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        title="Ver detalhes"
                                                        onClick={() => handleShowDetails(colaborator)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#133785] 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Alterar senha"
                                                        onClick={() => handleChangePassword(colaborator)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#e67f00] 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Lock fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Excluir colaborador"
                                                        onClick={() => handleDeleteClick(colaborator)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-red-600 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Delete fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Dar XP"
                                                        onClick={() => onGiveXp(colaborator)}
                                                        className="p-2 text-gray-400 hover:text-[#e67f00] hover:bg-white/5 
                                                            rounded-lg transition-all"
                                                    >
                                                        <EmojiEvents fontSize="small" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {deleteModal.isOpen && (
                    <DeleteConfirmationModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, colaborator: null })}
                        onConfirm={handleConfirmDelete}
                        colaboratorName={deleteModal.colaborator?.name}
                    />
                )}
                {pictureModal.isOpen && (
                    <ModalAddColaboratorPicture
                        isOpen={pictureModal.isOpen}
                        onClose={() => setPictureModal({ isOpen: false, colaboratorId: null })}
                        colaboratorId={pictureModal.colaboratorId}
                        onSuccess={handlePictureSuccess}
                    />
                )}
                {detailsModal.isOpen && (
                    <ColaboratorDetails
                        isOpen={detailsModal.isOpen}
                        onClose={() => setDetailsModal({ isOpen: false, colaborator: null })}
                        colaborator={detailsModal.colaborator}
                        onEdit={handleEdit}
                    />
                )}
                {editModal.isOpen && (
                    <EditColaboratorModal
                        isOpen={editModal.isOpen}
                        onClose={() => setEditModal({ isOpen: false, colaborator: null })}
                        colaborator={editModal.colaborator}
                        onSuccess={onRefresh}
                    />
                )}
                {passwordModal.isOpen && (
                    <ChangeColaboratorPassword
                        isOpen={passwordModal.isOpen}
                        onClose={() => setPasswordModal({ isOpen: false, colaborator: null })}
                        colaborator={passwordModal.colaborator}
                        onSuccess={handlePasswordSuccess}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default ColaboratorsList; 