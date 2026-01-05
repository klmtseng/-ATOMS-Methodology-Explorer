import React, { useState, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Upload, FileUp, RefreshCw } from 'lucide-react';
import { WealthData, RecessionData } from '../types';

// Mock data approximating Figure 6 in the paper (Cumulative Wealth)
const defaultWealthData: any[] = [
  { year: 1990, atoms: 1.0, fixed32: 1.0, fixed128: 1.0, fixed512: 1.0, fixedCV: 1.0 },
  { year: 1992, atoms: 1.3, fixed32: 1.1, fixed128: 1.15, fixed512: 1.1, fixedCV: 1.1 },
  { year: 1995, atoms: 1.8, fixed32: 1.4, fixed128: 1.5, fixed512: 1.45, fixedCV: 1.3 },
  { year: 1998, atoms: 2.5, fixed32: 1.9, fixed128: 2.1, fixed512: 1.8, fixedCV: 1.7 },
  { year: 2000, atoms: 3.2, fixed32: 2.3, fixed128: 2.5, fixed512: 2.2, fixedCV: 2.0 },
  { year: 2002, atoms: 4.1, fixed32: 2.5, fixed128: 2.7, fixed512: 2.4, fixedCV: 2.2 }, 
  { year: 2005, atoms: 5.5, fixed32: 3.2, fixed128: 3.5, fixed512: 3.1, fixedCV: 2.8 },
  { year: 2008, atoms: 6.8, fixed32: 4.0, fixed128: 4.2, fixed512: 3.9, fixedCV: 3.5 },
  { year: 2010, atoms: 8.2, fixed32: 4.5, fixed128: 4.8, fixed512: 4.3, fixedCV: 3.9 },
  { year: 2013, atoms: 10.5, fixed32: 5.8, fixed128: 6.2, fixed512: 5.5, fixedCV: 4.8 },
  { year: 2016, atoms: 12.8, fixed32: 7.2, fixed128: 7.8, fixed512: 7.0, fixedCV: 6.1 },
];

const defaultWealthKeys = [
  { key: 'atoms', color: '#0f172a', name: 'ATOMS', width: 3, dash: '' },
  { key: 'fixed128', color: '#f97316', name: 'Fixed-128', width: 2, dash: '' },
  { key: 'fixed512', color: '#ef4444', name: 'Fixed-512', width: 2, dash: '' },
  { key: 'fixed32', color: '#3b82f6', name: 'Fixed-32', width: 2, dash: '5 5' }
];

// Data from Table 2 in the paper
const recessionData: RecessionData[] = [
  { period: 'Gulf War (1990)', atoms: 0.027, fixed32: 0.009, fixed512: -0.031, fixedCV: -0.007 },
  { period: 'Dot-Com (2001)', atoms: 0.125, fixed32: 0.096, fixed512: 0.117, fixedCV: 0.071 },
  { period: 'Fin. Crisis (2008)', atoms: 0.041, fixed32: -0.001, fixed512: 0.039, fixedCV: 0.014 },
];

const COLORS = ['#0f172a', '#3b82f6', '#f97316', '#ef4444', '#22c55e', '#a855f7', '#db2777'];

const PerformanceResults: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>(defaultWealthData);
  const [chartKeys, setChartKeys] = useState<any[]>(defaultWealthKeys);
  const [isCustom, setIsCustom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) return;

        const headers = lines[0].split(',').map(h => h.trim());
        const xKey = headers[0]; // Assume first column is X-axis (Year/Date)
        const yKeys = headers.slice(1);

        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          
          // Handle X-Axis (try number, else string)
          const xVal = values[0].trim();
          obj[xKey] = isNaN(Number(xVal)) ? xVal : Number(xVal);

          // Handle Y-Axis values
          yKeys.forEach((key, i) => {
            const val = parseFloat(values[i + 1]);
            obj[key] = isNaN(val) ? 0 : val;
          });
          return obj;
        });

        // Generate keys configuration
        const newKeys = yKeys.map((key, index) => ({
          key,
          color: COLORS[index % COLORS.length],
          name: key,
          width: 2,
          dash: ''
        }));

        setChartData(parsedData);
        setChartKeys(newKeys);
        setIsCustom(true);
      } catch (err) {
        console.error("Failed to parse CSV", err);
        alert("Error parsing CSV. Ensure format is: Year, Series1, Series2...");
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    setChartData(defaultWealthData);
    setChartKeys(defaultWealthKeys);
    setIsCustom(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Recession Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Performance During Recessions (Out-of-Sample $R^2$)</h3>
        <p className="text-slate-600 mb-6">
          Replicating <strong>Table 2</strong>. ATOMS consistently outperforms benchmarks during economic downturns, particularly in the 2001 recession and the Gulf War, where simple models trained on short windows (selected by ATOMS) beat complex models.
        </p>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recessionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tick={{fill: '#475569'}} />
              <YAxis tick={{fill: '#475569'}} />
              <ReTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="atoms" name="ATOMS (Ours)" fill="#1e293b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fixed32" name="Fixed-Val (32)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fixed512" name="Fixed-Val (512)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fixedCV" name="Fixed-CV" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Wealth */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Cumulative Wealth Accumulation</h3>
            <p className="text-slate-600">
              {isCustom 
                ? "Visualizing imported dataset." 
                : "Replicating Figure 6. Log cumulative wealth of trading strategies."}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            
            {isCustom ? (
              <button 
                onClick={resetData}
                className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} className="mr-2" />
                Reset to Paper Data
              </button>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                <FileUp size={16} className="mr-2" />
                Import Dataset (CSV)
              </button>
            )}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={Object.keys(chartData[0] || {})[0]} 
                tick={{fill: '#64748b'}} 
              />
              <YAxis 
                scale={isCustom ? "auto" : "log"} 
                domain={['auto', 'auto']} 
                tick={{fill: '#64748b'}} 
                label={{ value: isCustom ? 'Value' : 'Log Cumulative Wealth', angle: -90, position: 'insideLeft' }} 
              />
              <ReTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend verticalAlign="top" height={36}/>
              
              {chartKeys.map((config) => (
                <Line 
                  key={config.key}
                  type="monotone" 
                  dataKey={config.key} 
                  name={config.name} 
                  stroke={config.color} 
                  strokeWidth={config.width} 
                  dot={false} 
                  strokeDasharray={config.dash} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded text-xs text-slate-500">
           <strong>CSV Format Guide:</strong> The first column should be the Year/Date (X-Axis). Subsequent columns will be plotted as separate series (Y-Axis). Example: <code>Year, MyStrategy, Benchmark</code>.
        </div>
      </div>
    </div>
  );
};

export default PerformanceResults;