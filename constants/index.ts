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
      "1 Site",
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
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.",
    icon: CloudRain,
  },
  {
    name: "Balzing fast",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.",
    icon: CloudRain,
  },
  {
    name: "Super secure with Kinde",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.",
    icon: CloudRain,
  },
  {
    name: "Easy to use",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.",
    icon: CloudRain,
  },
];
