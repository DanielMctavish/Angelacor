






export const calcularSaldoDevedorVP = (parcela, taxa, prazoRestante) => {
    if (!parcela || !taxa || !prazoRestante) return 0;
    return parcela * ((1 - Math.pow(1 + taxa, -prazoRestante)) / taxa);
};