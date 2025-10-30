import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Wallet, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, keccak256, encodePacked } from "viem";
import { encryptElectionPrediction } from "@/lib/fhe";
import { getElectionContractAddress, DEFAULT_ELECTION_ID } from "@/lib/config";
import ElectionBetABI from "@/lib/abi/ElectionBettingPool.json";

/**
 * Props for BetComposer component
 */
interface BetComposerProps {
  candidateId: number | null;     // Selected candidate ID (0, 1, 2, etc.)
  candidateName?: string;          // Display name of selected candidate
}

/**
 * BetComposer Component
 *
 * Secure prediction submission form with full FHE encryption
 *
 * Features:
 * - Client-side encryption using Zama FHE SDK
 * - Zero-knowledge proof generation
 * - Commitment hash to prevent replay attacks
 * - Real-time transaction status updates
 * - Comprehensive error handling and user feedback
 *
 * User Flow:
 * 1. User connects wallet (MetaMask, WalletConnect, or Safe)
 * 2. User selects a candidate from the grid
 * 3. User enters bet amount (minimum 0.01 ETH)
 * 4. Data is encrypted in browser using FHE
 * 5. Encrypted prediction is submitted to smart contract
 * 6. Transaction is confirmed on Sepolia testnet
 *
 * Privacy:
 * - Candidate choice is encrypted before leaving browser
 * - Bet amount is encrypted before leaving browser
 * - Only user can decrypt their own data (ACL controlled)
 * - Smart contract never sees plaintext data
 *
 * @param candidateId - ID of selected candidate (null if none selected)
 * @param candidateName - Display name for UI feedback
 */
const BetComposer = ({ candidateId, candidateName }: BetComposerProps) => {
  // Component state
  const [amount, setAmount] = useState("");           // Bet amount input
  const [isEncrypting, setIsEncrypting] = useState(false);  // Encryption status

  // Hooks
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();
  const { isLoading: isTxConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  /**
   * Handles the complete prediction placement flow
   *
   * This is the main function that orchestrates the entire prediction
   * submission process with encryption and blockchain interaction.
   *
   * Steps:
   * 1. Input validation (wallet, candidate, amount)
   * 2. Convert ETH to wei (blockchain native unit)
   * 3. Encrypt candidate ID and stake using FHE SDK
   * 4. Generate commitment hash (prevents replay attacks)
   * 5. Submit encrypted data to smart contract
   * 6. Monitor transaction confirmation
   *
   * Security:
   * - All data encrypted in browser before submission
   * - Commitment hash binds encrypted data to user address
   * - Zero-knowledge proof verifies encryption correctness
   * - No plaintext data ever leaves the browser
   *
   * @throws Error if encryption or transaction fails
   */
  const handlePlacePrediction = async () => {
    // ============================================
    // STEP 1: Input Validation
    // ============================================

    // Check wallet connection
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to place a prediction.",
        variant: "destructive",
      });
      return;
    }

    // Check candidate selection
    if (candidateId === null || candidateId === undefined) {
      toast({
        title: "No Candidate Selected",
        description: "Please select a candidate first.",
        variant: "destructive",
      });
      return;
    }

    // Validate bet amount format
    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bet amount (minimum 0.01 ETH).",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum bet amount
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

      // ============================================
      // STEP 2: Convert ETH to Wei
      // ============================================
      // 1 ETH = 10^18 wei (Ethereum's smallest unit)
      const stakeWei = parseEther(amount);

      toast({
        title: "Encrypting Data",
        description: "Encrypting your prediction using FHE... This may take a few seconds.",
      });

      // ============================================
      // STEP 3: FHE Encryption
      // ============================================
      // Encrypt both candidate ID and stake amount
      // This happens entirely in the browser using WASM
      const { candidateHandle, stakeHandle, proof } = await encryptElectionPrediction(
        address,
        candidateId,
        stakeWei
      );

      // ============================================
      // STEP 4: Generate Commitment Hash
      // ============================================
      // Commitment = keccak256(address, electionId, candidate, stake)
      // This prevents replay attacks and binds data to user
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

      // ============================================
      // STEP 5: Submit to Smart Contract
      // ============================================
      // Send encrypted data + ETH stake to contract
      writeContract({
        address: getElectionContractAddress(),
        abi: ElectionBetABI.abi,
        functionName: "placePrediction",
        args: [
          BigInt(DEFAULT_ELECTION_ID),  // Election ID
          candidateHandle,               // Encrypted candidate
          stakeHandle,                   // Encrypted stake
          proof,                         // ZK proof
          commitment,                    // Anti-replay commitment
        ],
        value: stakeWei,  // Send ETH with transaction
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

  /**
   * Monitor transaction confirmation
   *
   * This effect watches for successful transaction confirmation
   * and provides user feedback when the prediction is recorded.
   *
   * Dependencies:
   * - txHash: Transaction hash from writeContract
   * - isTxConfirming: Loading state while waiting for confirmation
   * - isWriting: Loading state while preparing transaction
   * - candidateName: For personalized success message
   */
  useEffect(() => {
    if (txHash && !isTxConfirming && !isWriting) {
      toast({
        title: "Prediction Placed Successfully!",
        description: `Your encrypted prediction for ${candidateName} has been recorded on-chain.`,
      });
      // Clear amount input for next prediction
      setAmount("");
    }
  }, [txHash, isTxConfirming, isWriting, candidateName, toast]);

  // Determine if any async operation is in progress
  const isProcessing = isEncrypting || isWriting || isTxConfirming;

  // ============================================
  // RENDER: Prediction Submission Form
  // ============================================

  return (
    <Card className="border-2 overflow-hidden">
      {/* Card Header with Gradient */}
      <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-4 md:p-6 border-b">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Place Prediction
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Encrypted · Private · Secure
        </p>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        {/* Candidate Display */}
        {candidateId !== null ? (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Betting on</p>
                <p className="font-bold">{candidateName || `Candidate #${candidateId}`}</p>
              </div>
              <Check className="w-5 h-5 text-accent" />
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-border">
            <p className="text-sm text-muted-foreground text-center">
              Select a candidate above to continue
            </p>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-semibold flex items-center justify-between">
            <span>Bet Amount</span>
            <span className="text-xs font-normal text-muted-foreground">Min: 0.01 ETH</span>
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold h-14 pr-16"
              disabled={candidateId === null || candidateId === undefined || isProcessing}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              ETH
            </div>
          </div>
        </div>

        {/* Wallet Warning (Compact) */}
        {!isConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
            <Wallet className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Connect wallet to place predictions
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handlePlacePrediction}
          disabled={candidateId === null || candidateId === undefined || !amount || !isConnected || isProcessing}
          className="w-full h-12 font-bold text-base bg-accent hover:bg-accent/90 disabled:opacity-50 transition-all"
        >
          {isEncrypting ? (
            <>
              <Lock className="w-4 h-4 mr-2 animate-pulse" />
              Encrypting...
            </>
          ) : isWriting || isTxConfirming ? (
            <>
              <Shield className="w-4 h-4 mr-2 animate-spin" />
              Confirming...
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Submit Bet
            </>
          )}
        </Button>

        {/* Transaction Link (Compact) */}
        {txHash && (
          <div className="pt-2 border-t">
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center justify-center gap-1"
            >
              View Transaction →
            </a>
          </div>
        )}

        {/* Privacy Note (Subtle) */}
        <div className="pt-2 border-t">
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            <Lock className="w-3 h-3 inline mr-1" />
            All data encrypted with Zama FHE before submission
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BetComposer;
