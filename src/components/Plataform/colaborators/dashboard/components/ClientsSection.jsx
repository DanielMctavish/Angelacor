import { motion, AnimatePresence } from 'framer-motion';
import ClientCard from './ClientCard';

function ClientsSection({ displayedClients, progressSteps, stepDescriptions, onClientUpdate }) {
    return (
        <div className="w-full space-y-6">
            <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedClients.map((client, index) => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ClientCard
                                client={client}
                                progressSteps={progressSteps}
                                stepDescriptions={stepDescriptions}
                                onPhotoUpdate={(updatedClient) => {
                                    if (onClientUpdate) {
                                        onClientUpdate(updatedClient);
                                    }
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}

export default ClientsSection; 