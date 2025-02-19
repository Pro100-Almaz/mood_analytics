export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface ResearchStep {
  id: number;
  text: string;
  status: StepStatus;
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress';
}

export interface ProgressCardProps {
  title: string;
  steps: ResearchStep[];
  currentStep: number;
}

export interface ResearchData {
  topic: string;
  questions: string[];
  status: 'collecting' | 'analyzing' | 'completed';
} 