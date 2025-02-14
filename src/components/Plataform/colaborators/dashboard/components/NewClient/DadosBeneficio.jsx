import React from 'react';
import { CalendarMonth } from '@mui/icons-material';

const DadosBeneficio = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
            Dados do Benefício
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <Label text="Tipo de Cliente" required={false} />
                <select
                    name="clientType"
                    value={formData.clientType}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                    <option value="">Selecione o tipo</option>
                    {clientTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div>
                <Label text="Matrícula do Benefício" required={false} />
                <input
                    type="text"
                    name="matriculaBeneficio"
                    placeholder="Matrícula do Benefício (opcional)"
                    value={formData.matriculaBeneficio}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Código da Espécie" required={false} />
                <input
                    type="text"
                    name="especieCode"
                    placeholder="Código da Espécie (opcional)"
                    value={formData.especieCode}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Renda Mensal" required={false} />
                <input
                    type="number"
                    name="financialIncome"
                    placeholder="Renda Mensal (opcional)"
                    value={formData.financialIncome}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Número da Conta" required={false} />
                <input
                    type="text"
                    name="accountNumber"
                    placeholder="Número da Conta (opcional)"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Senha do INSS" required={false} />
                <input
                    type="password"
                    name="inssPassword"
                    placeholder="Senha do INSS (opcional)"
                    value={formData.inssPassword}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Data de Início do Benefício | DDB" required={false} />
                <div className="relative">
                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        name="DDB"
                        value={formData.DDB}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                          rounded-lg text-white focus:border-[#133785] outline-none"
                    />
                </div>
            </div>
        </div>
    </div>
);

export default DadosBeneficio;