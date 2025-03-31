import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LineChart, Wallet, LogOut, Calculator } from 'lucide-react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import PortfolioForm from './components/PortfolioForm';
import PortfolioOverview from './components/PortfolioOverview';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import GoalSetting from './components/GoalSetting';
import NewsFeed from './components/NewsFeed';
import OptionsCalculator from './components/OptionsCalculator';
import type { Stock, Portfolio, StockNews, StockData } from './types';

// Simulated data - In a real app, this would come from an API
const mockStockData: Record<string, StockData> = {
  AAPL: { symbol: 'AAPL', price: 175.43, change: 2.31, changePercent: 1.32 },
  GOOGL: { symbol: 'GOOGL', price: 142.89, change: -0.54, changePercent: -0.38 },
  MSFT: { symbol: 'MSFT', price: 378.85, change: 4.23, changePercent: 1.12 },
};

const mockNews: StockNews[] = [
  {
    title: 'Apple Announces New iPhone Release Date',
    url: 'https://example.com/news/1',
    source: 'Tech News Daily',
    publishedAt: '2024-03-15T10:30:00Z',
  },
  {
    title: 'Google Cloud Reports Strong Q4 Growth',
    url: 'https://example.com/news/2',
    source: 'Business Insider',
    publishedAt: '2024-03-14T15:45:00Z',
  },
];

const defaultPortfolio: Portfolio = {
  stocks: [],
  investmentGoal: 0,
  targetDate: '',
};

function Layout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-3xl font-bold text-gray-900 flex items-center">
                <Wallet className="w-8 h-8 mr-3 text-blue-600" />
                Stock Portfolio
              </Link>
              <nav className="flex space-x-4">
                <Link
                  to="/options-calculator"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Options Calculator
                </Link>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

function PortfolioPage() {
  const [session, setSession] = useState(null);
  const [portfolio, setPortfolio] = useState<Portfolio>(defaultPortfolio);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserPortfolio(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserPortfolio(session.user.id);
      } else {
        setPortfolio(defaultPortfolio);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserPortfolio = async (userId: string) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create new portfolio
          const { error: insertError } = await supabase
            .from('portfolios')
            .insert({
              user_id: userId,
              portfolio_data: defaultPortfolio,
            });

          if (insertError) throw insertError;
          setPortfolio(defaultPortfolio);
        } else {
          throw error;
        }
      } else if (data) {
        setPortfolio(data.portfolio_data);
      }
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Failed to load portfolio. Please try again.');
    }
  };

  const savePortfolio = async (updatedPortfolio: Portfolio) => {
    if (!session?.user?.id || isUpdating) return;

    setIsUpdating(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const { error: updateError } = await supabase
          .from('portfolios')
          .update({ 
            portfolio_data: updatedPortfolio,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('portfolios')
          .insert({
            user_id: session.user.id,
            portfolio_data: updatedPortfolio,
          });

        if (insertError) throw insertError;
      }

      setPortfolio(updatedPortfolio);
    } catch (err) {
      console.error('Error saving portfolio:', err);
      setError('Failed to save changes. Please try again.');
      await loadUserPortfolio(session.user.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddStock = async (stock: Stock) => {
    const updatedPortfolio = {
      ...portfolio,
      stocks: [...portfolio.stocks, stock],
    };
    await savePortfolio(updatedPortfolio);
  };

  const handleRemoveStock = async (symbol: string) => {
    const updatedPortfolio = {
      ...portfolio,
      stocks: portfolio.stocks.filter((stock) => stock.symbol !== symbol),
    };
    await savePortfolio(updatedPortfolio);
  };

  const handleSetGoal = async (goal: number, date: string) => {
    const updatedPortfolio = {
      ...portfolio,
      investmentGoal: goal,
      targetDate: date,
    };
    await savePortfolio(updatedPortfolio);
  };

  const calculateTotalValue = () => {
    return portfolio.stocks.reduce((total, stock) => {
      const currentPrice = mockStockData[stock.symbol]?.price || stock.purchasePrice;
      return total + currentPrice * stock.shares;
    }, 0);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PortfolioForm onAddStock={handleAddStock} />
          <PortfolioAnalytics
            portfolio={portfolio.stocks}
            stockData={mockStockData}
          />
          <PortfolioOverview
            portfolio={portfolio.stocks}
            stockData={mockStockData}
            onRemoveStock={handleRemoveStock}
          />
        </div>
        <div className="space-y-6">
          <GoalSetting
            onSetGoal={handleSetGoal}
            currentValue={calculateTotalValue()}
            investmentGoal={portfolio.investmentGoal}
            targetDate={portfolio.targetDate}
          />
          <NewsFeed news={mockNews} />
        </div>
      </div>
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/options-calculator" element={<OptionsCalculator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;