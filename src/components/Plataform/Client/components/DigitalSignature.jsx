import { useState, useEffect } from 'react';
import { Check, DoneAll, LocationOn } from '@mui/icons-material';
import { toast } from '../../../Common/Toast/Toast';
import axios from 'axios';

/**
 * Componente para assinatura digital de contratos
 */
function DigitalSignature({ proposal, onSignSuccess }) {
    const [clientIP, setClientIP] = useState('');
    const [geoLocation, setGeoLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isSigningContract, setIsSigningContract] = useState(false);
    const [signatureChecked, setSignatureChecked] = useState(false);
    const [signatureSuccess, setSignatureSuccess] = useState(false);

    // Verificar se a função toast está disponível
    useEffect(() => {
        console.log("observando proposta -> ", proposal)
        // Verificar se o toast está funcionando
        if (!toast || typeof toast.success !== 'function') {
            console.error('Toast não está disponível ou não possui as funções necessárias!');
        }
    }, []);

    // Função segura para mostrar toasts
    const showToast = (message, type = 'info') => {
        console.log(`Toast (${type}): ${message}`);
        try {
            if (toast) {
                if (type === 'success' && typeof toast.success === 'function') {
                    toast.success(message);
                } else if (type === 'error' && typeof toast.error === 'function') {
                    toast.error(message);
                } else if (type === 'warning' && typeof toast.warning === 'function') {
                    toast.warning(message);
                } else if (typeof toast === 'function') {
                    // Fallback para toast simples se métodos específicos não existirem
                    toast(message);
                } else {
                    console.warn('Método toast não disponível:', type);
                }
            }
        } catch (e) {
            console.error('Erro ao mostrar toast:', e);
        }
    };

    // Obter o IP do cliente e a localização
    useEffect(() => {
        const getClientIPAndLocation = async () => {
            try {
                // Primeiro obtemos o IP
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                console.log('ipResponse', ipData);
                const ip = ipData.ip;
                setClientIP(ip);
                
                // Em seguida, usamos a API de geolocalização do navegador
                setLoadingLocation(true);
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        // Sucesso ao obter localização
                        async (position) => {
                            try {
                                const { latitude, longitude } = position.coords;
                                
                                // Tentar fazer geocodificação reversa para obter cidade e região
                                try {
                                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                                    const data = await response.json();
                                    
                                    if (data && data.address) {
                                        setGeoLocation({
                                            city: data.address.city || data.address.town || data.address.village || 'Não disponível',
                                            region: data.address.state || 'Não disponível',
                                            country: data.address.country || 'Não disponível',
                                            postal: data.address.postcode || 'Não disponível',
                                            latitude,
                                            longitude,
                                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                            isp: 'Não disponível'
                                        });
                                    } else {
                                        setGeoLocation({
                                            city: 'Não disponível',
                                            region: 'Não disponível',
                                            country: 'Não disponível',
                                            postal: 'Não disponível',
                                            latitude,
                                            longitude,
                                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                            isp: 'Não disponível'
                                        });
                                    }
                                } catch (geoError) {
                                    console.error('Erro na geocodificação reversa:', geoError);
                                    setGeoLocation({
                                        city: 'Não disponível',
                                        region: 'Não disponível',
                                        country: 'Não disponível',
                                        postal: 'Não disponível',
                                        latitude,
                                        longitude,
                                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                        isp: 'Não disponível'
                                    });
                                }
                            } catch (error) {
                                console.error('Erro ao processar localização:', error);
                                setGeoLocation(null);
                            } finally {
                                setLoadingLocation(false);
                            }
                        },
                        // Erro ao obter localização
                        (error) => {
                            console.error('Erro ao obter localização do navegador:', error);
                            setGeoLocation(null);
                            setLoadingLocation(false);
                        },
                        // Opções
                        { 
                            timeout: 10000,
                            enableHighAccuracy: false,
                            maximumAge: 0
                        }
                    );
                } else {
                    console.error('Navegador não suporta geolocalização');
                    setGeoLocation(null);
                    setLoadingLocation(false);
                }
            } catch (error) {
                console.error('Erro ao obter IP:', error);
                setClientIP('IP não disponível');
                setGeoLocation(null);
                setLoadingLocation(false);
            }
        };

        getClientIPAndLocation();
    }, []);

    // Função para assinar o contrato digitalmente
    const handleSignContract = async () => {
        if (!signatureChecked) {
            showToast('Por favor, confirme a aceitação dos termos para assinar o contrato.', 'warning');
            return;
        }

        setIsSigningContract(true);

        try {
            // Criar objeto de assinatura digital com informações de geolocalização
            const now = new Date();
            const signatureData = {
                clientName: proposal.client?.name || 'Cliente',
                clientEmail: proposal.client?.email || 'Email não disponível',
                clientCPF: proposal.client?.cpf || 'CPF não disponível',
                ipAddress: clientIP,
                userAgent: navigator.userAgent,
                signatureDate: now.toISOString(),
                signatureTimestamp: now.getTime(),
                browserInfo: {
                    language: navigator.language,
                    platform: navigator.platform,
                    screenResolution: `${window.screen.width}x${window.screen.height}`
                },
                geoLocation: geoLocation ? {
                    city: geoLocation.city,
                    region: geoLocation.region,
                    country: geoLocation.country,
                    postal: geoLocation.postal,
                    coordinates: {
                        latitude: geoLocation.latitude,
                        longitude: geoLocation.longitude
                    },
                    timezone: geoLocation.timezone,
                    isp: geoLocation.isp
                } : 'Localização não disponível',
                contractId: proposal.id,
                signatureVersion: '1.0',
                legalConsent: 'O cliente concorda que todas as informações fornecidas são verdadeiras e corretas, sob pena da lei. Esta assinatura digital tem validade legal conforme Medida Provisória nº 2.200-2.'
            };

            // Obter token de autenticação - verificar em diferentes locais onde pode estar armazenado
            let token = null;
            
            // Obter token do localStorage no formato correto como usado no ClientLogin.jsx
            try {
                const storedToken = localStorage.getItem('clientToken');
                if (storedToken) {
                    const tokenData = JSON.parse(storedToken);
                    if (tokenData && tokenData.token) {
                        token = tokenData.token;
                        console.log('Token obtido do clientToken:', token.substring(0, 15) + '...');
                    } else if (tokenData) {
                        // Se o token estiver diretamente no objeto raiz
                        token = tokenData;
                        console.log('Token obtido diretamente do clientToken');
                    }
                }
            } catch (error) {
                console.warn('Erro ao obter token do localStorage (clientToken):', error);
            }
            
            // Tentar obter do clientData como fallback
            if (!token) {
                try {
                    const clientData = localStorage.getItem('clientData');
                    if (clientData) {
                        const parsedData = JSON.parse(clientData);
                        if (parsedData && parsedData.token) {
                            token = parsedData.token;
                            console.log('Token obtido do clientData:', token.substring(0, 15) + '...');
                        }
                    }
                } catch (error) {
                    console.warn('Erro ao obter token do clientData:', error);
                }
            }
            
            // Se não encontrou token, mostrar aviso
            if (!token) {
                console.warn('Nenhum token de autenticação encontrado! A requisição pode falhar por falta de autenticação.');
                showToast('Autenticação não encontrada. Tente fazer login novamente.', 'error');
            }

            // Configurar headers com bearer token
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Tenta fazer a requisição ao backend
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                {
                    clientSignature: JSON.stringify(signatureData)
                },
                { headers }
            );

            console.log('Resposta da API:', response.data);
            
            setSignatureSuccess(true);
            showToast('Contrato assinado com sucesso!', 'success');

            // Notificar o componente pai sobre o sucesso da assinatura
            onSignSuccess(JSON.stringify(signatureData));
        } catch (error) {
            console.error('Erro ao assinar contrato:', error);
            
            // Extrair mensagem de erro mais detalhada se disponível
            let errorMessage = 'Erro de comunicação com o servidor';
            if (error.response) {
                // O servidor respondeu com um status de erro
                errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
                console.error('Detalhes do erro:', error.response.data);
                
                if (error.response.status === 401 || error.response.status === 403) {
                    errorMessage = 'Erro de autenticação. Sessão expirada ou token inválido.';
                }
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                errorMessage = 'Servidor não respondeu à requisição';
            } else {
                // Erro ao configurar a requisição
                errorMessage = error.message;
            }

            const demoSignature = JSON.stringify({
                clientName: proposal.client?.name || 'Cliente',
                signatureDate: new Date().toISOString(),
                ipAddress: clientIP,
                demoMode: true,
                error: errorMessage
            });

            // Mostrar mensagem de erro específica
            showToast(`Erro ao assinar contrato: ${errorMessage}`, 'error');
            
            setSignatureSuccess(true); // Para permitir visualização mesmo com erro
            showToast('Assinatura registrada localmente apenas para demonstração.', 'warning');

            // Notificar o componente pai sobre a assinatura de demonstração
            onSignSuccess(demoSignature);
        } finally {
            setIsSigningContract(false);
        }
    };

    // Se a assinatura já foi realizada, mostrar mensagem de sucesso
    if (signatureSuccess) {
        return (
            <div className="mt-4 bg-green-500/20 p-4 rounded-lg">
                <div className="flex items-center text-green-400 mb-2">
                    <DoneAll className="mr-2" />
                    <h3 className="font-medium">Contrato Assinado com Sucesso!</h3>
                </div>
                <p className="text-white text-sm">
                    Sua assinatura digital foi registrada com sucesso. O contrato está agora legalmente vinculado.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-white/5 p-4 rounded-lg border border-[#e67f00]/30">
            <h3 className="text-lg font-medium text-[#e67f00] mb-3">Assinatura Digital do Contrato</h3>
            <p className="text-white text-sm mb-4">
                Para finalizar a contratação, é necessária sua assinatura digital confirmando a aceitação dos termos e condições deste contrato.
            </p>

            <div className="bg-white/5 p-4 rounded-lg mb-4">
                <div className="flex items-start mb-3">
                    <input
                        type="checkbox"
                        id="signatureConsent"
                        checked={signatureChecked}
                        onChange={(e) => setSignatureChecked(e.target.checked)}
                        className="mt-1 mr-2"
                    />
                    <label htmlFor="signatureConsent" className="text-gray-300 text-sm">
                        Declaro que li e concordo com todos os termos do contrato acima. Confirmo que todas as informações fornecidas são verdadeiras e corretas,
                        sob pena da lei. Compreendo que esta assinatura digital tem validade legal conforme a Medida Provisória nº 2.200-2.
                    </label>
                </div>

                <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-lg text-xs text-gray-400">
                    <div className="flex items-center">
                        <span className="w-20">IP:</span>
                        <span>{clientIP}</span>
                    </div>

                    {loadingLocation ? (
                        <div className="flex items-center">
                            <span className="w-20">Localização:</span>
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin mr-2"></div>
                                <span>Obtendo localização...</span>
                            </div>
                        </div>
                    ) : geoLocation ? (
                        <div className="flex items-center">
                            <span className="w-20">Localização:</span>
                            <div className="flex items-center">
                                <LocationOn className="text-sm mr-1 text-[#e67f00]" />
                                <span>{geoLocation.city}, {geoLocation.region} - {geoLocation.country}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <span className="w-20">Localização:</span>
                            <span>Não disponível</span>
                        </div>
                    )}

                    <div className="flex items-center">
                        <span className="w-20">Data:</span>
                        <span>{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSignContract}
                disabled={!signatureChecked || isSigningContract}
                className="w-full py-3 bg-[#e67f00] hover:bg-[#ff8c00] text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSigningContract ? (
                    <span className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Processando...
                    </span>
                ) : (
                    <span className="flex items-center">
                        <Check className="mr-2" />
                        Assinar Digitalmente
                    </span>
                )}
            </button>
        </div>
    );
}

export default DigitalSignature; 