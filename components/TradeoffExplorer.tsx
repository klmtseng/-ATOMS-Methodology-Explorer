import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulationPoint } from '../types';

const TradeoffExplorer: React.FC = () => {
  // State for the "Non-stationarity" parameter (eta in the paper)
  const [drift, setDrift] = useState<number>(0.5);
  // State for Model Complexity (gamma in the paper - misspecification)
  const [complexity, setComplexity] = useState<number>(0.5);

  const data = useMemo(() => {
    const points: SimulationPoint[] = [];
    // Generating curves based on Eq 3.1 and Theorem 3.1
    // Error ~ Misspecification + Variance + NonStationarity
    // Variance ~ 1/k
    // NonStationarity ~ k * drift
    
    // We simulate two model classes: Simple (Linear) and Complex (Kernel/RF)
    
    for (let k = 1; k <= 100; k += 2) {
      // Simple Model: High Bias (Misspecification), Low Variance
      const simpleMisspec = 0.8; 
      const simpleVar = 0.5 / k;
      const simpleDrift = k * (drift * 0.005);
      const simpleError = simpleMisspec + simpleVar + simpleDrift;

      // Complex Model: Low Bias, High Variance
      // Complex models are more sensitive to drift if they overfit to old regimes
      const complexMisspec = 0.1; // Low intrinsic bias
      const complexVar = 5.0 / Math.pow(k, 0.6); // Higher variance, needs more data
      const complexDrift = k * (drift * 0.008); // Slightly higher sensitivity to drift
      const complexError = complexMisspec + complexVar + complexDrift;

      points.push({
        windowSize: k,
        bias: 0, 
        variance: 0, 
        nonStationarity: 0,
        totalError: 0, 
        model: 'Simulated',
        simpleError,
        complexError,
      });
    }
    return points;
  }, [drift]);

  // Find optimal K for visual reference
  const optimalKSimple = data.reduce((prev, curr) => (curr.simpleError < prev.simpleError ? curr : prev)).windowSize;
  const optimalKComplex = data.reduce((prev, curr) => (curr.complexError < prev.complexError ? curr : prev)).windowSize;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">The Nonstationarity-Complexity Tradeoff</h2>
        <p className="text-slate-600 mb-4">
          Visualizing <strong>Theorem 3.1</strong>. Adjust the environmental drift (non-stationarity) to see how the optimal training window ($k^*$) and best performing model class changes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Environmental Drift ($\eta$)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={drift * 100}
              onChange={(e) => setDrift(Number(e.target.value) / 100)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Stationary (Stable)</span>
              <span>Highly Non-Stationary (Crisis)</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center text-sm text-slate-600 space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span>Simple Model Optimal Window: <strong>{optimalKSimple}</strong></span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span>Complex Model Optimal Window: <strong>{optimalKComplex}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="windowSize" 
              label={{ value: 'Training Window Size (k)', position: 'insideBottom', offset: -5 }} 
              tick={{fill: '#64748b'}}
            />
            <YAxis 
              label={{ value: 'Prediction Error', angle: -90, position: 'insideLeft' }} 
              tick={{fill: '#64748b'}}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              formatter={(value: number) => value.toFixed(3)}
            />
            <Legend verticalAlign="top" height={36}/>
            
            <ReferenceLine x={optimalKSimple} stroke="#3b82f6" strokeDasharray="3 3" />
            <ReferenceLine x={optimalKComplex} stroke="#f97316" strokeDasharray="3 3" />

            <Line 
              type="monotone" 
              dataKey="simpleError" 
              name="Simple Model (High Bias)" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              type="monotone" 
              dataKey="complexError" 
              name="Complex Model (Low Bias)" 
              stroke="#f97316" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
        <strong>Observation:</strong> As non-stationarity increases (slider right), the optimal window size shrinks for both models. Crucially, the "Simple Model" may start outperforming the "Complex Model" because the complex model requires too much data to reduce variance, forcing it to ingest old, biased data.
      </div>
    </div>
  );
};

export default TradeoffExplorer;