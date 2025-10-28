import { useState } from "react";
import CandidateGrid from "@/components/app/CandidateGrid";
import BetComposer from "@/components/app/BetComposer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Prediction App Page - Main DApp interface for placing encrypted predictions
 *
 * Flow:
 * 1. User connects wallet (MetaMask, WalletConnect, Safe)
 * 2. User selects a candidate from the grid
 * 3. User enters bet amount (minimum 0.01 ETH)
 * 4. Data is encrypted using Zama FHE SDK in browser
 * 5. Encrypted prediction is submitted to smart contract
 *
 * Privacy: All candidate choices and bet amounts are encrypted
 * using Fully Homomorphic Encryption before submission to blockchain
 */
const PredictionApp = () => {
  // Track selected candidate index (0 or 1 for binary election)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">
                Prediction Desk
              </h1>
              <p className="text-lg text-muted-foreground">
                Select a candidate and place your encrypted prediction
              </p>
            </div>
            <Badge variant="outline" className="h-fit">
              <BarChart3 className="w-4 h-4 mr-1" />
              Live Markets
            </Badge>
          </div>
        </div>

        {/* Market Status */}
        <Card className="p-6 mb-8 border-2 border-accent">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">2024 Presidential Election</h3>
              <p className="text-sm text-muted-foreground">
                Market closes on Election Day - November 5, 2024
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-black">127</p>
                <p className="text-xs text-muted-foreground">Days Left</p>
              </div>
              <div className="text-center border-l pl-4">
                <p className="text-2xl font-black">12.8K</p>
                <p className="text-xs text-muted-foreground">Predictions</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Candidates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select Candidate</h2>
          <CandidateGrid
            onSelectCandidate={setSelectedCandidate}
            selectedCandidate={selectedCandidate}
          />
        </div>

        {/* Bet Form */}
        <BetComposer
          candidateId={selectedCandidate}
          candidateName={selectedCandidate ? `Candidate #${selectedCandidate}` : undefined}
        />
      </div>
    </div>
  );
};

export default PredictionApp;
