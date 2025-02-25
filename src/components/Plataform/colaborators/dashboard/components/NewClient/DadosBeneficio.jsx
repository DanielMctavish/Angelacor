import React from 'react';
import { AttachMoney } from '@mui/icons-material';

function DadosBeneficio({ formData, handleChange }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#e67f00]/10 flex items-center justify-center">
                    <AttachMoney className="text-[#e67f00]" />
                </div>
                <h2 className="text-xl font-bold text-white">Dados do Benefício</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="benefitNumber" className="block text-sm font-medium text-gray-300 mb-1">
                        Número do Benefício
                    </label>
                    <input
                        type="text"
                        id="benefitNumber"
                        name="benefitNumber"
                        value={formData.benefitNumber || ''}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                            focus:outline-none focus:border-[#e67f00] transition-colors"
                        placeholder="Digite o número do benefício"
                    />
                </div>

                <div>
                    <label htmlFor="benefitType" className="block text-sm font-medium text-gray-300 mb-1">
                        Tipo de Benefício
                    </label>
                    <select
                        id="benefitType"
                        name="benefitType"
                        value={formData.benefitType || ''}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                            focus:outline-none focus:border-[#e67f00] transition-colors"
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="aposentadoria">Aposentadoria</option>
                        <option value="pensao">Pensão</option>
                        <option value="auxilio">Auxílio</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="benefitValue" className="block text-sm font-medium text-gray-300 mb-1">
                        Valor do Benefício
                    </label>
                    <input
                        type="number"
                        id="benefitValue"
                        name="benefitValue"
                        value={formData.benefitValue || ''}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                            focus:outline-none focus:border-[#e67f00] transition-colors"
                        placeholder="Digite o valor"
                    />
                </div>
            </div>
        </div>
    );
}

export default DadosBeneficio;