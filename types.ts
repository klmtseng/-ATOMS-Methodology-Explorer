export enum ModelClass {
  LINEAR = 'Linear (Ridge)',
  RF = 'Random Forest'
}

export enum WindowSize {
  SHORT = 'Short (64mo)',
  LONG = 'Long (All History)'
}

export interface SimulationPoint {
  windowSize: number;
  bias: number;
  variance: number;
  nonStationarity: number;
  totalError: number;
  model: string;
  simpleError?: number;
  complexError?: number;
}

export interface WealthData {
  year: number;
  atoms: number;
  fixed32: number;
  fixed128: number;
  fixed512: number;
  fixedCV: number;
}

export interface RecessionData {
  period: string;
  atoms: number;
  fixed32: number;
  fixed512: number;
  fixedCV: number;
}

export interface CandidateModel {
  id: string;
  type: ModelClass;
  trainingWindow: WindowSize;
  color: string;
  performanceScore: number; // Simulated latent performance
}