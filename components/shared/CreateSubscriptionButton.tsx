"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { CreateSubscription } from "@/lib/actions";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function CreateSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await CreateSubscription();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" onClick={handleClick} disabled={loading}>
      {loading ? (
        <>
          <Loader className="animate-spin h-6 w-6 mr-2" />
          Creating Subscription
        </>
      ) : (
        "Create Subscription"
      )}
    </Button>
  );
}
