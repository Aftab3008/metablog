import { PricingTable } from "@/components/shared/Pricing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserSubscriptions } from "@/lib/actions";
import { requireUser } from "@/lib/actions/requireUser";
import { stripe } from "@/utils/stripe";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function PricingPage() {
  const user = await requireUser();
  const data = await getUserSubscriptions(user.id);

  async function createCustomerPortal() {
    "use server";

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: data?.User?.customerId as string,
        return_url:
          process.env.NODE_ENV === "production"
            ? "https://metablog-red.vercel.app/dashboard"
            : "http://localhost:3000/dashboard",
      });

      if (!session) {
        throw new Error("Failed to create customer portal session");
      }
      return redirect(session.url);
    } catch (error) {
      toast.error("Failed to create customer portal session.", {
        description: "Please try again later.",
      });
      throw new Error("Failed to create customer portal session");
    }
  }

  if (data?.status === "active") {
    return (
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Edit Subscription</CardTitle>
          <CardDescription>
            Click on the button below, this will give you the opportunity to
            change your payment details and view your statement at the same
            time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createCustomerPortal} disabled>
            View Subscription Details
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PricingTable />
    </div>
  );
}
