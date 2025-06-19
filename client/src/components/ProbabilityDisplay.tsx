import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface ProbabilityDisplayProps {
  winProbability: number;
  bustProbability: number;
  recommendation: string;
  recommendationColor: string;
}

export default function ProbabilityDisplay({ 
  winProbability, 
  bustProbability, 
  recommendation, 
  recommendationColor 
}: ProbabilityDisplayProps) {
  
  const getActionDisplay = () => {
    switch(recommendation) {
      case 'HIT': return { text: 'HIT', color: 'text-green-400' };
      case 'STAND': return { text: 'STAND', color: 'text-yellow-400' };
      case 'DOUBLE': return { text: 'DOUBLE', color: 'text-blue-400' };
      case 'BUST': return { text: 'BUST', color: 'text-red-500' };
      case 'BLACKJACK': return { text: 'BLACKJACK', color: 'text-green-400' };
      default: return { text: 'SELECT CARDS', color: 'text-slate-400' };
    }
  };

  const action = getActionDisplay();
  const showPercentages = recommendation && recommendation !== 'SELECT_CARDS';

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 shadow-lg">
      {/* Compact Action Display */}
      <div className="text-center mb-3">
        <div className={`text-4xl font-bold tracking-wide ${action.color}`}>
          {action.text}
        </div>
      </div>
      
      {/* Compact Percentages */}
      {showPercentages && (
        <div className="flex justify-center gap-6 pt-3 border-t border-slate-600/50">
          {/* Win Percentage */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{winProbability}%</div>
            <div className="text-xs text-green-300/80 font-medium">WIN</div>
          </div>
          
          {/* Separator */}
          <div className="w-px bg-slate-600/50 self-stretch"></div>
          
          {/* Bust Percentage */}
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{bustProbability}%</div>
            <div className="text-xs text-red-300/80 font-medium">BUST</div>
          </div>
        </div>
      )}
    </div>
  );
}
