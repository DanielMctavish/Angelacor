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

export const confidentialityTemplate = {
    template: (colaborador) => `
        <h2 style="text-align: center; margin-bottom: 30px;">TERMO DE CONFIDENCIALIDADE – TRIUNFO ASSESSORIA LTDA</h2>

        <div style="margin-bottom: 30px;">
            <p><strong>Nome do Funcionário:</strong> ${colaborador.name || '_______________'}</p>
            <p><strong>Matrícula:</strong> ${colaborador.id || '_______________'}</p>
            <p><strong>Cargo:</strong> ${colaborador.function || '_______________'}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>1. DO OBJETIVO</h3>
            <p>1.1. O presente termo tem por objetivo estabelecer regras e proteção às informações referentes ao EMPREGADOR que o EMPREGADO tenha acesso.</p>
            <p>1.2. Este termo adere ao contrato entabulado e vigente entre as partes, revogando expressamente as determinações diversas.</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>2. DA DEFINIÇÃO</h3>
            <p>2.1. Para fins do presente contrato, entende-se por informação confidencial:</p>
            <p>(a) qualquer informação relacionada ao negócio e operações do(a) EMPREGADOR(A) que não sejam públicas;</p>
            <p>(b) informações contidas em pesquisas, faturamento, metas, comissões, planos de negócio, vendas, informações financeiras, informações contábeis, custos, dados de precificação, parceiros de negócios, informações de fornecedores, propriedade intelectual, especificações, expertises, técnicas, invenções e todos os métodos, conceitos ou ideias relacionadas ao negócio do EMPREGADOR(A);</p>
            <p>2.1.1. Entende-se também como confidenciais quaisquer informações relativas a clientes (nome, documentos, transações financeiras, saldos e similares), modelos financeiros, políticas e processos internos, bem como dados de acesso aos sistemas utilizados.</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>3. DO SIGILO</h3>
            <p>3.1. O(A) EMPREGADO(A) deverá manter em sigilo, durante a vigência do presente termo e mesmo após sua extinção, qualquer informação relativa aos negócios, políticas, segredos institucionais, organização, criação, lista de clientes, quadro de funcionários, faturamento, metas e comissões, bem como as demais características e informações supramencionadas, sejam estas obtidas direta ou indiretamente.</p>
            <p>3.2. Todas as informações confidenciais são de propriedade exclusiva do EMPREGADOR, mesmo que tenham sido desenvolvidas ou modificadas pelo EMPREGADO(A) durante seu período de trabalho.</p>
            <p>3.3. O EMPREGADO deverá adotar todas as medidas necessárias para garantir que as informações confidenciais não sejam acidentalmente divulgadas ou acessadas por terceiros não autorizados.</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>4. DA VIGÊNCIA</h3>
            <p>4.1. O dever de confidencialidade permanece mesmo após o término do contrato de trabalho vigente, por tempo indeterminado, independentemente do motivo rescisório.</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3>5. DAS PENALIDADES</h3>
            <p>5.1. O descumprimento das obrigações de confidencialidade poderá sujeitar o EMPREGADO às sanções previstas e eventualmente aplicáveis na legislação trabalhista, cível e criminal, a depender do caso.</p>
            <p>5.2. A violação da obrigação de confidencialidade pode causar a rescisão imediata deste contrato por justa causa, conforme o artigo 482, alínea g da CLT.</p>
            <p>5.3. Em caso de violação desta cláusula o(a) EMPREGADO(A), poderá ser responsabilizado pelo pagamento das quantias equivalentes ao dano causado e estará sujeito ao pagamento de multa no valor de 5.000,00 (cinco mil reais), a ser devidamente atualizada e corrigidas no momento de sua aplicação.</p>
            <p>5.4. Este termo será regido e interpretado de acordo com as leis brasileiras, e quaisquer disputas decorrentes do presente instrumento serão submetidas ao foro determinado em contrato de trabalho.</p>
        </div>

        <p style="margin-bottom: 30px;">Por estarem as partes de pleno acordo, assinam o presente TERMO DE CONFIDENCIALIDADE em duas vias, ficando a primeira em poder do EMPREGADOR, e a segunda com o(a) EMPREGADO(A).</p>

        <div style="margin-bottom: 30px; text-align: center;">
            <p>___________________________________________________</p>
            <p>Guaratuba, _______ de janeiro de 2025</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 60px;">
            <div style="text-align: center;">
                <p style="margin-bottom: 5px;">____________________________________________________</p>
                <p>TRIUNFO ASSESSORIA LTDA</p>
            </div>

            <div style="text-align: center;">
                <p style="margin-bottom: 5px;">____________________________________________________</p>
                <p>Empregado</p>
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