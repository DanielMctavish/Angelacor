export const FUNCTION_DESCRIPTIONS = {
    'Operacional': `
        O(A) CONTRATADO(A) exercerá a função de Operacional, sendo responsável por:<br/>
        a) Realizar atendimento direto aos clientes;<br/>
        b) Executar processos operacionais diários;<br/>
        c) Manter registros e documentações atualizadas;<br/>
        d) Dar suporte às atividades administrativas;<br/>
        e) Acompanhar o andamento das propostas em análise.
    `,
    'Gerente': `
        O(A) CONTRATADO(A) exercerá a função de Gerente, sendo responsável por:<br/>
        a) Liderar e coordenar a equipe de colaboradores;<br/>
        b) Estabelecer metas e objetivos para a equipe;<br/>
        c) Avaliar o desempenho dos colaboradores;<br/>
        d) Desenvolver estratégias para melhorar resultados;<br/>
        e) Garantir o cumprimento das políticas da empresa.
    `,
    'Coordenador': `
        O(A) CONTRATADO(A) exercerá a função de Coordenador, sendo responsável por:<br/>
        a) Coordenar um grupo específico de colaboradores;<br/>
        b) Acompanhar e avaliar as propostas do seu grupo;<br/>
        c) Treinar novos membros da equipe;<br/>
        d) Reportar resultados à gerência;<br/>
        e) Otimizar processos operacionais do grupo.
    `,
    'Vendedor': `
        O(A) CONTRATADO(A) exercerá a função de Vendedor, sendo responsável por:<br/>
        a) Prospectar e atender clientes;<br/>
        b) Apresentar produtos e serviços da empresa;<br/>
        c) Elaborar propostas comerciais;<br/>
        d) Manter relacionamento com a carteira de clientes;<br/>
        e) Atingir metas de vendas estabelecidas.
    `,
    'Parceiro': `
        O(A) CONTRATADO(A) exercerá a função de Parceiro, sendo responsável por:<br/>
        a) Representar a empresa em sua região de atuação;<br/>
        b) Captar novos clientes de forma autônoma;<br/>
        c) Intermediar negociações entre cliente e empresa;<br/>
        d) Prestar consultoria inicial aos clientes;<br/>
        e) Acompanhar o processo até a finalização.<br/>
    `,
    'Sub Administrador': `
        O(A) CONTRATADO(A) exercerá a função de Sub Administrador, sendo responsável por: <br/>
        a) Auxiliar na gestão geral da empresa;<br/>
        b) Supervisionar todas as operações;<br/>
        c) Tomar decisões estratégicas em conjunto com a administração;<br/>
        d) Avaliar e aprovar propostas de todas as equipes;<br/>
        e) Implementar melhorias nos processos internos.<br/>
    `
};

export const contractTemplate = {
    company: {
        name: "TRIUNFO CORRESPONDENTE",
        cnpj: "12.345.678/0001-90",
        address: "Av. Principal, 1000, Centro Empresarial, Recife/PE",
        cep: "50000-000",
        representative: "Angela Krambeck",
        representative_cpf: "123.456.789-00",
        representative_rg: "1234567 SSP/PE"
    },
    
    template: (colaborador) => `
        <h2 style="text-align: center;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
        <br/>

        <p><strong>CONTRATANTE:</strong> <strong>${contractTemplate.company.name}</strong>, pessoa jurídica de direito privado, 
        inscrita no CNPJ sob nº ${contractTemplate.company.cnpj}, com sede na 
        ${contractTemplate.company.address}, CEP: ${contractTemplate.company.cep}, 
        neste ato representada por <strong>${contractTemplate.company.representative}</strong>, 
        CPF: ${contractTemplate.company.representative_cpf}, RG: ${contractTemplate.company.representative_rg}.</p>
        <br/>

        <p><strong>CONTRATADO(A):</strong> <strong>${colaborador.name || '_______________'}</strong>, 
        ${colaborador.nationality || 'brasileiro(a)'}, prestador(a) de serviços, 
        portador(a) do CPF nº ${colaborador.cpf || '_______________'}, 
        RG nº ${colaborador.rg || '_______________'}, 
        residente e domiciliado(a) em ${colaborador.address || '_______________'}, 
        telefone: ${colaborador.phone_number || '_______________'}.</p>
        <br/>

        <p>As partes acima identificadas têm, entre si, justo e acertado o presente 
        Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes 
        e pelas condições descritas no presente.</p>
        <br/>

        <h3>DO OBJETO DO CONTRATO</h3>
        <br/>
        <p><strong>Cláusula 1ª.</strong> O presente contrato tem como objeto a prestação de serviços de 
        <strong>${colaborador.function || '_______________'}</strong> pelo(a) CONTRATADO(A), que exercerá suas funções sem qualquer vínculo empregatício com a CONTRATANTE.</p>
        <br/>

        <h3>DAS ATRIBUIÇÕES DA FUNÇÃO</h3>
        <br/>
        <p><strong>Cláusula 2ª.</strong> ${colaborador.function ? FUNCTION_DESCRIPTIONS[colaborador.function] : 
        'As atribuições específicas serão definidas de acordo com a função designada.'}</p>
        <br/>

        <h3>DAS OBRIGAÇÕES DO(A) CONTRATADO(A)</h3>
        <br/>
        <p><strong>Cláusula 3ª.</strong> São deveres do(a) CONTRATADO(A):</p>
        <br/>
        <p>a) Executar os serviços com zelo, eficiência e pontualidade;</p>
        <p>b) Seguir as normas e regulamentos internos da CONTRATANTE;</p>
        <p>c) Manter sigilo sobre informações confidenciais da empresa;</p>
        <p>d) Zelar pelos equipamentos e materiais da CONTRATANTE;</p>
        <p>e) Manter conduta profissional adequada no ambiente de trabalho.</p>
        <br/>

        <h3>DAS OBRIGAÇÕES DA CONTRATANTE</h3>
        <br/>
        <p><strong>Cláusula 4ª.</strong> São deveres da CONTRATANTE:</p>
        <br/>
        <p>a) Efetuar o pagamento conforme o acordado;</p>
        <p>b) Fornecer condições adequadas para a execução dos serviços;</p>
        <p>c) Fornecer as informações necessárias para o bom desempenho dos serviços.</p>
        <br/>

        <h3>DA REMUNERAÇÃO</h3>
        <br/>
        <p><strong>Cláusula 5ª.</strong> Pelos serviços prestados, o(a) CONTRATADO(A) receberá a quantia 
        mensal de <strong>R$ ${colaborador.salary ? colaborador.salary.toFixed(2) : '0,00'}</strong> 
        (${colaborador.salary ? valorPorExtenso(colaborador.salary) : '_______________'}), 
        a ser paga até o 5º dia útil de cada mês subsequente ao vencido.</p>
        <br/>

        <h3>DA VIGÊNCIA E RESCISÃO</h3>
        <br/>
        <p><strong>Cláusula 6ª.</strong> O presente contrato tem prazo indeterminado, iniciando-se na data 
        de sua assinatura, podendo ser rescindido por qualquer das partes mediante notificação 
        prévia de 30 (trinta) dias, sem ônus para ambas as partes.</p>
        <br/>

        <h3>DO HORÁRIO DE TRABALHO</h3>
        <br/>
        <p><strong>Cláusula 7ª.</strong> O(A) CONTRATADO(A) cumprirá jornada de trabalho de 44 (quarenta e quatro) 
        horas semanais, com intervalo de 1 (uma) hora para refeição e descanso.</p>
        <br/>

        <h3>DA EXCLUSIVIDADE</h3>
        <br/>
        <p><strong>Cláusula 8ª.</strong> O(A) CONTRATADO(A) poderá exercer outras atividades profissionais, 
        desde que não conflitem com os interesses da CONTRATANTE e não prejudiquem o desempenho 
        das atividades ora contratadas.</p>
        <br/>

        <h3>DO FORO</h3>
        <br/>
        <p><strong>Cláusula 9ª.</strong> Para dirimir quaisquer controvérsias oriundas deste contrato, 
        as partes elegem o foro da comarca de Recife/PE.</p>
        <br/>

        <div style="margin: 60px 0 40px;">
            <p style="text-align: center;">Por estarem assim justos e contratados, firmam o presente instrumento, 
            em duas vias de igual teor.</p>
        </div>

        <div style="margin: 40px 0; text-align: center;">
            <p>Recife, _____ de __________________ de ${new Date().getFullYear()}</p>
        </div>

        <div style="margin: 80px 0 60px; display: flex; justify-content: space-between;">
            <div style="text-align: center;">
                <p style="margin-bottom: 5px;">__________________________________</p>
                <p style="margin-bottom: 5px;"><strong>CONTRATANTE</strong></p>
                <p style="margin-bottom: 5px;">${contractTemplate.company.name}</p>
                <p>CNPJ: ${contractTemplate.company.cnpj}</p>
            </div>

            <div style="text-align: center;">
                <p style="margin-bottom: 5px;">__________________________________</p>
                <p style="margin-bottom: 5px;"><strong>CONTRATADO(A)</strong></p>
                <p style="margin-bottom: 5px;">${colaborador.name || '_______________'}</p>
                <p>CPF: ${colaborador.cpf || '_______________'}</p>
            </div>
        </div>

        <div style="margin-top: 60px;">
            <p style="margin-bottom: 20px;"><strong>Testemunhas:</strong></p>
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <p style="margin-bottom: 5px;">1. ________________________________</p>
                    <p style="margin-bottom: 5px;">Nome:</p>
                    <p>CPF:</p>
                </div>

                <div>
                    <p style="margin-bottom: 5px;">2. ________________________________</p>
                    <p style="margin-bottom: 5px;">Nome:</p>
                    <p>CPF:</p>
                </div>
            </div>
        </div>
    `
};

function valorPorExtenso(valor) {
    const unidades = [
        '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
        'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'
    ];
    
    const dezenas = [
        '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'
    ];
    
    const centenas = [
        '', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos',
        'setecentos', 'oitocentos', 'novecentos'
    ];

    function converterGrupo(numero) {
        let resultado = '';
        
        // Trata centenas
        if (numero >= 100) {
            if (numero === 100) {
                return 'cem';
            }
            resultado += centenas[Math.floor(numero / 100)] + ' e ';
            numero %= 100;
        }
        
        // Trata dezenas e unidades
        if (numero < 20) {
            resultado += unidades[numero];
        } else {
            resultado += dezenas[Math.floor(numero / 10)];
            if (numero % 10 !== 0) {
                resultado += ' e ' + unidades[numero % 10];
            }
        }
        
        return resultado;
    }

    if (valor === 0) return 'zero reais';

    const reais = Math.floor(valor);
    const centavos = Math.round((valor - reais) * 100);

    let resultado = '';

    if (reais > 0) {
        // Trata milhões
        if (reais >= 1000000) {
            const milhoes = Math.floor(reais / 1000000);
            resultado += converterGrupo(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões');
            if (reais % 1000000 !== 0) resultado += ' e ';
        }

        // Trata milhares
        if (reais >= 1000) {
            const milhares = Math.floor((reais % 1000000) / 1000);
            if (milhares > 0) {
                resultado += converterGrupo(milhares) + ' mil';
                if (reais % 1000 !== 0) resultado += ' e ';
            }
        }

        // Trata centenas/dezenas/unidades
        const resto = reais % 1000;
        if (resto > 0) {
            resultado += converterGrupo(resto);
        }

        resultado += (reais === 1 ? ' real' : ' reais');
    }

    // Trata centavos
    if (centavos > 0) {
        if (reais > 0) resultado += ' e ';
        resultado += converterGrupo(centavos);
        resultado += (centavos === 1 ? ' centavo' : ' centavos');
    }

    return resultado;
}

// Exemplos de uso:
// console.log(valorPorExtenso(2400)); // "dois mil e quatrocentos reais"
// console.log(valorPorExtenso(1234.56)); // "um mil duzentos e trinta e quatro reais e cinquenta e seis centavos"
// console.log(valorPorExtenso(1000000)); // "um milhão de reais" 