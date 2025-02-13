import { HeroSection } from "@/components/home/HeroSection";
import { ValueProposition } from "@/components/home/ValueProposition";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="bg-white">
      <div className="relative">
        <div className="relative z-10">
          <HeroSection />
          <ValueProposition />
          <TestimonialsSection />
          <NewsSection />
          <ContactSection />
          <CTASection />
        </div>
      </div>
    </div>
  );
};

export default Index;