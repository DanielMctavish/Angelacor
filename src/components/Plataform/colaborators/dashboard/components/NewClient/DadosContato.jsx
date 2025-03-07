import React from 'react';
import { Phone, WhatsApp } from '@mui/icons-material';

// Função para formatar telefone
const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
    } else if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
    }
    return numbers;
};

// Função para validar telefone
const validatePhone = (phone) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
};

// Função para verificar WhatsApp
const checkWhatsApp = async (phone) => {
    const numbers = phone.replace(/\D/g, '');
    if (!validatePhone(numbers)) return false;

    try {
        window.open(`https://wa.me/55${numbers}`, '_blank');
        return true;
    } catch (error) {
        console.error('Erro ao abrir WhatsApp:', error);
        return false;
    }
};

function DadosContato({ formData, handleChange, errors }) {
    // Handler personalizado para o telefone
    const handlePhoneChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (value.length <= 11) {
            const formattedValue = formatPhone(value);
            handleChange({
                target: {
                    name: 'phone',
                    value: formattedValue
                }
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#e67f00]/10 flex items-center justify-center">
                    <Phone className="text-[#e67f00]" />
                </div>
                <h2 className="text-xl font-bold text-white">Dados de Contato</h2>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white 
                        focus:outline-none focus:border-[#e67f00] transition-colors
                        ${errors?.email ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="Digite o email"
                />
                {errors?.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Telefone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handlePhoneChange}
                        required
                        placeholder="(00) 00000-0000"
                        className={`w-full bg-white/5 border rounded-lg pl-4 pr-12 py-2 text-white 
                            focus:outline-none focus:border-[#e67f00] transition-colors
                            ${errors?.phone ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {formData.phone && validatePhone(formData.phone) && (
                        <button
                            type="button"
                            onClick={() => checkWhatsApp(formData.phone)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 
                                hover:text-green-400 transition-colors"
                            title="Verificar WhatsApp"
                        >
                            <WhatsApp />
                        </button>
                    )}
                </div>
                {errors?.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                    Endereço
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                        focus:outline-none focus:border-[#e67f00] transition-colors"
                    placeholder="Digite o endereço (opcional)"
                />
            </div>
        </div>
    );
}

export default DadosContato;