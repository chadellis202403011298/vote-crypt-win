import { useState } from "react";
import CandidateGrid from "@/components/app/CandidateGrid";
import BetComposer from "@/components/app/BetComposer";
import MyPredictions from "@/components/app/MyPredictions";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getCandidateById } from "@/data/candidates";

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

  const selectedCandidateData = selectedCandidate !== null ? getCandidateById(selectedCandidate) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-6 md:py-12">
      <div className="container max-w-7xl">
        {/* Minimal Header */}
        <div className="mb-8 md:mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                2026 Election Prediction
              </h1>
              <p className="text-muted-foreground">
                Encrypted · Secure · Transparent
              </p>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <div>
                  <div className="font-bold">12.8K</div>
                  <div className="text-xs text-muted-foreground">Predictions</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <div>
                  <div className="font-bold">127</div>
                  <div className="text-xs text-muted-foreground">Days Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

          {/* Left Column - Candidates (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                1
              </span>
              Choose Your Candidate
            </div>

            <CandidateGrid
              onSelectCandidate={setSelectedCandidate}
              selectedCandidate={selectedCandidate}
            />

            {/* Privacy Badge */}
            <Card className="p-4 bg-accent/5 border-accent/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">End-to-End Encryption</p>
                  <p className="text-xs text-muted-foreground">
                    Your choice is encrypted in browser using Zama FHE. Only you can decrypt your prediction.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Bet Form (Sticky on large screens) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                  2
                </span>
                Place Your Bet
              </div>

              <BetComposer
                candidateId={selectedCandidate}
                candidateName={selectedCandidateData?.name}
              />
            </div>
          </div>
        </div>

        {/* My Predictions Section */}
        <div className="mt-12 md:mt-16">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold">
              3
            </span>
            Track Your Predictions
          </div>

          <MyPredictions />
        </div>
      </div>
    </div>
  );
};

export default PredictionApp;
