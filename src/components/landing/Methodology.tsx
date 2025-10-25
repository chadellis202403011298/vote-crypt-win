import { Card } from "@/components/ui/card";
import { Shield, Lock, Database, CheckCircle } from "lucide-react";

// Methodology section explaining FHE security and settlement process
const Methodology = () => {
  const steps = [
    {
      icon: Lock,
      title: "Encrypted Input",
      description: "Your prediction choice and bet amount are encrypted in your browser using FHE before submission. No one can see your choices, not even the platform.",
    },
    {
      icon: Database,
      title: "On-Chain Storage",
      description: "Encrypted data is stored on-chain in a smart contract. All computations happen on encrypted values without revealing individual predictions.",
    },
    {
      icon: CheckCircle,
      title: "Official Results",
      description: "When election results are certified by authorized sources, the outcome is submitted to trigger the decryption and settlement process.",
    },
    {
      icon: Shield,
      title: "Fair Settlement",
      description: "Smart contract decrypts all predictions simultaneously and distributes rewards to winners. The entire process is transparent and verifiable.",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            ElectionBet uses Fully Homomorphic Encryption (FHE) to ensure complete privacy 
            and fairness in election prediction markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-6 border-2 hover:border-accent transition-colors">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-black text-lg mb-3">
                  {index + 1}
                </div>
                <step.icon className="w-8 h-8 text-accent mb-3" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block p-6 border-2 border-accent">
            <p className="text-sm text-muted-foreground mb-2">Security Guarantee</p>
            <p className="font-bold text-lg">
              All data remains encrypted on-chain until official election results are verified
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
