import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Trophy, Clock } from "lucide-react";
import { useElectionTickets } from "@/hooks/useElectionMarkets";
import { useDecryptTickets } from "@/hooks/useDecryptTicket";
import { DEFAULT_ELECTION_ID } from "@/lib/config";
import { useState, useMemo } from "react";

/**
 * MyPredictions Component
 *
 * Secure prediction viewer with client-side decryption
 *
 * Features:
 * - Lists all user's encrypted predictions from blockchain
 * - Client-side FHE decryption using Gateway public decryption
 * - Toggle to show/hide decrypted data
 * - Real-time decryption status indicators
 * - Claim status tracking
 *
 * Privacy Architecture:
 * - Predictions are stored encrypted on-chain
 * - Only the user can decrypt their own predictions (ACL controlled)
 * - Decryption happens in browser using Zama FHE Gateway
 * - No server-side decryption or data exposure
 *
 * Technical Details:
 * - Uses React Query for efficient data fetching
 * - Memoized filtering to prevent unnecessary re-renders
 * - Batch decryption for optimal performance
 * - Graceful error handling for failed decryptions
 *
 * User Flow:
 * 1. Connect wallet to authenticate
 * 2. Component fetches all tickets from smart contract
 * 3. Filters to show only user's tickets
 * 4. Automatically decrypts data using FHE Gateway
 * 5. Displays decrypted candidate choice and stake amount
 *
 * @returns React component displaying user's predictions
 */
const MyPredictions = () => {
  // User authentication
  const { address } = useAccount();

  // Toggle state for showing/hiding decrypted data
  const [showDecrypted, setShowDecrypted] = useState(true);

  // Fetch all tickets for this election from smart contract
  const { data: allTickets, isLoading: isLoadingTickets } = useElectionTickets(DEFAULT_ELECTION_ID);

  /**
   * Filter tickets to show only current user's predictions
   *
   * Memoized to prevent infinite re-renders:
   * - Array.filter() creates a new array reference each time
   * - Without memoization, useDecryptTickets would re-run on every render
   * - useMemo ensures the array reference only changes when data changes
   */
  const myTickets = useMemo(() => {
    return allTickets?.filter(
      ticket => ticket.bettor.toLowerCase() === address?.toLowerCase()
    );
  }, [allTickets, address]);

  /**
   * Decrypt all user's tickets using FHE Gateway
   *
   * This hook:
   * - Decrypts encrypted candidate IDs (euint32)
   * - Decrypts encrypted stake amounts (euint64)
   * - Handles ACL permission errors
   * - Manages loading and error states
   */
  const decryptedMap = useDecryptTickets(myTickets, showDecrypted);

  // ============================================
  // STATE: No Wallet Connected
  // ============================================
  if (!address) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <Eye className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg sm:text-xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          Connect your wallet to view your encrypted predictions
        </p>
      </Card>
    );
  }

  // ============================================
  // STATE: Loading Tickets from Blockchain
  // ============================================
  if (isLoadingTickets) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 animate-spin text-accent" />
        <p className="text-sm sm:text-base text-muted-foreground">Loading your predictions...</p>
      </Card>
    );
  }

  // ============================================
  // STATE: No Predictions Found
  // ============================================
  if (!myTickets || myTickets.length === 0) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg sm:text-xl font-bold mb-2">No Predictions Yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          You haven't placed any predictions yet. Select a candidate above to get started!
        </p>
      </Card>
    );
  }

  // ============================================
  // RENDER: Prediction List with Decryption
  // ============================================

  return (
    <div className="space-y-4">
      {/* Header with Toggle Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">My Predictions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDecrypted(!showDecrypted)}
          className="gap-2 w-full sm:w-auto"
        >
          {showDecrypted ? (
            <>
              <Eye className="w-4 h-4" />
              Hide Details
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              Show Details
            </>
          )}
        </Button>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid gap-4">
        {myTickets.map((ticket) => {
          // Get decrypted data for this ticket
          const decrypted = decryptedMap.get(ticket.ticketId);
          const isDecrypting = decrypted?.isDecrypting ?? true;
          const hasError = decrypted?.error != null;

          return (
            <Card key={ticket.ticketId.toString()} className="border-2 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-accent/10 to-transparent p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="font-bold text-accent">#{ticket.ticketId.toString()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Ticket #{ticket.ticketId.toString()}</h3>
                    <p className="text-xs text-muted-foreground">
                      {ticket.commitment.slice(0, 8)}...{ticket.commitment.slice(-6)}
                    </p>
                  </div>
                </div>

                {ticket.claimed ? (
                  <Badge className="bg-green-600 text-white border-0 shadow-sm">
                    <Trophy className="w-3 h-3 mr-1" />
                    Claimed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1.5">
                    <Clock className="w-3 h-3" />
                    Active
                  </Badge>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                {showDecrypted && (
                  <div className="space-y-3">
                    {isDecrypting && (
                      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                        <span className="text-sm font-medium">Decrypting...</span>
                      </div>
                    )}

                    {!isDecrypting && hasError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <p className="text-sm font-medium text-destructive mb-1">
                          Decryption Failed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {decrypted?.error}
                        </p>
                      </div>
                    )}

                    {!isDecrypting && !hasError && decrypted && (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Candidate Card */}
                        <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-4 rounded-lg border border-accent/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-accent"></div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Candidate
                            </p>
                          </div>
                          <p className="text-3xl font-black text-accent">
                            #{decrypted.candidateIndex}
                          </p>
                        </div>

                        {/* Stake Card */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Stake
                            </p>
                          </div>
                          <p className="text-3xl font-black">
                            {decrypted.stakeEth}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">ETH</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!showDecrypted && (
                  <div className="py-8 px-4 bg-muted/50 rounded-lg border border-dashed text-center">
                    <Eye className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Prediction Hidden
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click "Show Details" to decrypt
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Privacy Note (Minimal) */}
      <Card className="bg-accent/5 border-accent/20">
        <div className="p-4 flex items-center gap-3">
          <Eye className="w-4 h-4 text-accent flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong className="font-semibold text-foreground">Private by design.</strong> Only you can decrypt your predictions using your wallet.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MyPredictions;
