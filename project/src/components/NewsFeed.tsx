import React from 'react';
import { Newspaper } from 'lucide-react';
import type { StockNews } from '../types';

// TODO: This component needs to be reworked to:
// 1. Fetch real-time news data from a financial news API
// 2. Add filtering by stock symbols in portfolio
// 3. Implement infinite scroll or pagination
// 4. Add news categories and filtering
// 5. Include sentiment analysis for news impact
// 6. Add click tracking and personalization

interface NewsFeedProps {
  news: StockNews[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Newspaper className="w-6 h-6 mr-2 text-blue-600" />
        Latest News
      </h2>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{item.source}</span>
                <span className="mx-2">•</span>
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}