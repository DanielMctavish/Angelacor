import { Security, Speed, Support, AttachMoney } from '@mui/icons-material';

function WhyChooseSection() {
    return (
        <section className="w-full py-8 md:py-16 bg-white">
            <div className="w-full max-w-[1200px] mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] text-center mb-8 md:mb-16">
                    Por que escolher a Triunfo?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <div className="flex flex-col items-center text-center p-6">
                        <img 
                            src="https://i.pinimg.com/originals/66/cb/6a/66cb6a5c9fdac14a2c33e398ed21e723.png"
                            alt="Família feliz"
                            className="w-[200px] h-[200px] object-contain mb-6"
                        />
                        <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                            Crédito para Realizar Sonhos
                        </h3>
                        <p className="text-[#505050]">
                            Ajudamos famílias a conquistarem seus objetivos com as melhores condições do mercado.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png"
                            alt="Cartão de crédito"
                            className="w-[200px] h-[200px] object-contain mb-6"
                        />
                        <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                            Processo 100% Digital
                        </h3>
                        <p className="text-[#505050]">
                            Faça tudo online, de forma rápida e segura, sem precisar sair de casa.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <img 
                            src="https://odontologiamonet.com.br/wp-content/uploads/2021/08/pretty-beautiful-woman-with-blonde-long-hair-having-excited-happy-facial-expression.png"
                            alt="Cliente satisfeita"
                            className="w-[200px] h-[200px] object-contain mb-6"
                        />
                        <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                            Clientes Satisfeitos
                        </h3>
                        <p className="text-[#505050]">
                            Milhares de clientes já realizaram seus sonhos com a Triunfo.
                            Junte-se a eles!
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-[200px] h-[200px] flex items-center justify-center mb-6">
                            <AttachMoney sx={{ fontSize: 100 }} className="text-[#e67f00]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                            Melhores Taxas
                        </h3>
                        <p className="text-[#505050]">
                            Taxas competitivas e parcelas que cabem no seu orçamento.
                            Simulação gratuita e sem compromisso.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseSection; 