import React, { useState } from 'react';
import { Target } from 'lucide-react';

interface GoalSettingProps {
  onSetGoal: (goal: number, date: string) => void;
  currentValue: number;
  investmentGoal: number;
  targetDate: string;
}

export default function GoalSetting({ onSetGoal, currentValue, investmentGoal, targetDate }: GoalSettingProps) {
  const [newInvestmentGoal, setNewInvestmentGoal] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetGoal(Number(newInvestmentGoal), newTargetDate);
    setNewInvestmentGoal('');
    setNewTargetDate('');
  };

  const progressPercentage = investmentGoal > 0 
    ? Math.min((currentValue / investmentGoal) * 100, 100)
    : 0;

  const daysRemaining = targetDate 
    ? Math.max(Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Target className="w-6 h-6 mr-2 text-blue-600" />
        Investment Goal
      </h2>

      {investmentGoal > 0 && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: ${currentValue.toLocaleString()} of ${investmentGoal.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {targetDate && (
            <p className="mt-2 text-sm text-gray-600">
              {daysRemaining} days remaining to reach your goal
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Amount ($)</label>
          <input
            type="number"
            value={newInvestmentGoal}
            onChange={(e) => setNewInvestmentGoal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Date</label>
          <input
            type="date"
            value={newTargetDate}
            onChange={(e) => setNewTargetDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Set Goal
        </button>
      </form>
    </div>
  );
}