"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Goback() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          router.back();
        }}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <h3 className="text-xl font-semibold hidden md:block">Go back</h3>
    </div>
  );
}
