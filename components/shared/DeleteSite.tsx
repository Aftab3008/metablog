"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteSiteAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
import { Loader } from "lucide-react";

type DeleteSiteProps = {
  title: string;
  siteId: string;
};

export default function DeleteSite({ title, siteId }: DeleteSiteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  async function handleDelete() {
    try {
      setIsLoading(true);
      const response = await DeleteSiteAction(siteId);
      if (response) {
        toast.success("Site deleted successfully");
        router.push("/dashboard/sites");
      }
    } catch (error) {
      toast.error((error as Error).message, {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive" })}
      >
        Delete Everything
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-6">
              <h2>This action cannot be undone.</h2>
              <div className="flex flex-col gap-3">
                <h3 className="text-rose-500 text-xs ml-1">
                  Please type "{title}" to delete
                </h3>
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className=""
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-400 text-white"
            disabled={value !== title || isLoading}
            onClick={handleDelete}
          >
            {isLoading ? (
              <>
                <Loader className="size-4 mr-2 animate-spin" /> Deleting
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
