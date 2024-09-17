import { Features } from "@/components/shared/landingpage/Features";
import { Hero } from "@/components/shared/landingpage/hero";
import { Logos } from "@/components/shared/landingpage/Logos";
import { PricingTable } from "@/components/shared/Pricing";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <Hero />
      <Logos />
      <Features />
      <PricingTable />
    </div>
  );
}
