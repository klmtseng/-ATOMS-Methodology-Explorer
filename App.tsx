import React, { useState } from 'react';
import { LayoutDashboard, GitBranch, BarChart3, BookOpen } from 'lucide-react';
import TradeoffExplorer from './components/TradeoffExplorer';
import AtomSimulation from './components/AtomSimulation';
import PerformanceResults from './components/PerformanceResults';

function App() {
  const [activeTab, setActiveTab] = useState<'tradeoff' | 'simulation' | 'results'>('tradeoff');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ATOMS</h1>
              <p className="text-sm text-slate-500">Adaptive Tournament Model Selection for Return Prediction</p>
            </div>
            <a 
              href="#" 
              className="hidden md:flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <BookOpen size={16} className="mr-2" />
              View Paper
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg mb-8 max-w-md mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab('tradeoff')}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'tradeoff' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
            }`}
          >
            <GitBranch size={16} className="mr-2" />
            Theory & Tradeoff
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'simulation' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
            }`}
          >
            <LayoutDashboard size={16} className="mr-2" />
            Algorithm
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'results' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
            }`}
          >
            <BarChart3 size={16} className="mr-2" />
            Results
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'tradeoff' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                <p className="text-indigo-800">
                  <strong>Core Concept:</strong> Complex models require longer training windows to reduce variance, but longer windows introduce <em>non-stationarity bias</em>. 
                  ATOMS resolves this by jointly optimizing model class and window size.
                </p>
              </div>
              <TradeoffExplorer />
            </div>
          )}

          {activeTab === 'simulation' && (
             <div className="space-y-6">
               <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                <p className="text-indigo-800">
                  <strong>Algorithm Logic:</strong> The selection process works as a tournament. In each round, a pivot model competes against challengers. 
                  Critically, the comparison isn't on a fixed hold-out set, but on an <em>adaptive</em> validation window that minimizes estimation error.
                </p>
              </div>
              <AtomSimulation />
            </div>
          )}

          {activeTab === 'results' && (
             <div className="space-y-6">
               <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                <p className="text-indigo-800">
                  <strong>Empirical Evidence:</strong> Applying ATOMS to 17 Industry Portfolios (1990-2016). 
                  The method improves Out-of-Sample $R^2$ by 14-23% and generates 31% higher cumulative wealth compared to fixed-window benchmarks.
                </p>
              </div>
              <PerformanceResults />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Replication of methodologies from "The nonstationarity-complexity tradeoff in return prediction" (Capponi et al., 2025).</p>
        </div>
      </footer>
    </div>
  );
}

export default App;