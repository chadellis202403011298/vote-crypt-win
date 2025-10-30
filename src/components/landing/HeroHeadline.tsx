import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-election.jpg";

// Hero section with breaking news headline and CTA
const HeroHeadline = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-3xl space-y-8 animate-slide-up">
          <div className="inline-block">
            <span className="bg-secondary text-secondary-foreground px-4 py-2 text-sm font-bold uppercase tracking-wider">
              Breaking Coverage
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight text-primary-foreground">
            Predict Elections.<br />
            <span className="text-secondary">Encrypted.</span><br />
            <span className="text-accent">Transparent.</span>
          </h1>

          <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
            Place encrypted predictions on election outcomes using fully homomorphic encryption. 
            Your choices remain private until official results are verified.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-6 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="font-medium">FHE Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="font-medium">Real-time Odds</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <span className="font-medium">Live Analytics</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/predict">
              <Button variant="default" size="lg" className="text-lg font-bold bg-secondary hover:bg-secondary/90">
                Open Prediction Desk
              </Button>
            </Link>
            <Link to="/methodology">
              <Button
                variant="outline"
                size="lg"
                className="text-lg font-bold border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary"
              >
                Read Methodology
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHeadline;
