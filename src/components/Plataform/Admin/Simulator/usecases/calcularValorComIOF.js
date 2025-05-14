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
export const calcularValorComIOF = (parcelaBase, margem, novaTaxa, novoPrazo, saldoDevedorAtual, taxaIOF) => {

    if (!novaTaxa || !novoPrazo) return 0;
    if (isNaN(margem)) return 0;
    
    const parcelaBaseNum = parseFloat(parcelaBase) || 0;
    const saldoDevedorAtualNum = parseFloat(saldoDevedorAtual) || 0;
    const margemNum = parseFloat(margem) || 0;

    const novoSaldoDevedor = calcularSaldoDevedorVP(parcelaBaseNum + margemNum, novaTaxa, novoPrazo);
    
    const diferenca = novoSaldoDevedor - saldoDevedorAtualNum;
    const valorIOF = Math.abs(diferenca) * (taxaIOF / 100);
    
    return Math.abs(diferenca - valorIOF);
}; 