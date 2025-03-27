import { ArrowForward } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import angela from "../../../medias/angela.png"
import banner01 from "../../../medias/covers_banner/banner_01.jpeg"
import banner02 from "../../../medias/covers_banner/banner_02.jpeg"
import banner03 from "../../../medias/covers_banner/banner_03.jpeg"
import banner04 from "../../../medias/covers_banner/banner_04.jpeg"
import banner05 from "../../../medias/covers_banner/banner_05.jpeg"
import banner06 from "../../../medias/covers_banner/banner_06.jpeg"
import banner07 from "../../../medias/covers_banner/banner_07.jpeg"

function HeroSection() {
    const banners = [
        { id: 2, image: banner02, alt: "Banner 2" },
        { id: 3, image: banner03, alt: "Banner 3" },
        { id: 4, image: banner04, alt: "Banner 4" },
        { id: 5, image: banner05, alt: "Banner 5" },
        { id: 1, image: banner01, alt: "Banner 1" },
        { id: 6, image: banner06, alt: "Banner 6" },
        { id: 7, image: banner07, alt: "Banner 7" },
    ];

    return (
        <section className="w-full min-h-[120vh] flex flex-col justify-start bg-[#f1f1f1] relative overflow-hidden">
            <div className='w-full h-[300px] md:h-[600px] flex justify-center items-center bg-zinc-100 px-0 mt-[7vh]'>
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                    }}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    speed={800}
                    navigation={{
                        enabled: true,
                        hideOnMobile: true
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="w-full h-full"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <div className='flex w-full h-[300px] md:h-[600px] justify-center bg-zinc-100'>
                                <img
                                    src={banner.image}
                                    alt={banner.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-4 py-12">
                <div className="flex flex-col items-center md:items-start gap-6 md:gap-8 md:w-1/2 z-10">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <span className="text-[#e67f00] font-semibold text-lg md:text-xl">Crédito Inteligente</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#133785] leading-tight">
                            Simule seu empréstimo <br />
                            <span className="text-[#e67f00]">100% online</span>
                        </h1>
                    </div>

                    <div className="md:hidden relative w-full h-[300px] my-4">
                        <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 
                            w-[300px] h-[300px] rounded-full bg-[#133785] z-0"></div>
                        <div className="absolute right-[-30%] top-[-20%] 
                            w-[200px] h-[200px] rounded-full bg-[#133785]/60 z-0"></div>
                        <div className="absolute left-[-25%] bottom-[-20%] 
                            w-[150px] h-[150px] rounded-full bg-[#133785]/40 z-0"></div>
                        <div className="absolute left-[-15%] top-[10%] 
                            w-[100px] h-[100px] rounded-full bg-[#133785]/30 z-0"></div>
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
                    <div className="absolute right-[-12vh] top-[-12vh] 
                        min-w-[200px] h-[200px] rounded-full z-0 bg-[#2054c4]"></div>
                    <div className="absolute right-[-12vh] top-[5vh] 
                        min-w-[400px] h-[400px] rounded-full z-0 bg-[#113177]"></div>
                    <div className="absolute right-[8vh] top-[38%] 
                        min-w-[600px] h-[600px] rounded-full z-0 bg-[#133785]"></div>
                    
                    <div className="absolute left-[-90vh] top-[20vh] 
                        min-w-[300px] h-[300px] rounded-full z-0 bg-[#133785]/60"></div>
                    <div className="absolute left-[-4vh] top-[-32vh] opacity-40
                        min-w-[200px] h-[200px] rounded-full z-0 bg-[#133785]/40"></div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection; 