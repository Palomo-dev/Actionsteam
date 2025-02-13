import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Importaciones lazy de componentes
const HeroSection = lazy(() => import("@/components/home/HeroSection").then(module => ({
  default: module.HeroSection
})));
const ValueProposition = lazy(() => import("@/components/home/ValueProposition").then(module => ({
  default: module.ValueProposition
})));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection").then(module => ({
  default: module.TestimonialsSection
})));
const NewsSection = lazy(() => import("@/components/home/NewsSection").then(module => ({
  default: module.NewsSection
})));
const ContactSection = lazy(() => import("@/components/home/ContactSection").then(module => ({
  default: module.ContactSection
})));
const CTASection = lazy(() => import("@/components/home/CTASection").then(module => ({
  default: module.CTASection
})));

const Index = () => {
  return (
    <div className="animate-fade-in bg-white">
      <div className="relative">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="relative z-10">
            <HeroSection />
            <ValueProposition />
            <TestimonialsSection />
            <NewsSection />
            <ContactSection />
            <CTASection />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Index;