export interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
}

export interface Portfolio {
  stocks: Stock[];
  investmentGoal: number;
  targetDate: string;
}

export interface StockNews {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface SectorAllocation {
  sector: string;
  percentage: number;
  value: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  sectorAllocations: SectorAllocation[];
  riskLevel: 'Low' | 'Moderate' | 'High';
  diversificationScore: number;
}