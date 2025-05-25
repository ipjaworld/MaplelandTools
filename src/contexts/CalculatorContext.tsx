import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { 
  CalculatorState, 
  CalculationHistory, 
  CalculatorAction,
  CalculationResult 
} from '../types/calculator';

interface CalculatorContextType {
  state: CalculatorState;
  setProbability: (probability: number) => void;
  setTrials: (trials: number) => void;
  setResults: (results: CalculationResult[]) => void;
  setCalculating: (calculating: boolean) => void;
  addToHistory: (calculation: Omit<CalculationHistory, 'id' | 'timestamp'>) => void;
  updateHistoryNote: (id: string, notes: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  resetCalculator: () => void;
}

// 초기 상태
const initialState: CalculatorState = {
  probability: 0.1, // 10%
  trials: 10,
  results: [],
  isCalculating: false,
  history: [],
};

// 리듀서
const calculatorReducer = (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  switch (action.type) {
    case 'SET_PROBABILITY':
      return { ...state, probability: action.payload };
    case 'SET_TRIALS':
      return { ...state, trials: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.payload };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        history: [action.payload, ...state.history.slice(0, 49)] // 최대 50개 기록 유지
      };
    case 'UPDATE_HISTORY_NOTE':
      return {
        ...state,
        history: state.history.map(item =>
          item.id === action.payload.id
            ? { ...item, notes: action.payload.notes }
            : item
        )
      };
    case 'REMOVE_FROM_HISTORY':
      return {
        ...state,
        history: state.history.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'RESET_CALCULATOR':
      return { ...initialState, history: state.history }; // 히스토리는 유지
    default:
      return state;
  }
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

interface CalculatorProviderProps {
  children: React.ReactNode;
}

export const CalculatorProvider: React.FC<CalculatorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const setProbability = useCallback((probability: number) => {
    dispatch({ type: 'SET_PROBABILITY', payload: probability });
  }, []);

  const setTrials = useCallback((trials: number) => {
    dispatch({ type: 'SET_TRIALS', payload: trials });
  }, []);

  const setResults = useCallback((results: CalculationResult[]) => {
    dispatch({ type: 'SET_RESULTS', payload: results });
  }, []);

  const setCalculating = useCallback((calculating: boolean) => {
    dispatch({ type: 'SET_CALCULATING', payload: calculating });
  }, []);

  const addToHistory = useCallback((calculation: Omit<CalculationHistory, 'id' | 'timestamp'>) => {
    const historyItem: CalculationHistory = {
      ...calculation,
      id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_TO_HISTORY', payload: historyItem });
  }, []);

  const updateHistoryNote = useCallback((id: string, notes: string) => {
    dispatch({ type: 'UPDATE_HISTORY_NOTE', payload: { id, notes } });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_HISTORY', payload: id });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const resetCalculator = useCallback(() => {
    dispatch({ type: 'RESET_CALCULATOR' });
  }, []);

  const value: CalculatorContextType = {
    state,
    setProbability,
    setTrials,
    setResults,
    setCalculating,
    addToHistory,
    updateHistoryNote,
    removeFromHistory,
    clearHistory,
    resetCalculator,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};