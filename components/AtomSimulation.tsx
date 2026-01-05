import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy, Activity, ArrowRight } from 'lucide-react';
import { CandidateModel, ModelClass, WindowSize } from '../types';

const INITIAL_MODELS: CandidateModel[] = [
  { id: 'm1', type: ModelClass.LINEAR, trainingWindow: WindowSize.SHORT, color: 'bg-blue-100 border-blue-300 text-blue-800', performanceScore: 0.65 },
  { id: 'm2', type: ModelClass.LINEAR, trainingWindow: WindowSize.LONG, color: 'bg-indigo-100 border-indigo-300 text-indigo-800', performanceScore: 0.55 },
  { id: 'm3', type: ModelClass.RF, trainingWindow: WindowSize.SHORT, color: 'bg-orange-100 border-orange-300 text-orange-800', performanceScore: 0.70 },
  { id: 'm4', type: ModelClass.RF, trainingWindow: WindowSize.LONG, color: 'bg-red-100 border-red-300 text-red-800', performanceScore: 0.40 },
];

const AtomSimulation: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateModel[]>(INITIAL_MODELS);
  const [pivot, setPivot] = useState<CandidateModel | null>(null);
  const [challenger, setChallenger] = useState<CandidateModel | null>(null);
  const [step, setStep] = useState<number>(0); // 0: Idle, 1: Pick Pivot, 2: Comparing, 3: Elimination, 4: Winner
  const [winner, setWinner] = useState<CandidateModel | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);

  const reset = () => {
    setCandidates(INITIAL_MODELS);
    setPivot(null);
    setChallenger(null);
    setStep(0);
    setWinner(null);
    setLog([]);
    setCurrentRound(1);
  };

  const nextStep = () => {
    if (step === 0) {
      // Start: Pick Pivot
      const randIdx = Math.floor(Math.random() * candidates.length);
      const p = candidates[randIdx];
      setPivot(p);
      setLog(prev => [...prev, `Round ${currentRound}: Selected Pivot Model: ${p.type} (${p.trainingWindow})`]);
      setStep(1);
    } else if (step === 1) {
      // Select Challengers (Logical step, in visual we just pick one to show comparison)
      // In the paper, we compare Pivot vs All Remaining.
      // For visualization, we will simulate the tournament round in one go.
      setStep(2);
    } else if (step === 2) {
      // Comparison Subroutine (Algorithm 2)
      if (!pivot) return;
      
      const survivors: CandidateModel[] = [];
      let pivotDefeated = false;
      const roundLog: string[] = [];

      // Simulate Algorithm 2: Adaptive Window Comparison
      // We check if any model has significantly better score than pivot
      const betterModels = candidates.filter(c => c.id !== pivot.id && c.performanceScore > pivot.performanceScore);
      
      if (betterModels.length > 0) {
        // Pivot lost
        setLog(prev => [...prev, `Analyzed adaptive validation windows...`]);
        betterModels.forEach(m => {
           setLog(prev => [...prev, `Model ${m.id} outperforms Pivot on optimal window.`]);
        });
        setCandidates(betterModels);
        setLog(prev => [...prev, `Pivot ${pivot.id} eliminated. Survivors advance.`]);
      } else {
        // Pivot won all
        setCandidates([pivot]);
        setLog(prev => [...prev, `Pivot ${pivot.id} defeated all challengers on adaptive windows.`]);
      }
      
      setStep(3);
    } else if (step === 3) {
      // Check for winner
      if (candidates.length === 1) {
        setWinner(candidates[0]);
        setStep(4);
        setLog(prev => [...prev, `🏆 TOURNAMENT WINNER: ${candidates[0].type} (${candidates[0].trainingWindow})`]);
      } else {
        // Next round
        setPivot(null);
        setStep(0);
        setCurrentRound(r => r + 1);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">ATOMS Simulation</h2>
          <p className="text-slate-600 text-sm mt-1">
            Simulating <strong>Algorithm 1</strong> (Tournament) & <strong>Algorithm 2</strong> (Adaptive Comparison).
            <br/>The algorithm compares models using validation data tailored to local non-stationarity.
          </p>
        </div>
        <button 
          onClick={step === 4 ? reset : nextStep}
          className={`flex items-center px-4 py-2 rounded-md font-medium text-white transition-colors ${
            step === 4 ? 'bg-slate-600 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {step === 0 ? <><Play size={16} className="mr-2"/> Start Round</> : 
           step === 4 ? <><RotateCcw size={16} className="mr-2"/> Reset</> : 
           <><ArrowRight size={16} className="mr-2"/> Next Step</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pool */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[300px]">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Candidate Pool</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidates.map((model) => (
                <div 
                  key={model.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${model.color} ${
                    pivot?.id === model.id ? 'ring-4 ring-indigo-200 scale-105' : 'border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{model.type}</span>
                    {pivot?.id === model.id && <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">PIVOT</span>}
                  </div>
                  <div className="text-sm opacity-80 mt-1">{model.trainingWindow}</div>
                  
                  {step === 2 && pivot?.id !== model.id && (
                    <div className="mt-3 text-xs bg-white/50 p-2 rounded">
                      Comparing {'$\\hat{\\Delta}_{t,\\ell}$'} on adaptive window...
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {winner && (
              <div className="mt-8 flex flex-col items-center justify-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl animate-bounce-short">
                <Trophy size={48} className="text-yellow-500 mb-2" />
                <h3 className="text-xl font-bold text-yellow-800">Selected Model</h3>
                <p className="text-yellow-700">{winner.type} trained on {winner.trainingWindow}</p>
                <p className="text-sm text-yellow-600 mt-2 text-center max-w-md">
                  ATOMS selected this model because it maximized the $R^2$ on the optimal validation window 
                  $\ell^*$, balancing the bias from non-stationarity and the variance of estimation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Log */}
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-y-auto max-h-[400px]">
          <h3 className="text-slate-400 text-xs uppercase mb-2 border-b border-slate-700 pb-2">Tournament Log</h3>
          <div className="space-y-2">
            {log.length === 0 && <span className="text-slate-600 italic">Ready to start...</span>}
            {log.map((entry, i) => (
              <div key={i} className="flex items-start">
                <span className="mr-2 opacity-50">{'>'}</span>
                <span>{entry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomSimulation;