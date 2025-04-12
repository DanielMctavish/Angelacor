import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';
import Navigation from './sections/Navigation.jsx';
import HeroSection from './sections/HeroSection.jsx';
import RatesSection from './sections/RatesSection.jsx';
import WhyChooseSection from './sections/WhyChooseSection.jsx';
import Footer from './sections/Footer.jsx';
import Privacy from './sections/Privacy.jsx';

function TriunfoHome() {
    const [showPrivacyBar, setShowPrivacyBar] = useState(false);

    useEffect(() => {
        // Verifica se o usuário já aceitou os termos
        const hasAcceptedTerms = localStorage.getItem('acceptedTerms');
        if (!hasAcceptedTerms) {
            setShowPrivacyBar(true);
        }
    }, []);

    const handleAcceptTerms = () => {
        localStorage.setItem('acceptedTerms', 'true');
        setShowPrivacyBar(false);
    };

    return (
        <div className="flex flex-col items-center text-[#909090] justify-start h-auto w-full">
            <AnimatePresence>
                {showPrivacyBar && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="fixed bottom-0 left-0 right-0 bg-[#133785] text-white z-50 shadow-lg"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <span>
                                    Este site utiliza cookies e dados pessoais de acordo com nossos{' '}
                                    <Privacy />
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleAcceptTerms}
                                    className="px-4 py-1.5 bg-[#e67f00] hover:bg-[#ff8c00] 
                                        rounded-lg text-sm transition-colors"
                                >
                                    entendi
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Navigation />
            <HeroSection />
            <RatesSection />
            <WhyChooseSection />
            <Footer />
        </div>
    );
}

export default TriunfoHome;