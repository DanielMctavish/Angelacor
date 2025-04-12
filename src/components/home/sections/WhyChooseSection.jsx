import { Security, Speed, Support, AttachMoney, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

function WhyChooseSection() {
    return (
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-[1200px] mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[#e67f00] font-semibold text-lg mb-4 block"
                    >
                        Por que nos escolher?
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-6"
                    >
                        Sua melhor escolha em crédito consignado
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-600 max-w-2xl mx-auto text-lg"
                    >
                        Combinamos tecnologia e experiência para oferecer as melhores soluções financeiras, 
                        com agilidade, segurança e taxas competitivas.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <img 
                                src="https://i.pinimg.com/originals/66/cb/6a/66cb6a5c9fdac14a2c33e398ed21e723.png"
                                alt="Família feliz"
                                className="w-[200px] h-[200px] object-contain relative z-10 mx-auto"
                            />
                        </div>
                        <h3 className="text-2xl font-semibold text-[#133785] mb-4">
                            Realizando Sonhos
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Há mais de uma década, ajudamos milhares de famílias a conquistarem seus objetivos financeiros. 
                            Oferecemos as melhores condições do mercado, com transparência e compromisso.
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Atendimento personalizado
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Análise de crédito rápida
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-orange-500/10 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png"
                                alt="Cartão de crédito"
                                className="w-[200px] h-[200px] object-contain relative z-10 mx-auto"
                            />
                        </div>
                        <h3 className="text-2xl font-semibold text-[#133785] mb-4">
                            100% Digital
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Processo totalmente digital e seguro, do início ao fim. Faça sua simulação, 
                            envie seus documentos e assine seu contrato sem sair de casa.
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Assinatura digital
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Documentação online
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-green-500/10 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <img 
                                src="https://odontologiamonet.com.br/wp-content/uploads/2021/08/pretty-beautiful-woman-with-blonde-long-hair-having-excited-happy-facial-expression.png"
                                alt="Cliente satisfeita"
                                className="w-[200px] h-[200px] object-contain relative z-10 mx-auto"
                            />
                        </div>
                        <h3 className="text-2xl font-semibold text-[#133785] mb-4">
                            Satisfação Garantida
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Nossa maior conquista é a satisfação dos nossos clientes. São milhares de histórias 
                            de sucesso e sonhos realizados através dos nossos serviços.
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Avaliação positiva
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Clientes fidelizados
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-purple-500/10 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <div className="w-[200px] h-[200px] flex items-center justify-center relative z-10 mx-auto">
                                <AttachMoney sx={{ fontSize: 100 }} className="text-[#e67f00]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-[#133785] mb-4">
                            Melhores Condições
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Oferecemos as taxas mais competitivas do mercado e parcelas que se encaixam 
                            perfeitamente no seu orçamento. Faça uma simulação gratuita agora mesmo.
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Taxas a partir de 1,99%
                            </li>
                            <li className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="text-green-500" /> Parcelas flexíveis
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseSection; 