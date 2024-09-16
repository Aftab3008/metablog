import { PricingTable } from "@/components/shared/Pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserSubscriptions } from "@/lib/actions";
import { requireUser } from "@/lib/actions/requireUser";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const user = await requireUser();
  const data = await getUserSubscriptions(user.id);

  async function createCustomerPortal() {
    "use server";

    // const session = await stripe.billingPortal.sessions.create({
    //   customer: data?.User?.customerId as string,
    //   return_url:
    //     process.env.NODE_ENV === "production"
    //       ? "https://blog-marshal.vercel.app/dashboard"
    //       : "http://localhost:3000/dashboard",
    // });

    // return redirect(session.url);
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
        <CardContent></CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PricingTable />
    </div>
  );
}
