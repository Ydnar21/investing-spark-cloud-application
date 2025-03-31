import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type OptionType = 'call' | 'put';

interface OptionCalculatorFormData {
  type: OptionType;
  currentPrice: number;
  strikePrice: number;
  premium: number;
  contracts: number;
}

const defaultFormData: OptionCalculatorFormData = {
  type: 'call',
  currentPrice: 100,
  strikePrice: 110,
  premium: 5,
  contracts: 1,
};

export default function OptionsCalculator() {
  const [formData, setFormData] = useState<OptionCalculatorFormData>(defaultFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' ? value : Number(value),
    }));
  };

  const calculateProfit = (price: number): number => {
    const { type, strikePrice, premium, contracts } = formData;
    const contractMultiplier = 100; // Each contract represents 100 shares

    if (type === 'call') {
      const profit = Math.max(0, price - strikePrice) - premium;
      return profit * contracts * contractMultiplier;
    } else {
      const profit = Math.max(0, strikePrice - price) - premium;
      return profit * contracts * contractMultiplier;
    }
  };

  const chartData = useMemo(() => {
    const { currentPrice } = formData;
    const priceRange = currentPrice * 0.5; // Show prices ±50% of current price
    const points = 20;
    const step = (priceRange * 2) / points;

    return Array.from({ length: points + 1 }, (_, i) => {
      const price = currentPrice - priceRange + (step * i);
      return {
        price: Number(price.toFixed(2)),
        profit: Number(calculateProfit(price).toFixed(2)),
      };
    });
  }, [formData]);

  const maxLoss = formData.premium * formData.contracts * 100;
  const breakEvenPrice = formData.type === 'call'
    ? formData.strikePrice + formData.premium
    : formData.strikePrice - formData.premium;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Calculator className="w-6 h-6 mr-2 text-blue-600" />
          Options Calculator
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Option Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="call">Call Option</option>
              <option value="put">Put Option</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Stock Price</label>
            <input
              type="number"
              name="currentPrice"
              value={formData.currentPrice}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Strike Price</label>
            <input
              type="number"
              name="strikePrice"
              value={formData.strikePrice}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Premium (per share)</label>
            <input
              type="number"
              name="premium"
              value={formData.premium}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Contracts</label>
            <input
              type="number"
              name="contracts"
              value={formData.contracts}
              onChange={handleInputChange}
              min="1"
              step="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Profit/Loss Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Maximum Loss</h4>
            <p className="text-2xl font-bold text-red-600">
              ${maxLoss.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Break-even Price</h4>
            <p className="text-2xl font-bold text-blue-600">
              ${breakEvenPrice.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Contract Value</h4>
            <p className="text-2xl font-bold text-gray-900">
              ${(formData.premium * 100).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="price"
                label={{ value: 'Stock Price', position: 'bottom' }}
              />
              <YAxis
                label={{ value: 'Profit/Loss ($)', angle: -90, position: 'left' }}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit/Loss']}
                labelFormatter={(label: number) => `Stock Price: $${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Profit/Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}