import { create } from 'zustand';
import { ResumeAnalysis } from '../types';

interface AnalysisState {
  currentAnalysis: ResumeAnalysis | null;
  history: ResumeAnalysis[];
  setAnalysis: (data: ResumeAnalysis) => void;
  setHistory: (history: ResumeAnalysis[]) => void;
  addHistory: (item: ResumeAnalysis) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  history: [],
  setAnalysis: (data) => set({ currentAnalysis: data }),
  setHistory: (history) => set({ history }),
  addHistory: (item) => set((state) => ({ 
    history: [item, ...state.history] 
  })),
}));
