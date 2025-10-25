import HeroHeadline from "@/components/landing/HeroHeadline";
import PollingDashboard from "@/components/landing/PollingDashboard";
import Methodology from "@/components/landing/Methodology";

// Home page with news-style layout and civic journalism approach
const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroHeadline />
      <PollingDashboard />
      <Methodology />
    </div>
  );
};

export default Home;
