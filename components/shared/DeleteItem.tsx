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
import { Loader, TrashIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { DeletePostAction } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type DeleteItemProps = {
  title: string;
  articleId: string;
};

export default function DeleteItem({ title, articleId }: DeleteItemProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      const response = await DeletePostAction(articleId);
      if (response) {
        toast.success("Post deleted successfully");
        router.refresh();
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
        className={`text-sm  ml-2 cursor-pointer text-red-500 button flex items-center my-2`}
      >
        <TrashIcon className="size-4 mr-2" />
        Delete
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
                <Loader className="size-4 mr-2 animate-spin" />
                Deleting...
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
