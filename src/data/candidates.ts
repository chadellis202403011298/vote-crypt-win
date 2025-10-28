export interface CandidateProfile {
  id: number;
  name: string;
  party: string;
  odds: string;
  support: number;
  avatar: string;
}

export const candidateProfiles: CandidateProfile[] = [
  {
    id: 0,
    name: "John Anderson",
    party: "Democratic Party",
    odds: "1.95",
    support: 48.2,
    avatar: "🔵",
  },
  {
    id: 1,
    name: "Sarah Mitchell",
    party: "Republican Party",
    odds: "2.05",
    support: 46.8,
    avatar: "🔴",
  },
  {
    id: 2,
    name: "Michael Chen",
    party: "Independent",
    odds: "15.00",
    support: 5.0,
    avatar: "⚪",
  },
];

export function getCandidateById(id: number) {
  return candidateProfiles.find((candidate) => candidate.id === id);
}
