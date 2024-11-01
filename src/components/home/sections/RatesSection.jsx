import { useEffect } from 'react';
import { AttachMoney, Speed, Security,WhatsApp } from '@mui/icons-material';

function RatesSection() {
    useEffect(() => {
        const handleScroll = () => {
            const graphElement = document.querySelector('.graph-section');
            if (!graphElement) return;

            const graphPosition = graphElement.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            if (graphPosition < screenHeight * 0.8 && graphPosition > -screenHeight * 0.2) {
                const bars = document.querySelectorAll('.graph-bar');
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.height = bar.dataset.height;
                    }, index * 200);
                });
            } else {
                const bars = document.querySelectorAll('.graph-bar');
                bars.forEach(bar => {
                    bar.style.height = '0px';
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="w-full py-8 md:py-16 bg-white">
            <div className="w-full max-w-[1200px] mx-auto px-4">
                <div className="bg-[#133785] text-white rounded-[20px] md:rounded-[40px] flex flex-col gap-8 md:gap-12 p-6 md:p-12">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold  mb-4">
                            A melhor experiência de crédito, com as melhores taxas
                        </h2>
                        <p className="text-[#d2d2d2] max-w-[700px] mx-auto text-sm md:text-base">
                            Compare e comprove: oferecemos as taxas mais competitivas do mercado, 
                            com total transparência e sem custos escondidos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg graph-section">
                            <h3 className="text-xl font-semibold  mb-6">
                                Comparativo de Taxas
                            </h3>
                            <div className="flex items-end gap-4 h-[300px] mb-4">
                                <div className="flex flex-col items-center gap-2 w-1/3">
                                    <div
                                        className="graph-bar bg-[#e67f00] w-full rounded-t-lg h-0 transition-all duration-700"
                                        data-height="120px"
                                    >
                                        <div className="text-white text-center pt-2 font-semibold">1,99%</div>
                                    </div>
                                    <span className="text-sm text-[#505050] font-medium">Triunfo</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 w-1/3">
                                    <div
                                        className="graph-bar bg-[#ffa230] w-full rounded-t-lg h-0 transition-all duration-700"
                                        data-height="180px"
                                    >
                                        <div className="text-[#1e1e1e] text-center pt-2 font-semibold">3,50%</div>
                                    </div>
                                    <span className="text-sm text-[#505050] font-medium">Bancos</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 w-1/3">
                                    <div
                                        className="graph-bar bg-[#ffbf71] w-full rounded-t-lg h-0 transition-all duration-700"
                                        data-height="280px"
                                    >
                                        <div className="text-[#1e1e1e] text-center pt-2 font-semibold">5,99%</div>
                                    </div>
                                    <span className="text-sm text-[#505050] font-medium">Outros</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 md:gap-6">
                            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <AttachMoney className="text-[#e67f00] text-4xl" />
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1e1e1e]">
                                            Taxas a partir de 1,99% ao mês
                                        </h4>
                                        <p className="text-[#505050]">
                                            As menores taxas do mercado, com parcelas que cabem no seu bolso
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <Speed className="text-[#e67f00] text-4xl" />
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1e1e1e]">
                                            Aprovação em 24h
                                        </h4>
                                        <p className="text-[#505050]">
                                            Processo 100% digital, rápido e sem burocracia
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <Security className="text-[#e67f00] text-4xl" />
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1e1e1e]">
                                            Simulação Gratuita
                                        </h4>
                                        <p className="text-[#505050]">
                                            Faça sua simulação sem compromisso e descubra as melhores condições
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full md:w-auto border-2 border-white px-4 md:px-6 py-2 rounded-full text-[#fff] 
                            hover:bg-white hover:text-[#e67f00] transition-colors flex items-center justify-center gap-2">
                                <WhatsApp /> Fale Conosco
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RatesSection; 