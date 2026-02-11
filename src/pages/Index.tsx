import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import EarningsCalculatorSection from "@/components/EarningsCalculatorSection";
import EarlyAccessSection from "@/components/EarlyAccessSection";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { GPUProvider } from "@/contexts/GPUContext";

const Index = () => {
  return (
    <GPUProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <AdvantagesSection />
        <EarningsCalculatorSection />
        <EarlyAccessSection />
        <TrustBar />
        <Footer />
      </div>
    </GPUProvider>
  );
};

export default Index;
