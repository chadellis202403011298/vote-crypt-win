import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, AlertCircle, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, keccak256, encodePacked } from "viem";
import { encryptElectionPrediction } from "@/lib/fhe";
import { getElectionContractAddress, DEFAULT_ELECTION_ID } from "@/lib/config";
import ElectionBetABI from "@/lib/abi/ElectionBettingPool.json";

interface BetComposerProps {
  candidateId: number | null;
  candidateName?: string;
}

/**
 * Bet composition form with real FHE encryption and blockchain interaction
 * - Encrypts candidate choice and stake amount using Zama FHE SDK
 * - Generates commitment hash to prevent replay attacks
 * - Submits encrypted data to ElectionBettingPool smart contract
 */
const BetComposer = ({ candidateId, candidateName }: BetComposerProps) => {
  const [amount, setAmount] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();
  const { isLoading: isTxConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  /**
   * Handles the full prediction placement flow:
   * 1. Validates inputs
   * 2. Encrypts candidate ID and stake amount using FHE
   * 3. Generates commitment hash
   * 4. Submits transaction to smart contract
   */
  const handlePlacePrediction = async () => {
    // Validation
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to place a prediction.",
        variant: "destructive",
      });
      return;
    }

    if (candidateId === null || candidateId === undefined) {
      toast({
        title: "No Candidate Selected",
        description: "Please select a candidate first.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bet amount (minimum 0.01 ETH).",
        variant: "destructive",
      });
      return;
    }

    if (amountNum < 0.01) {
      toast({
        title: "Amount Too Small",
        description: "Minimum bet amount is 0.01 ETH.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEncrypting(true);

      // Convert ETH to wei
      const stakeWei = parseEther(amount);

      toast({
        title: "Encrypting Data",
        description: "Encrypting your prediction using FHE... This may take a few seconds.",
      });

      // Encrypt candidate ID and stake amount using FHE SDK
      const { candidateHandle, stakeHandle, proof } = await encryptElectionPrediction(
        address,
        candidateId,
        stakeWei
      );

      // Generate commitment hash to prevent replay attacks
      const commitment = keccak256(
        encodePacked(
          ["address", "uint256", "bytes32", "bytes32"],
          [address, BigInt(DEFAULT_ELECTION_ID), candidateHandle, stakeHandle]
        )
      );

      setIsEncrypting(false);

      toast({
        title: "Encryption Complete",
        description: "Submitting encrypted prediction to blockchain...",
      });

      // Submit encrypted prediction to smart contract
      writeContract({
        address: getElectionContractAddress(),
        abi: ElectionBetABI.abi,
        functionName: "placePrediction",
        args: [
          BigInt(DEFAULT_ELECTION_ID),
          candidateHandle,
          stakeHandle,
          proof,
          commitment,
        ],
        value: stakeWei,
      });

    } catch (error) {
      setIsEncrypting(false);
      console.error("Prediction placement error:", error);

      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to place prediction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Monitor transaction confirmation
  if (txHash && !isTxConfirming && !isWriting) {
    toast({
      title: "Prediction Placed Successfully!",
      description: `Your encrypted prediction for ${candidateName} has been recorded on-chain.`,
    });
    setAmount("");
  }

  const isProcessing = isEncrypting || isWriting || isTxConfirming;

  return (
    <Card className="p-8 border-2">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black mb-2">Place Your Prediction</h2>
          <p className="text-muted-foreground">
            Your bet will be encrypted using FHE before submission
          </p>
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-4 flex items-start gap-3">
            <Wallet className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Wallet Required</p>
              <p className="text-muted-foreground">
                Please connect your wallet using the button in the top right corner to place predictions.
              </p>
            </div>
          </div>
        )}

        {/* Privacy Banner */}
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
              value={candidateId !== null ? `${candidateName || `Candidate #${candidateId}`}` : "No candidate selected"}
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
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 text-lg"
              disabled={!candidateId || !isConnected || isProcessing}
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
            <li>Candidate ID encrypted using Zama FHE SDK</li>
            <li>Bet amount encrypted using Zama FHE SDK</li>
            <li>Cryptographic proof generated for verification</li>
            <li>Encrypted data submitted to smart contract on Sepolia</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handlePlacePrediction}
          disabled={!candidateId || !amount || !isConnected || isProcessing}
          className="w-full text-lg font-bold h-14 bg-secondary hover:bg-secondary/90 disabled:opacity-50"
        >
          {isEncrypting ? (
            <>
              <Shield className="w-5 h-5 mr-2 animate-pulse" />
              Encrypting Data...
            </>
          ) : isWriting || isTxConfirming ? (
            <>
              <Shield className="w-5 h-5 mr-2 animate-spin" />
              Submitting Transaction...
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet First
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Place Encrypted Prediction
            </>
          )}
        </Button>

        {/* Transaction Hash Display */}
        {txHash && (
          <div className="text-xs text-muted-foreground text-center">
            <p>Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BetComposer;
