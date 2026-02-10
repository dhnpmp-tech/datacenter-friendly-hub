import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import EarlyAccessSection from "@/components/EarlyAccessSection";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <AdvantagesSection />
      <EarlyAccessSection />
      <TrustBar />
      <Footer />
    </div>
  );
};

export default Index;
