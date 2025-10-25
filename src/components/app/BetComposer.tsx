import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BetComposerProps {
  candidateId: number | null;
  candidateName?: string;
}

// Bet composition form with FHE encryption simulation
const BetComposer = ({ candidateId, candidateName }: BetComposerProps) => {
  const [amount, setAmount] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const { toast } = useToast();

  // Simulate FHE encryption process
  const handlePlacePrediction = async () => {
    if (!candidateId || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select a candidate and enter a valid bet amount.",
        variant: "destructive",
      });
      return;
    }

    setIsEncrypting(true);

    // Simulate encryption delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Prediction Encrypted",
      description: `Your prediction for ${candidateName} (${amount} ETH) has been encrypted and submitted on-chain.`,
    });

    setIsEncrypting(false);
    setAmount("");
  };

  return (
    <Card className="p-8 border-2">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black mb-2">Place Your Prediction</h2>
          <p className="text-muted-foreground">
            Your bet will be encrypted using FHE before submission
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
          <div className="text-sm">
            <p className="font-bold mb-1">Privacy Guaranteed</p>
            <p className="text-muted-foreground">
              All data is encrypted in your browser before submission. No one can see your choices until official results are published.
            </p>
          </div>
        </div>

        {/* Bet Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="candidate" className="text-base font-bold">
              Selected Candidate
            </Label>
            <Input
              id="candidate"
              value={candidateId ? `Candidate #${candidateId}` : "No candidate selected"}
              disabled
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-base font-bold">
              Bet Amount (ETH)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 text-lg"
              disabled={!candidateId}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum: 0.01 ETH
            </p>
          </div>
        </div>

        {/* Encryption Info */}
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Lock className="w-4 h-4 text-accent" />
            Encryption Process
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
            <li>Candidate ID encrypted using FHE</li>
            <li>Bet amount encrypted using FHE</li>
            <li>Proof generated for verification</li>
            <li>Encrypted data submitted to smart contract</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handlePlacePrediction}
          disabled={!candidateId || !amount || isEncrypting}
          className="w-full text-lg font-bold h-14 bg-secondary hover:bg-secondary/90"
        >
          {isEncrypting ? (
            <>
              <Shield className="w-5 h-5 mr-2 animate-pulse" />
              Encrypting & Submitting...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Place Encrypted Prediction
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default BetComposer;
