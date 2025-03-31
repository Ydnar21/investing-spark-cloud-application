import React from 'react';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import type { Stock, StockData } from '../types';

interface PortfolioOverviewProps {
  portfolio: Stock[];
  stockData: Record<string, StockData>;
  onRemoveStock: (symbol: string) => void;
}

export default function PortfolioOverview({ portfolio, stockData, onRemoveStock }: PortfolioOverviewProps) {
  // TODO: This hardcoded price needs to be reworked to:
  // 1. Integrate with a real-time stock price API
  // 2. Implement WebSocket connections for live price updates
  // 3. Add price history tracking
  // 4. Include price alerts
  // 5. Add price change indicators and trends
  const FIXED_CURRENT_PRICE = 12;

  const calculateTotalValue = () => {
    return portfolio.reduce((total, stock) => {
      return total + (FIXED_CURRENT_PRICE * stock.shares);
    }, 0);
  };

  const calculateTotalGain = () => {
    return portfolio.reduce((total, stock) => {
      const gain = (FIXED_CURRENT_PRICE - stock.purchasePrice) * stock.shares;
      return total + gain;
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const totalGain = calculateTotalGain();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Gain/Loss</h3>
          <p className={`text-3xl font-bold flex items-center ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGain >= 0 ? <TrendingUp className="w-6 h-6 mr-2" /> : <TrendingDown className="w-6 h-6 mr-2" />}
            ${Math.abs(totalGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Holdings</h3>
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {portfolio.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No stocks in portfolio. Add some stocks to get started!
                  </td>
                </tr>
              ) : (
                portfolio.map((stock) => {
                  const marketValue = FIXED_CURRENT_PRICE * stock.shares;
                  const gain = (FIXED_CURRENT_PRICE - stock.purchasePrice) * stock.shares;
                  const gainPercent = ((FIXED_CURRENT_PRICE - stock.purchasePrice) / stock.purchasePrice) * 100;
                  
                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-4 text-sm font-medium text-gray-900">{stock.symbol}</td>
                      <td className="p-4 text-sm text-gray-500">{stock.shares}</td>
                      <td className="p-4 text-sm text-gray-500">
                        ${stock.purchasePrice.toFixed(2)}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        ${FIXED_CURRENT_PRICE.toFixed(2)}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`flex items-center ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gain >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          ${Math.abs(gain).toFixed(2)} ({gainPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        <button
                          onClick={() => onRemoveStock(stock.symbol)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                          title="Remove stock"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}