import { calcularValorComIOF } from './calcularValorComIOF';

/**
 
 * @param {Object} params 
 * @param {number} params.margem 
 * @param {number} params.novaTaxa 
 * @param {number} params.novoPrazo 
 * @param {number} params.saldoDevedorAtual 
 * @param {number} params.parcelaBase 
 * @param {number} params.taxaIOF 
 * @returns {number} 
 */
export const calcContratoBruto = ({
    margem,
    novaTaxa,
    novoPrazo,
    saldoDevedorAtual,
    parcelaBase,
    taxaIOF = 6.5
}) => {
    const margemNum = parseFloat(margem) || 0;
    const novaTaxaNum = parseFloat(novaTaxa) / 100 || 0;
    const novoPrazoNum = parseInt(novoPrazo) || 0;
    const saldoDevedorNum = parseFloat(saldoDevedorAtual) || 0;
    const parcelaBaseNum = parseFloat(parcelaBase) || 0;
    const taxaIOFNum = parseFloat(taxaIOF) || 6.5;

    return calcularValorComIOF(
        parcelaBaseNum,
        margemNum,
        novaTaxaNum,
        novoPrazoNum,
        saldoDevedorNum,
        taxaIOFNum
    );
}; 