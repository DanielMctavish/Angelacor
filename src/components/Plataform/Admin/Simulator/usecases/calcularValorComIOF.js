import { calcularSaldoDevedorVP } from './calcularSaldoDevedorVP';

/**
 * @param {number} parcelaBase 
 * @param {number} margem 
 * @param {number} novaTaxa 
 * @param {number} novoPrazo 
 * @param {number} saldoDevedorAtual 
 * @param {number} taxaIOF 
 * @returns {number} 
 */
export const calcularValorComIOF = (parcelaBase, margem, novaTaxa, novoPrazo, saldoDevedorAtual = 0, taxaIOF = 6.5) => {
    // Validação apenas dos campos essenciais para o cálculo
    if (!novaTaxa || !novoPrazo) return 0;
    if (isNaN(margem)) return 0;
    
    // Garante que parcelaBase e saldoDevedorAtual são números (0 se não fornecidos)
    const parcelaBaseNum = parseFloat(parcelaBase) || 0;
    const saldoDevedorAtualNum = parseFloat(saldoDevedorAtual) || 0;
    const margemNum = parseFloat(margem) || 0;
    
    // Calcula o valor do saldo devedor com novos parâmetros
    const novoSaldoDevedor = calcularSaldoDevedorVP(parcelaBaseNum + margemNum, novaTaxa, novoPrazo);
    
    // Calcula a diferença entre o novo saldo e o saldo atual
    const diferenca = novoSaldoDevedor - saldoDevedorAtualNum;
    
    // Aplica a taxa de IOF sobre a diferença (usa a taxa fornecida ou 6.5% como padrão)
    const valorIOF = Math.abs(diferenca) * (taxaIOF / 100);
    
    // Se a diferença é negativa (redução de parcela), o valor líquido é positivo
    // Se a diferença é positiva (aumento de parcela), o valor líquido é negativo
    return Math.abs(diferenca - valorIOF);
}; 