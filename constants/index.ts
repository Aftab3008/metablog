import { iAppProps } from "@/types";
import { DollarSign, Globe, Home } from "lucide-react";
import { CloudRain } from "lucide-react";

export const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Sites",
    href: "/dashboard/sites",
    icon: Globe,
  },
  {
    name: "Pricing",
    href: "/dashboard/pricing",
    icon: DollarSign,
  },
];

export const PricingPlans: iAppProps[] = [
  {
    id: 0,
    cardTitle: "Freelancer",
    cardDescription: "The best pricing plan for people starting out.",
    benefits: [
      "20 Site",
      "Up to 1000 Visitors",
      "Up to 1000 Visitors",
      "Up to 1000 Visitors",
    ],
    priceTitle: "Free",
  },
  {
    id: 1,
    cardTitle: "Startup",
    cardDescription: "The best pricing plan for professionals.",
    priceTitle: "$29",
    benefits: [
      "Unlimited Sites",
      "Unimlited Visitors",
      "Unimlited Visitors",
      "Unimlited Visitors",
    ],
  },
];

export const features = [
  {
    name: "Sign up for free",
    description:
      "Join Metablog with no upfront costs and start sharing your thoughts with the world instantly.",
    icon: CloudRain,
  },
  {
    name: "Blazing fast",
    description:
      "Enjoy a lightning-quick experience while creating and reading blog posts on Metablog, optimized for speed and efficiency.",
    icon: CloudRain,
  },
  {
    name: "Super secure with Kinde",
    description:
      "Your data and content are protected with the highest security standards, powered by Kinde, ensuring privacy and peace of mind.",
    icon: CloudRain,
  },
  {
    name: "Easy to use",
    description:
      "Metablog's intuitive interface makes it simple for anyone to start blogging, regardless of technical expertise.",
    icon: CloudRain,
  },
];
