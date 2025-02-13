import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';

function Privacy() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm text-gray-400 hover:text-[#e67f00] transition-colors"
            >
                Termos de Uso e Privacidade
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Close />
                            </button>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#133785]">
                                    Termos de Uso e Política de Privacidade
                                </h2>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-[#133785]">Termos de Uso</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Ao navegar em nosso site, você concorda com estes Termos de Uso. 
                                        Caso não concorde com algum destes termos, pedimos que não utilize o nosso site. 
                                        Podemos revisar estes termos a qualquer momento, sem aviso prévio. 
                                        A continuidade do uso do site constitui sua aceitação dos termos revisados.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-[#133785]">Política de Privacidade</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Coletamos informações pessoais, como nome, telefone e e-mail, apenas para fins 
                                        de contato e prestação de serviços. Estes dados não serão compartilhados com 
                                        terceiros além do necessário para cumprimento legal ou operacional. Ao utilizar 
                                        nosso site, você concorda com a coleta e uso das informações de acordo com esta política.
                                    </p>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-2 bg-[#133785] text-white rounded-lg 
                                            hover:bg-[#0f2a6b] transition-colors"
                                    >
                                        Entendi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Privacy;