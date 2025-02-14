import React from 'react';

const SenhaAcesso = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
            Senha de Acesso
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label text="Senha" required={true} />
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    required
                />
            </div>
        </div>
    </div>
);

export default SenhaAcesso;