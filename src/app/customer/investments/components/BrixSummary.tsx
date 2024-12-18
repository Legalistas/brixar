import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency } from '@/utils/formatUtils';

interface Purchase {
    id: string;
    date: Date;
    amount: number;
    price: number;
}

interface BrixSummaryProps {
    currentBrixs: number;
    purchaseHistory: Purchase[];
    brixPrice: number; // Added brixPrice prop
}

const BrixSummary: React.FC<BrixSummaryProps> = ({ currentBrixs, purchaseHistory, brixPrice }) => {
    const { convertPrice } = useCurrency();
    const totalHistoryBrixs = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalHistoryValue = purchaseHistory.reduce((sum, purchase) => sum + purchase.price, 0);
    const totalBrixs = currentBrixs + totalHistoryBrixs;
    const totalValue = convertPrice(totalHistoryValue + (currentBrixs * brixPrice));

    return (
        <div className="bg-white shadow-lg rounded overflow-hidden">
            <div className="bg-[#FB6107] text-white px-6 py-4">
                <h2 className="text-2xl font-bold">Resumen de Inversión en Brixs</h2>
            </div>
            <div className="px-6 py-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600">Brixs actuales:</span>
                        <span className="font-semibold text-gray-800">{currentBrixs}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600">Brixs del historial:</span>
                        <span className="font-semibold text-gray-800">{totalHistoryBrixs}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600">Total de Brixs:</span>
                        <span className="font-semibold text-gray-800">{totalBrixs}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600">Valor por Brix:</span>
                        <span className="font-semibold text-gray-800">{formatCurrency(convertPrice(brixPrice))}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600">Valor total de la inversión:</span>
                        <span className="font-bold text-lg text-blue-600">{formatCurrency(totalValue)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrixSummary;

