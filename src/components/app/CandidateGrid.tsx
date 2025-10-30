import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy, Check } from "lucide-react";
import { candidateProfiles } from "@/data/candidates";

interface CandidateGridProps {
  onSelectCandidate: (candidateId: number) => void;
  selectedCandidate: number | null;
  disabled?: boolean;
  winningCandidate?: number | null;
}

/**
 * Modern Candidate Grid Component
 *
 * Features:
 * - Gradient backgrounds for visual appeal
 * - Large, prominent avatars
 * - Clean data visualization
 * - Smooth hover effects and animations
 * - Clear selection state
 */
const CandidateGrid = ({ onSelectCandidate, selectedCandidate, disabled = false, winningCandidate }: CandidateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {candidateProfiles.map((candidate) => {
        const isSelected = selectedCandidate === candidate.id;
        const isWinner = winningCandidate === candidate.id;

        return (
          <Card
            key={candidate.id}
            className={`group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              isSelected
                ? "border-accent shadow-lg shadow-accent/20 scale-[1.02]"
                : "border-border hover:border-accent/50 hover:shadow-md"
            }`}
            onClick={() => !disabled && onSelectCandidate(candidate.id)}
          >
            {/* Selection Checkmark */}
            {isSelected && (
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            )}

            {/* Winner Badge */}
            {isWinner && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-yellow-500 text-yellow-950 gap-1 shadow-lg">
                  <Trophy className="w-3 h-3" /> Winner
                </Badge>
              </div>
            )}

            {/* Card Content */}
            <div className="p-6 space-y-5">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className={`text-7xl mb-3 transition-transform duration-300 ${
                  isSelected ? "scale-110" : "group-hover:scale-105"
                }`}>
                  {candidate.avatar}
                </div>
                <h3 className="text-xl font-bold text-center mb-1.5">{candidate.name}</h3>
                <Badge variant="secondary" className="text-xs font-medium">
                  {candidate.party}
                </Badge>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                {/* Odds */}
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Odds</p>
                  <p className="text-2xl font-black">{candidate.odds}</p>
                </div>

                {/* Support */}
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <p className="text-xs font-medium text-muted-foreground">Support</p>
                  </div>
                  <p className="text-2xl font-black">{candidate.support}%</p>
                </div>
              </div>

              {/* Hover Indicator */}
              {!isSelected && (
                <div className="pt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-muted-foreground">Click to select</p>
                </div>
              )}
            </div>

            {/* Bottom Accent Bar (only when selected) */}
            {isSelected && (
              <div className="h-1.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default CandidateGrid;
