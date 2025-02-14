import React from 'react';

const DadosContato = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
            Dados de Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label text="Email" required={true} />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    required
                />
            </div>
            <div>
                <Label text="Telefone" required={true} />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    required
                />
            </div>
            <div className="md:col-span-2">
                <Label text="Endereço Completo" required={false} />
                <input
                    type="text"
                    name="address"
                    placeholder="Endereço Completo (opcional)"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
        </div>
    </div>
);

export default DadosContato;