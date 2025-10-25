import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  party: string;
  odds: string;
  support: number;
  avatar: string;
}

interface CandidateGridProps {
  onSelectCandidate: (candidateId: number) => void;
  selectedCandidate: number | null;
}

// Display candidates with current odds and support levels
const CandidateGrid = ({ onSelectCandidate, selectedCandidate }: CandidateGridProps) => {
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "John Anderson",
      party: "Democratic Party",
      odds: "1.95",
      support: 48.2,
      avatar: "🔵",
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      party: "Republican Party",
      odds: "2.05",
      support: 46.8,
      avatar: "🔴",
    },
    {
      id: 3,
      name: "Michael Chen",
      party: "Independent",
      odds: "15.00",
      support: 5.0,
      avatar: "⚪",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <Card
          key={candidate.id}
          className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
            selectedCandidate === candidate.id
              ? "border-accent bg-accent/5"
              : "hover:border-accent/50"
          }`}
          onClick={() => onSelectCandidate(candidate.id)}
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
            {selectedCandidate === candidate.id && (
              <div className="pt-2">
                <Badge className="bg-accent">Selected</Badge>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CandidateGrid;
