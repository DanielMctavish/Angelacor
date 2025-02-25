import React from 'react';
import { Badge, CalendarMonth, Person } from '@mui/icons-material';

const DadosPessoais = ({ formData, handleChange, errors }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#e67f00]/10 flex items-center justify-center">
                <Person className="text-[#e67f00]" />
            </div>
            <h2 className="text-xl font-bold text-white">Dados Pessoais</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2 text-white 
                        focus:outline-none focus:border-[#e67f00] transition-colors
                        ${errors?.name ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="Digite o nome completo"
                />
                {errors?.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
            </div>
            <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-1">
                    CPF <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf || ''}
                        onChange={handleChange}
                        maxLength={14}
                        required
                        className={`w-full pl-10 pr-4 py-2 bg-[#272727] border rounded-lg 
                          outline-none text-white placeholder:text-gray-500
                          ${errors?.cpf ? 'border-red-500' : 'border-gray-700 focus:border-[#133785]'}`}
                    />
                    {errors?.cpf && (
                        <span className="text-xs text-red-500 mt-1">{errors.cpf}</span>
                    )}
                </div>
            </div>
            <div>
                <label htmlFor="rg" className="block text-sm font-medium text-gray-300 mb-1">
                    RG
                </label>
                <div className="relative">
                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        id="rg"
                        name="rg"
                        value={formData.rg || ''}
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
                <label htmlFor="expeditionDate" className="block text-sm font-medium text-gray-300 mb-1">
                    Data de Expedição do RG
                </label>
                <div className="relative">
                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        id="expeditionDate"
                        name="expeditionDate"
                        value={formData.expeditionDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                          rounded-lg text-white focus:border-[#133785] outline-none"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-1">
                    Data de Nascimento
                </label>
                <div className="relative">
                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                          rounded-lg text-white focus:border-[#133785] outline-none"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-300 mb-1">
                    Sexo
                </label>
                <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                    <option value="">Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
            <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome do Pai
                </label>
                <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
            </div>
            <div>
                <label htmlFor="motherName" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome da Mãe
                </label>
                <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
            </div>
            <div>
                <label htmlFor="naturalness" className="block text-sm font-medium text-gray-300 mb-1">
                    Naturalidade
                </label>
                <input
                    type="text"
                    id="naturalness"
                    name="naturalness"
                    value={formData.naturalness}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
            </div>
        </div>
    </div>
);

export default DadosPessoais;