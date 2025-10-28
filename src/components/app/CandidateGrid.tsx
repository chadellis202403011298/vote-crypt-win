import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy } from "lucide-react";
import { candidateProfiles } from "@/data/candidates";

interface CandidateGridProps {
  onSelectCandidate: (candidateId: number) => void;
  selectedCandidate: number | null;
  disabled?: boolean;
  winningCandidate?: number | null;
}

// Displays candidate cards sourced from newsroom data tokens.
const CandidateGrid = ({ onSelectCandidate, selectedCandidate, disabled = false, winningCandidate }: CandidateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {candidateProfiles.map((candidate) => {
        const isSelected = selectedCandidate === candidate.id;
        const isWinner = winningCandidate === candidate.id;
        return (
          <Card
            key={candidate.id}
            className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
              isSelected ? "border-accent bg-accent/5" : "hover:border-accent/50"
            }`}
            onClick={() => !disabled && onSelectCandidate(candidate.id)}
          >
            <div className="text-center space-y-4">
              {/* Avatar */}
              <div className="text-6xl">{candidate.avatar}</div>

              {/* Candidate Info */}
              <div>
                <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {candidate.party}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Odds</p>
                  <p className="text-2xl font-black">{candidate.odds}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Support
                  </p>
                  <p className="text-2xl font-black">{candidate.support}%</p>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="pt-2">
                  <Badge className="bg-accent">Selected</Badge>
                </div>
              )}
              {isWinner && (
                <div className="pt-2">
                  <Badge variant="outline" className="gap-1">
                    <Trophy className="w-3 h-3" /> Winner
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CandidateGrid;
