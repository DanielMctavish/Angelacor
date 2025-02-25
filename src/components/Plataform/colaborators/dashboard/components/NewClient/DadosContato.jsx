import React from 'react';
import { Phone } from '@mui/icons-material';

function DadosContato({ formData, handleChange, errors }) {
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
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    required
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white 
                        focus:outline-none focus:border-[#e67f00] transition-colors
                        ${errors?.phone ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="Digite o telefone"
                />
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