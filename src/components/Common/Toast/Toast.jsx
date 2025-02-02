import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle, Error, Close } from '@mui/icons-material';

let toastId = 1;

const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { 
        opacity: 0, 
        scale: 0.5, 
        transition: { duration: 0.2 } 
    }
};

const ToastIcon = ({ type }) => {
    return type === 'success' ? (
        <CheckCircle className="text-[#e67f00] text-xl" />
    ) : (
        <Error className="text-red-500 text-xl" />
    );
};

export const toast = {
    success: (message) => {
        window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
                id: toastId++,
                type: 'success',
                message,
                duration: 4000
            }
        }));
    },
    error: (message) => {
        window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
                id: toastId++,
                type: 'error',
                message,
                duration: 4000
            }
        }));
    }
};

function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleShowToast = (event) => {
            const newToast = event.detail;
            setToasts(prev => [...prev, newToast]);

            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, newToast.duration);
        };

        window.addEventListener('showToast', handleShowToast);
        return () => window.removeEventListener('showToast', handleShowToast);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        variants={toastVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`
                            flex items-center gap-3 min-w-[300px] max-w-[400px]
                            p-4 rounded-lg shadow-lg backdrop-blur-sm
                            ${toast.type === 'success' 
                                ? 'bg-[#e6e6e6]/95 border border-[#e67f00]/20' 
                                : 'bg-[#e9e9e964]/95 border border-red-500/20'
                            }
                        `}
                    >
                        <ToastIcon type={toast.type} />
                        
                        <div className="flex-1">
                            {typeof toast.message === 'string' ? (
                                <p className="text-white text-sm">{toast.message}</p>
                            ) : (
                                toast.message
                            )}
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Close fontSize="small" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default ToastContainer; 