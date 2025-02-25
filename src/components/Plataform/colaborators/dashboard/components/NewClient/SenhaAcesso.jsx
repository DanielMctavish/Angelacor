import React from 'react';
import { Lock } from '@mui/icons-material';

function SenhaAcesso({ formData, handleChange, errors }) {
    return (
        <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Lock />
                Senha de Acesso
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                        Senha
                        <span className="text-[#e67f00]">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Digite a senha"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 bg-[#272727] border rounded-lg 
                                focus:border-[#133785] outline-none text-white placeholder:text-gray-500
                                ${errors.password ? 'border-red-500' : 'border-[#e67f00]/20'}`}
                        />
                    </div>
                    {errors.password && (
                        <span className="text-xs text-red-500">{errors.password}</span>
                    )}
                </div>
            </div>
        </section>
    );
}

export default SenhaAcesso;