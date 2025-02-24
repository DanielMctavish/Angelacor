import { motion } from 'framer-motion';
import { Close, Edit, Person, Email, Badge, Phone, Home, Work, AttachMoney, EmojiEvents, Print } from '@mui/icons-material';
import { contractTemplate, confidentialityTemplate } from './data/contractTemplate';

function ColaboratorDetails({ isOpen, onClose, colaborator, onEdit }) {
    if (!isOpen || !colaborator) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handlePrint = () => {
        const contractHtml = contractTemplate.template(colaborator);
        const confidentialityHtml = confidentialityTemplate.template(colaborator);
        
        // Cria um novo documento para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Documentos - ${colaborator.name}</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .page-break { page-break-before: always; }
                        h2, h3 { color: #133785; }
                    </style>
                </head>
                <body>
                    ${contractHtml}
                    <div class="page-break"></div>
                    ${confidentialityHtml}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    };

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
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            >
                {/* Cabeçalho */}
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">Detalhes do Colaborador</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(colaborator)}
                            className="p-2 text-gray-400 hover:text-[#e67f00] hover:bg-white/5 
                                rounded-lg transition-all"
                        >
                            <Edit />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 
                                rounded-lg transition-all"
                        >
                            <Close />
                        </button>
                    </div>
                </div>

                {/* Informações do Colaborador */}
                <div className="space-y-6">
                    {/* Cabeçalho com Foto */}
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5">
                            {colaborator.url_profile_cover ? (
                                <img
                                    src={colaborator.url_profile_cover}
                                    alt={colaborator.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Person className="text-gray-400 text-4xl" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">{colaborator.name}</h3>
                            <p className="text-[#e67f00]">{colaborator.function}</p>
                        </div>
                    </div>

                    {/* Grid de Informações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações Pessoais */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-[#e67f00]">Informações Pessoais</h4>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Email className="text-gray-400" />
                                    {colaborator.email}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Badge className="text-gray-400" />
                                    CPF: {colaborator.cpf || 'Não informado'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Badge className="text-gray-400" />
                                    RG: {colaborator.rg || 'Não informado'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Phone className="text-gray-400" />
                                    {colaborator.phone_number || 'Não informado'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Home className="text-gray-400" />
                                    {colaborator.address || 'Não informado'}
                                </p>
                            </div>
                        </div>

                        {/* Informações Profissionais */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-[#e67f00]">Informações Profissionais</h4>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Work className="text-gray-400" />
                                    Função: {colaborator.function}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <AttachMoney className="text-gray-400" />
                                    Salário: {formatCurrency(colaborator.salary)}
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <EmojiEvents className="text-gray-400" />
                                    Level: {colaborator.level} ({colaborator.experience} XP)
                                </p>
                                <p className="flex items-center gap-2 text-gray-300">
                                    <Badge className="text-gray-400" />
                                    Rank: {colaborator.rankPosition}
                                </p>
                                <p className="text-gray-300">
                                    <span className="block text-sm text-gray-400">Criado em:</span>
                                    {formatDate(colaborator.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contrato de Trabalho */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#e67f00]">Contrato de Trabalho</h4>
                        <div className="bg-white/5 rounded-lg p-4 h-[40vh] overflow-y-auto">
                            <div 
                                className="whitespace-pre-wrap text-white"
                                dangerouslySetInnerHTML={{ 
                                    __html: contractTemplate.template(colaborator)
                                }} 
                            />
                        </div>
                    </div>

                    {/* Seção de Documentos */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Documentos</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-[#133785] hover:bg-[#1e4caf] 
                                    transition-colors rounded-lg text-white"
                            >
                                <Print />
                                Imprimir Documentos
                            </button>
                            <span className="text-sm text-gray-400">
                                Inclui Contrato de Trabalho e Termo de Confidencialidade
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ColaboratorDetails;