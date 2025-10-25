import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Lock } from "lucide-react";

// Mock polling data display with data visualization
const PollingDashboard = () => {
  const candidates = [
    { name: "Candidate A", party: "Blue Party", support: 48.2, trend: "+1.2" },
    { name: "Candidate B", party: "Red Party", support: 46.8, trend: "-0.5" },
    { name: "Candidate C", party: "Independent", support: 5.0, trend: "+0.3" },
  ];

  const metrics = [
    { label: "Total Predictions", value: "12,847", icon: Users, color: "text-accent" },
    { label: "Encrypted Bets", value: "100%", icon: Lock, color: "text-secondary" },
    { label: "Market Confidence", value: "94.3%", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Live Prediction Markets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time aggregated predictions powered by encrypted on-chain data
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric) => (
            <Card key={metric.label} className="p-6 border-2 hover:border-accent transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-muted ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                  <p className="text-3xl font-black">{metric.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Candidate Support Bars */}
        <Card className="p-8 border-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Current Support Levels</h3>
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encrypted Settlement
            </span>
          </div>

          <div className="space-y-6">
            {candidates.map((candidate) => (
              <div key={candidate.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{candidate.support}%</p>
                    <p className={`text-sm font-bold ${candidate.trend.startsWith('+') ? 'text-accent' : 'text-secondary'}`}>
                      {candidate.trend}
                    </p>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      candidate.party === "Blue Party" ? "bg-accent" : 
                      candidate.party === "Red Party" ? "bg-secondary" : "bg-muted-foreground"
                    }`}
                    style={{ width: `${candidate.support}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PollingDashboard;
