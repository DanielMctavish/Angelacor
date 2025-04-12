import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Person, 
    Assignment, 
    Message, 
    Star, 
    TrendingUp,
    ArrowUpward,
    ArrowDownward,
    Add,
    Search,
    Chat,
    Groups,
    AccountBalance,
    Analytics
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './Navigation/AdminNavbar';
import logoAngelCor from "../../../medias/logos/angelcor_logo.png";
import axios from 'axios';
import XpSystem from '../XP/XpLevels';
import { Pie, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';

// Registrando os elementos necessários do Chart.js
ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

function AdminAnalytics() {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [colaboradores, setColaboradores] = useState([]);
    const [clientes, setClientes] = useState([]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminData = JSON.parse(localStorage.getItem('adminToken'));
                if (!adminData?.token) {
                    throw new Error('Token não encontrado');
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                };

                // Buscar colaboradores
                const colaboradoresResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/colaborator/list`,
                    config
                );


                // Buscar clientes
                const clientesResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/client/find-all`,
                    config
                );


                // Processar dados dos colaboradores com informações de nível
                const colaboradoresProcessados = colaboradoresResponse.data.map(colab => {
                    const levelInfo = XpSystem.getCurrentLevel(colab.experience);
                    return {
                        ...colab,
                        levelInfo,
                        totalPropostas: colab.proposals?.length || 0,
                        propostasAprovadas: colab.proposals?.filter(p => p.contractStatus === 'aprovado').length || 0
                    };
                });

                // Ordenar clientes pelo mais recente
                const sortedClients = (clientesResponse.data || []).sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setColaboradores(colaboradoresProcessados);
                setClientes(sortedClients);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar dados');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Cálculos para os cards
    const dadosCalculados = {
        totalColaboradores: colaboradores.length,
        colaboradoresComProposta: colaboradores.filter(c => (c.proposals?.length || 0) > 0).length,
        colaboradoresSemProposta: colaboradores.filter(c => !c.proposals?.length).length,
        totalPropostas: colaboradores.reduce((acc, c) => acc + (c.proposals?.length || 0), 0),
        propostasAprovadas: colaboradores.reduce((acc, c) => 
            acc + (c.proposals?.filter(p => p.contractStatus === 'aprovado').length || 0), 0
        ),
        totalClientes: clientes.length,
        clientesSemPropostas: clientes.filter(c => !c.proposals?.length).length,
        clientesComPropostas: clientes.filter(c => c.proposals?.length > 0).length,
        clientesComPropostasAprovadas: clientes.filter(c => 
            c.proposals?.some(p => p.contractStatus === 'aprovado')
        ).length
    };

    // Top colaboradores ordenados por nível e propostas
    const topColaboradores = [...colaboradores]
        .sort((a, b) => {
            if (b.levelInfo.level !== a.levelInfo.level) return b.levelInfo.level - a.levelInfo.level;
            return b.propostasAprovadas - a.propostasAprovadas;
        })
        .slice(0, 4);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AdminNavbar logo={logoAngelCor} area="Métricas e Análises" />
            </motion.div>

            <main className="max-w-[1200px] mx-auto p-4 space-y-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <button
                            onClick={() => navigate('/plataforma')}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base text-white"
                        >
                            <AccountBalance />
                            Dashboard Principal
                        </button>
                        <button
                            onClick={() => navigate('/plataforma/colaboradores')}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base text-white"
                        >
                            <Groups />
                            Area de Colaboradores
                        </button>
                        <button
                            onClick={toggleChat}
                            className={`w-full md:w-auto flex items-center justify-center gap-2 
                            ${isChatOpen ? 'bg-[#e67f00]' : 'bg-[#1f1f1f] hover:bg-[#e67f00]'} px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base text-white`}
                        >
                            <Chat />
                            Observações
                        </button>
                    </div>

                    {/* Filtros de Período */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Dashboard de Métricas</h1>
                        <div className="flex gap-2">
                            {['week', 'month', 'year'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${selectedPeriod === period 
                                            ? 'bg-[#e67f00] text-white' 
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                                >
                                    {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Status dos Colaboradores - Agora com dados reais e gráfico de barras */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Status dos Colaboradores</h3>
                                <p className="text-sm text-gray-400">Distribuição de propostas</p>
                            </div>
                            <div className="p-2 bg-[#e67f00]/20 rounded-lg">
                                <Person className="text-[#e67f00]" />
                            </div>
                        </div>
                        
                        {/* Gráfico de barras com dados reais */}
                        <div className="relative pt-4">
                            {dadosCalculados.totalColaboradores > 0 ? (
                                <>
                                    <div className="h-[200px] mx-auto">
                                        <Bar 
                                            data={{
                                                labels: ['Com Propostas', 'Sem Propostas'],
                                                datasets: [
                                                    {
                                                        label: 'Colaboradores',
                                                        data: [
                                                            dadosCalculados.colaboradoresComProposta,
                                                            dadosCalculados.colaboradoresSemProposta
                                                        ],
                                                        backgroundColor: [
                                                            'rgba(75, 192, 192, 0.7)',  // Turquesa para com propostas
                                                            'rgba(255, 99, 132, 0.7)'   // Rosa para sem propostas
                                                        ],
                                                        borderColor: [
                                                            'rgba(255, 255, 255, 0.8)',
                                                            'rgba(255, 255, 255, 0.8)'
                                                        ],
                                                        borderWidth: 2,
                                                        borderRadius: 8,
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                indexAxis: 'y',  // Barras horizontais
                                                layout: {
                                                    padding: 10
                                                },
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            color: 'rgba(255, 255, 255, 0.1)'
                                                        },
                                                        ticks: {
                                                            color: 'rgba(255, 255, 255, 0.7)'
                                                        }
                                                    },
                                                    y: {
                                                        grid: {
                                                            display: false
                                                        },
                                                        ticks: {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            font: {
                                                                weight: 'bold'
                                                            }
                                                        }
                                                    }
                                                },
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                        padding: 12,
                                                        callbacks: {
                                                            label: function(context) {
                                                                const value = context.raw;
                                                                const total = dadosCalculados.totalColaboradores;
                                                                const percentage = Math.round((value / total) * 100);
                                                                return `${value} colaboradores (${percentage}%)`;
                                                            }
                                                        }
                                                    }
                                                },
                                                animation: {
                                                    duration: 1500,
                                                    easing: 'easeOutQuart'
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Detalhamento Abaixo do Gráfico */}
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="grid grid-cols-2 gap-2 text-center">
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgba(75, 192, 192, 0.7)'}}></div>
                                                    <span className="text-sm text-gray-300">Com Propostas</span>
                                                </div>
                                                <p className="text-lg font-bold text-white">
                                                    {dadosCalculados.colaboradoresComProposta} 
                                                    <span className="text-sm text-gray-400 ml-1">
                                                        ({Math.round((dadosCalculados.colaboradoresComProposta / dadosCalculados.totalColaboradores) * 100)}%)
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgba(255, 99, 132, 0.7)'}}></div>
                                                    <span className="text-sm text-gray-300">Sem Propostas</span>
                                                </div>
                                                <p className="text-lg font-bold text-white">
                                                    {dadosCalculados.colaboradoresSemProposta}
                                                    <span className="text-sm text-gray-400 ml-1">
                                                        ({Math.round((dadosCalculados.colaboradoresSemProposta / dadosCalculados.totalColaboradores) * 100)}%)
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center">
                                    <p className="text-gray-400">Nenhum dado disponível</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Card 2: Status dos Clientes - Agora com gráfico de pizza do Chart.js */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Status dos Clientes</h3>
                                <p className="text-sm text-gray-400">Distribuição de propostas</p>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Assignment className="text-blue-500" />
                            </div>
                        </div>

                        {/* Gráfico de Pizza com Chart.js */}
                        <div className="relative pt-4">
                            {dadosCalculados.totalClientes > 0 ? (
                                <>
                                    <div className="h-[200px] mx-auto">
                                        <Pie 
                                            data={{
                                                labels: ['Sem Propostas', 'Com Propostas', 'Propostas Aprovadas'],
                                                datasets: [
                                                    {
                                                        label: 'Clientes',
                                                        data: [
                                                            dadosCalculados.clientesSemPropostas,
                                                            dadosCalculados.clientesComPropostas - dadosCalculados.clientesComPropostasAprovadas,
                                                            dadosCalculados.clientesComPropostasAprovadas
                                                        ],
                                                        backgroundColor: [
                                                            'rgba(255, 99, 132, 0.7)',   // Rosa claro para sem propostas
                                                            'rgba(255, 206, 86, 0.7)',   // Amarelo claro para com propostas
                                                            'rgba(75, 192, 192, 0.7)'    // Turquesa claro para aprovadas
                                                        ],
                                                        borderColor: [
                                                            'rgba(255, 255, 255, 0.8)',
                                                            'rgba(255, 255, 255, 0.8)',
                                                            'rgba(255, 255, 255, 0.8)'
                                                        ],
                                                        borderWidth: 2,
                                                        hoverOffset: 10,
                                                        hoverBorderWidth: 3,
                                                        spacing: 5,
                                                        cutout: '5%'
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                layout: {
                                                    padding: 10
                                                },
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                        padding: 12,
                                                        bodyFont: {
                                                            size: 14
                                                        },
                                                        titleFont: {
                                                            size: 16,
                                                            weight: 'bold'
                                                        },
                                                        callbacks: {
                                                            label: function(context) {
                                                                const value = context.raw;
                                                                const percentage = Math.round((value / dadosCalculados.totalClientes) * 100);
                                                                return `${context.label}: ${value} clientes (${percentage}%)`;
                                                            }
                                                        }
                                                    }
                                                },
                                                animation: {
                                                    animateScale: true,
                                                    animateRotate: true,
                                                    duration: 1500
                                                },
                                                elements: {
                                                    arc: {
                                                        borderWidth: 2,
                                                        borderColor: 'rgba(255, 255, 255, 0.8)'
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Detalhamento Abaixo do Gráfico */}
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <h4 className="text-sm font-medium text-white mb-2">Detalhamento:</h4>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgba(255, 99, 132, 0.7)'}}></div>
                                                    <span className="text-sm text-gray-300">Clientes Totais</span>
                                                </div>
                                                <p className="text-lg font-bold text-white">
                                                    {dadosCalculados.totalClientes}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgba(255, 206, 86, 0.7)'}}></div>
                                                    <span className="text-sm text-gray-300">Com Propostas</span>
                                                </div>
                                                <p className="text-lg font-bold text-yellow-400">
                                                    {dadosCalculados.clientesComPropostas}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgba(75, 192, 192, 0.7)'}}></div>
                                                    <span className="text-sm text-gray-300">Aprovadas</span>
                                                </div>
                                                <p className="text-lg font-bold text-green-400">
                                                    {dadosCalculados.clientesComPropostasAprovadas}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center">
                                    <p className="text-gray-400">Nenhum dado disponível</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Card 3: Top Colaboradores - Agora com dados reais */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Top Colaboradores</h3>
                                <p className="text-sm text-gray-400">Por nível e propostas aprovadas</p>
                            </div>
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Star className="text-green-500" />
                            </div>
                        </div>

                        {/* Lista de Top Colaboradores */}
                        <div className="space-y-4">
                            {topColaboradores.map((colab, index) => (
                                <div key={colab._id || index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                            {colab.url_profile_cover ? (
                                                <img
                                                    src={colab.url_profile_cover}
                                                    alt={colab.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Person className="text-gray-400 text-sm" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white">{colab.name}</span>
                                            <span className="text-xs text-gray-400">Nível {colab.levelInfo.level}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">{colab.totalPropostas}</span>
                                        <span className="text-xs text-[#e67f00]">propostas</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Card 4: Gerentes Mais Ativos */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Gerentes Mais Ativos</h3>
                                <p className="text-sm text-gray-400">Por aprovação de propostas</p>
                            </div>
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <TrendingUp className="text-purple-500" />
                            </div>
                        </div>

                        {/* Lista de Gerentes */}
                        <div className="space-y-4">
                            {[
                                { name: "Carlos Mendes", count: 25, percentage: 85 },
                                { name: "Lucia Ferreira", count: 18, percentage: 75 },
                                { name: "Roberto Alves", count: 15, percentage: 65 },
                            ].map((manager, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white">{manager.name}</span>
                                        <span className="text-sm text-gray-400">{manager.count} aprovações</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${manager.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Card 5: Status das Propostas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Status das Propostas</h3>
                                <p className="text-sm text-gray-400">Aprovadas vs Pendentes</p>
                            </div>
                            <div className="p-2 bg-[#e67f00]/20 rounded-lg">
                                <Assignment className="text-[#e67f00]" />
                            </div>
                        </div>

                        {/* Gráfico Circular Mockado */}
                        <div className="relative w-full aspect-square">
                            <div className="absolute inset-0 rounded-full border-8 border-green-500/50" />
                            <div className="absolute inset-0 rounded-full border-8 border-yellow-500/50 
                                border-t-transparent border-r-transparent border-b-transparent" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-white">65%</span>
                                    <p className="text-sm text-gray-400">Aprovadas</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 6: Interações em Propostas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Interações em Propostas</h3>
                                <p className="text-sm text-gray-400">Top propostas por mensagens</p>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Message className="text-blue-500" />
                            </div>
                        </div>

                        {/* Lista de Propostas com Mais Interações */}
                        <div className="space-y-4">
                            {[
                                { id: "P001", messages: 45, client: "João da Silva" },
                                { id: "P002", messages: 38, client: "Maria Santos" },
                                { id: "P003", messages: 32, client: "Pedro Costa" },
                                { id: "P004", messages: 28, client: "Ana Oliveira" },
                            ].map((proposal, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-white font-medium">Proposta #{proposal.id}</h4>
                                            <p className="text-sm text-gray-400">{proposal.client}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-400">
                                            <Message className="text-sm" />
                                            <span className="text-sm">{proposal.messages}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default AdminAnalytics;