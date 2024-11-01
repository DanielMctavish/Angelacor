import { ArrowForward } from '@mui/icons-material';
import angela from "../../../medias/angela.png"

function HeroSection() {
    return (
        <section className="w-full min-h-[calc(100vh-100px)] flex justify-center bg-[#f1f1f1] relative overflow-hidden py-8 md:py-0">
            <div className="w-full max-w-[1200px] flex flex-col md:flex-row justify-center items-center gap-8 px-4">
                <div className="flex flex-col items-center md:items-start gap-6 md:gap-8 md:w-1/2 z-10">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <span className="text-[#e67f00] font-semibold text-lg md:text-xl">Crédito Inteligente</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#133785] leading-tight">
                            Simule seu empréstimo <br />
                            <span className="text-[#e67f00]">100% online</span>
                        </h1>
                    </div>

                    <div className="md:hidden relative w-full h-[300px] my-4">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                            w-[300px] h-[300px] rounded-full bg-[#133785] z-0"></div>
                        <img
                            src={angela}
                            alt="Angela consultora"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                                h-[350px] object-contain z-10"
                        />
                    </div>

                    <div className="flex flex-col gap-4 max-w-[500px] px-4 md:px-0">
                        <span className="text-lg md:text-xl text-center md:text-left text-[#272727]">
                            Crédito 100% seguro e eficiente, sem burocracias e com as melhores taxas.
                        </span>
                        <ul className="text-[#505050] space-y-2 text-sm md:text-base">
                            <li className="flex items-center gap-2">
                                <ArrowForward className="text-[#133785]" /> Aprovação em até 24 horas
                            </li>
                            <li className="flex items-center gap-2">
                                <ArrowForward className="text-[#133785]" /> Taxas a partir de 1,99% ao mês
                            </li>
                            <li className="flex items-center gap-2">
                                <ArrowForward className="text-[#133785]" /> Parcelas que cabem no seu bolso
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <button className="bg-[#133785] text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold
                            hover:bg-[#133785]/90 transition-all hover:scale-105 flex items-center justify-center gap-2">
                            Quero um empréstimo
                            <ArrowForward />
                        </button>
                        <button className="border-2 border-[#0049e6] text-[#0049e6] px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold
                            hover:bg-[#e67f00] hover:border-[#e67f00] hover:text-white transition-all hover:scale-105">
                            Saiba mais
                        </button>
                    </div>
                </div>

                <div className="hidden md:block md:w-1/2 relative h-full">
                    <div className="absolute right-[4vh] top-[18%] 
                        min-w-[400px] h-[400px] rounded-full z-0 bg-[#133785]"></div>
                    <div className="absolute right-[4vh] top-[38%] 
                        min-w-[600px] h-[600px] rounded-full z-0 bg-[#133785]"></div>

                    <img
                        src={angela}
                        alt="Angela consultora"
                        className="absolute right-0 top-[70%] translate-y-[-50%] h-[90vh] object-contain z-10"
                    />
                </div>
            </div>
        </section>
    );
}

export default HeroSection; 