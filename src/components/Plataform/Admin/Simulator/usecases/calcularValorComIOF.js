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
export const calcularValorComIOF = (parcelaBase, margem, novaTaxa, novoPrazo, saldoDevedorAtual, taxaIOF = 6.5) => {
    if (!parcelaBase || !novaTaxa || !novoPrazo || !saldoDevedorAtual) return 0;
    // Margem pode ser zero, então só verificamos se é um número válido
    if (isNaN(margem)) return 0;
    
    // Calcula o valor do saldo devedor com novos parâmetros
    const novoSaldoDevedor = calcularSaldoDevedorVP(parcelaBase + margem, novaTaxa, novoPrazo);
    
    // Calcula a diferença entre o novo saldo e o saldo atual
    const diferenca = novoSaldoDevedor - saldoDevedorAtual;
    
    // Aplica a taxa de IOF sobre a diferença (usa a taxa fornecida ou 6.5% como padrão)
    const valorIOF = diferenca * (taxaIOF / 100);
    
    // Retorna o valor líquido após descontar o IOF
    return diferenca - valorIOF;
}; 