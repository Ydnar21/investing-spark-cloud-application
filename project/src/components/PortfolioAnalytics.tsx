import React from 'react';
import { PieChart as PieChartIcon, AlertTriangle, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Stock, StockData, PortfolioMetrics, SectorAllocation } from '../types';

// Mock sector data - In a real app, this would come from an API
const stockSectors: Record<string, string> = {
  AAPL: 'Technology',
  GOOGL: 'Technology',
  MSFT: 'Technology',
  JPM: 'Financial',
  BAC: 'Financial',
  XOM: 'Energy',
  CVX: 'Energy',
  JNJ: 'Healthcare',
  PFE: 'Healthcare',
  PG: 'Consumer Staples',
  KO: 'Consumer Staples',
  AMZN: 'Consumer Discretionary',
  TSLA: 'Consumer Discretionary',
};

// Color palette for pie chart sectors
const COLORS = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#9333ea', // Purple
  '#ea580c', // Orange
  '#0d9488', // Teal
  '#4f46e5', // Indigo
  '#db2777', // Pink
  '#ca8a04', // Yellow
  '#64748b', // Slate
];

interface PortfolioAnalyticsProps {
  portfolio: Stock[];
  stockData: Record<string, StockData>;
}

export default function PortfolioAnalytics({ portfolio, stockData }: PortfolioAnalyticsProps) {
  const calculatePortfolioMetrics = (): PortfolioMetrics => {
    const totalValue = portfolio.reduce((total, stock) => {
      const currentPrice = stockData[stock.symbol]?.price || stock.purchasePrice;
      return total + (currentPrice * stock.shares);
    }, 0);

    // Calculate sector allocations
    const sectorValues: Record<string, number> = {};
    portfolio.forEach(stock => {
      const sector = stockSectors[stock.symbol] || 'Other';
      const currentPrice = stockData[stock.symbol]?.price || stock.purchasePrice;
      const value = currentPrice * stock.shares;
      sectorValues[sector] = (sectorValues[sector] || 0) + value;
    });

    const sectorAllocations: SectorAllocation[] = Object.entries(sectorValues).map(([sector, value]) => ({
      sector,
      value,
      percentage: (value / totalValue) * 100
    }));

    // Calculate diversification score (0-100)
    const sectorCount = sectorAllocations.length;
    const maxSectorPercentage = Math.max(...sectorAllocations.map(s => s.percentage));
    const diversificationScore = Math.min(
      100,
      (sectorCount * 10) + (100 - maxSectorPercentage)
    );

    // Determine risk level
    const riskLevel = diversificationScore >= 80 ? 'Low' : diversificationScore >= 60 ? 'Moderate' : 'High';

    return {
      totalValue,
      sectorAllocations,
      diversificationScore,
      riskLevel
    };
  };

  const getRecommendations = (metrics: PortfolioMetrics): string[] => {
    const recommendations: string[] = [];
    const { sectorAllocations, diversificationScore } = metrics;

    // Check for over-concentration
    sectorAllocations.forEach(({ sector, percentage }) => {
      if (percentage > 30) {
        recommendations.push(`Consider reducing exposure to ${sector} sector (currently ${percentage.toFixed(1)}%)`);
      }
    });

    // Check for sector gaps
    const commonSectors = ['Technology', 'Financial', 'Healthcare', 'Consumer Staples'];
    commonSectors.forEach(sector => {
      if (!sectorAllocations.some(s => s.sector === sector)) {
        recommendations.push(`Consider adding ${sector} stocks for better diversification`);
      }
    });

    // General diversification advice
    if (diversificationScore < 60) {
      recommendations.push('Portfolio is highly concentrated. Consider spreading investments across more sectors');
    }

    if (portfolio.length < 5) {
      recommendations.push('Consider adding more stocks to reduce company-specific risk');
    }

    return recommendations;
  };

  const metrics = calculatePortfolioMetrics();
  const recommendations = getRecommendations(metrics);

  // Format data for pie chart
  const pieChartData = metrics.sectorAllocations.map(({ sector, value, percentage }) => ({
    name: sector,
    value: value,
    percentage: percentage.toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold">{data.name}</p>
          <p className="text-gray-600">${data.value.toLocaleString()}</p>
          <p className="text-gray-600">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <PieChartIcon className="w-6 h-6 mr-2 text-blue-600" />
        Portfolio Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Diversification Score</h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="h-2.5 w-full bg-gray-200 rounded-full">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                    metrics.diversificationScore >= 80 ? 'bg-green-500' :
                    metrics.diversificationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metrics.diversificationScore}%` }}
                />
              </div>
            </div>
            <span className="ml-3 font-semibold">{metrics.diversificationScore.toFixed(0)}/100</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Risk Level</h3>
          <div className="flex items-center">
            <AlertTriangle className={`w-5 h-5 mr-2 ${
              metrics.riskLevel === 'Low' ? 'text-green-500' :
              metrics.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-red-500'
            }`} />
            <span className="font-semibold">{metrics.riskLevel}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Sector Allocation</h3>
        {portfolio.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  align="right"
                  verticalAlign="middle"
                  formatter={(value: string) => {
                    const data = pieChartData.find(item => item.name === value);
                    return `${value} (${data?.percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Add stocks to your portfolio to see sector allocation
          </p>
        )}
      </div>

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Recommendations
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}