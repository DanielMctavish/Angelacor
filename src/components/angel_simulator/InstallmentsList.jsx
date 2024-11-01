function InstallmentsList({ listaParcelas }) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Detalhamento das Parcelas</h4>
      <div className="max-h-[200px] overflow-y-auto">
        {listaParcelas.map((valor, index) => (
          <div key={index} 
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
            <span className="font-medium">
              Parcela {(index + 1).toString().padStart(2, '0')}
            </span>
            <span className="font-semibold text-right">
              R$ {valor.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 