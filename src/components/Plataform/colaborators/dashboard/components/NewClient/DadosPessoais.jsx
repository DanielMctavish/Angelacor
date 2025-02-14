import React from 'react';
import { Badge, CalendarMonth } from '@mui/icons-material';

const DadosPessoais = ({ formData, handleChange, errors }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
            Dados Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <Label text="Nome Completo" required={true} />
                <input
                    type="text"
                    name="name"
                    placeholder="Nome Completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    required
                />
            </div>
            <div>
                <Label text="CPF" required={true} />
                <div className="relative">
                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="cpf"
                        placeholder="Digite o CPF"
                        value={formData.cpf}
                        onChange={handleChange}
                        maxLength={14}
                        className={`w-full pl-10 pr-4 py-2 bg-[#272727] border rounded-lg 
                          outline-none text-white placeholder:text-gray-500
                          ${errors.cpf ? 'border-red-500' : 'border-gray-700 focus:border-[#133785]'}`}
                        required
                    />
                    {errors.cpf && (
                        <span className="text-xs text-red-500 mt-1">{errors.cpf}</span>
                    )}
                </div>
            </div>
            <div>
                <Label text="RG" required={false} />
                <div className="relative">
                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="rg"
                        placeholder="Digite o RG (opcional)"
                        value={formData.rg}
                        onChange={handleChange}
                        maxLength={12}
                        className={`w-full pl-10 pr-4 py-2 bg-[#272727] border rounded-lg 
                          outline-none text-white placeholder:text-gray-500
                          ${errors.rg ? 'border-red-500' : 'border-gray-700 focus:border-[#133785]'}`}
                    />
                    {errors.rg && (
                        <span className="text-xs text-red-500 mt-1">{errors.rg}</span>
                    )}
                </div>
            </div>
            <div>
                <Label text="Data de Expedição do RG" required={false} />
                <div className="relative">
                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        name="expeditionDate"
                        value={formData.expeditionDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                          rounded-lg text-white focus:border-[#133785] outline-none"
                    />
                </div>
            </div>
            <div>
                <Label text="Data de Nascimento" required={false} />
                <div className="relative">
                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                          rounded-lg text-white focus:border-[#133785] outline-none"
                    />
                </div>
            </div>
            <div>
                <Label text="Sexo" required={false} />
                <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                    <option value="">Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
            <div>
                <Label text="Nome do Pai" required={false} />
                <input
                    type="text"
                    name="fatherName"
                    placeholder="Nome do Pai (opcional)"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Nome da Mãe" required={false} />
                <input
                    type="text"
                    name="motherName"
                    placeholder="Nome da Mãe (opcional)"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
            <div>
                <Label text="Naturalidade" required={false} />
                <input
                    type="text"
                    name="naturalness"
                    placeholder="Naturalidade (opcional)"
                    value={formData.naturalness}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
            </div>
        </div>
    </div>
);

export default DadosPessoais;