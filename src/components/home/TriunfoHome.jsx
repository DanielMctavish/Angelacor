import Navigation from './sections/Navigation.jsx';
import HeroSection from './sections/HeroSection.jsx';
import RatesSection from './sections/RatesSection.jsx';
import WhyChooseSection from './sections/WhyChooseSection.jsx';
import Footer from './sections/Footer.jsx';

function TriunfoHome() {
    return (
        <div className="flex flex-col items-center text-[#909090] justify-start h-auto w-full">
            <Navigation />
            <HeroSection />
            <RatesSection />
            <WhyChooseSection />
            <Footer />
        </div>
    );
}

export default TriunfoHome;