import HeroHeadline from "@/components/landing/HeroHeadline";
import PollingDashboard from "@/components/landing/PollingDashboard";
import Methodology from "@/components/landing/Methodology";

/**
 * Home Page - Landing page for ElectionBet platform
 *
 * Features:
 * - Hero section with main headline and CTA
 * - Live polling dashboard with charts and statistics
 * - Methodology section explaining FHE encryption and security
 *
 * Design: News-style layout with civic journalism approach
 * Color scheme: Red, white, blue (newsroom infographic theme)
 */
const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section with headline and call-to-action */}
      <HeroHeadline />

      {/* Live polling data visualization */}
      <PollingDashboard />

      {/* Explanation of FHE encryption methodology */}
      <Methodology />
    </div>
  );
};

export default Home;
