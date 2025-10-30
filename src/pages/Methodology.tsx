import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, CheckCircle2, Database, Cpu, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Methodology Page
 *
 * Explains the technical implementation of ElectionBet's privacy-preserving
 * prediction market using Fully Homomorphic Encryption (FHE).
 *
 * Covers:
 * - What is FHE and how it works
 * - System architecture and data flow
 * - Privacy guarantees and security model
 * - Smart contract implementation details
 * - Settlement and payout process
 */
const Methodology = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            How ElectionBet Works
          </h1>
          <p className="text-xl text-muted-foreground">
            A technical deep-dive into privacy-preserving election predictions using Fully Homomorphic Encryption
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 md:p-8 mb-8 border-2 border-accent">
          <div className="flex items-start gap-4">
            <Shield className="w-12 h-12 text-accent flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Privacy-First Design</h2>
              <p className="text-muted-foreground leading-relaxed">
                ElectionBet uses <strong>Fully Homomorphic Encryption (FHE)</strong> to ensure complete privacy.
                Your candidate choice and bet amount are encrypted in your browser before being submitted to the blockchain.
                No one—not even the platform operators—can see individual predictions until official results are verified.
              </p>
            </div>
          </div>
        </Card>

        {/* What is FHE */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What is Fully Homomorphic Encryption?</h2>

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Fully Homomorphic Encryption (FHE)</strong> is a revolutionary cryptographic technique that allows
                computations to be performed directly on encrypted data without ever decrypting it.
              </p>

              <div className="bg-accent/10 border-2 border-accent rounded-lg p-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-accent" />
                  Key Concept
                </h3>
                <p className="text-sm text-muted-foreground">
                  With FHE, the smart contract can compute aggregate statistics (total bets per candidate, pool totals)
                  while keeping individual bets encrypted. Only when you explicitly decrypt your own data can you see
                  your predictions.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h4 className="font-bold">Traditional Encryption</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Encrypt → Decrypt → Compute → Encrypt
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Data must be decrypted before computation
                  </p>
                </div>

                <div className="p-4 bg-accent/10 border-2 border-accent rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-accent" />
                    <h4 className="font-bold">FHE (Our Approach)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Encrypt → Compute → Stay Encrypted
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Computation happens on encrypted data directly
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* System Architecture */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">System Architecture</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-accent" />
                    Browser-Side Encryption
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    When you place a prediction, your browser uses the <strong>Zama FHE SDK</strong> to encrypt:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Candidate ID (encrypted as euint32)</li>
                    <li>Bet amount in wei (encrypted as euint64)</li>
                    <li>Zero-knowledge proof for verification</li>
                  </ul>
                  <div className="mt-3 p-3 bg-muted rounded font-mono text-xs">
                    <code>
                      const &#123; candidateHandle, stakeHandle, proof &#125; = await encryptElectionPrediction(...)
                    </code>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-accent" />
                    On-Chain Storage
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Encrypted data is stored in the ElectionBettingPool smart contract on Sepolia testnet:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Each prediction creates a unique ticket with encrypted fields</li>
                    <li>Commitment hash prevents replay attacks</li>
                    <li>ACL permissions grant you (and only you) decryption rights</li>
                  </ul>
                  <div className="mt-3">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Solidity FHE Library
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-accent" />
                    Encrypted Computation
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    The smart contract computes aggregate statistics on encrypted data:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Accumulates encrypted stakes per candidate</li>
                    <li>Maintains total encrypted pool balance</li>
                    <li>All operations use FHE arithmetic (add, multiply, compare)</li>
                  </ul>
                  <div className="mt-3 p-3 bg-accent/10 border border-accent rounded text-sm">
                    <strong>Privacy Guarantee:</strong> Individual predictions remain encrypted.
                    Only aggregated ciphertext is computed.
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-accent" />
                    Decryption &amp; Settlement
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    After official election results are verified:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Oracle submits winning candidate index</li>
                    <li>Zama Gateway decrypts aggregate pool totals</li>
                    <li>Payout ratio calculated: poolTotal / winningTotal</li>
                    <li>Users claim rewards by decrypting their tickets</li>
                  </ul>
                  <div className="mt-3 p-3 bg-muted rounded">
                    <p className="text-sm font-mono">
                      payoutRatio = totalPool / winningCandidateTotal
                    </p>
                    <p className="text-sm font-mono mt-1">
                      yourPayout = yourStake × payoutRatio
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Security Model */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Security &amp; Privacy Guarantees</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <Shield className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Data is encrypted in your browser and never decrypted on the server.
                Only you hold the decryption keys via blockchain ACL.
              </p>
            </Card>

            <Card className="p-6">
              <Lock className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Zero-Knowledge Proofs</h3>
              <p className="text-sm text-muted-foreground">
                Cryptographic proofs verify encryption correctness without revealing plaintext data.
              </p>
            </Card>

            <Card className="p-6">
              <Database className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Immutable Storage</h3>
              <p className="text-sm text-muted-foreground">
                All predictions are stored on Ethereum blockchain, providing transparent audit trails.
              </p>
            </Card>

            <Card className="p-6">
              <CheckCircle2 className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Fair Settlement</h3>
              <p className="text-sm text-muted-foreground">
                Smart contract enforces fair payout distribution based on encrypted stake totals.
              </p>
            </Card>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Technical Stack</h2>

          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3 text-lg">Frontend</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">React + TypeScript</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Zama FHE SDK 0.2.0</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Wagmi v2 + RainbowKit</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Vite + Tailwind CSS</Badge>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-lg">Smart Contracts</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Solidity 0.8.24</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">fhEVM Library</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">OpenZeppelin Contracts</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Hardhat + TypeChain</Badge>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-lg">Infrastructure</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Sepolia Testnet</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Zama Gateway</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Etherscan Verification</Badge>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-lg">Wallets Supported</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">MetaMask</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">WalletConnect</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Safe (Gnosis)</Badge>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Learn More */}
        <Card className="p-8 bg-accent/5 border-2 border-accent">
          <h2 className="text-2xl font-bold mb-4">Learn More About FHE</h2>
          <p className="text-muted-foreground mb-4">
            Want to dive deeper into Fully Homomorphic Encryption and how it's revolutionizing privacy in Web3?
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://docs.zama.ai/fhevm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:opacity-90"
            >
              Zama fhEVM Docs
              <span className="text-xs">↗</span>
            </a>
            <a
              href="https://github.com/zama-ai/fhevm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-accent text-accent px-4 py-2 rounded-md font-medium hover:bg-accent hover:text-accent-foreground"
            >
              GitHub Repository
              <span className="text-xs">↗</span>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Methodology;
