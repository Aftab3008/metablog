"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { UpdateSiteImage } from "@/lib/actions";
import { set } from "zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface iAppProps {
  siteId: string;
}

export function UploadImageForm({ siteId }: iAppProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);
  async function handleSave() {
    try {
      if (!imageUrl) {
        return;
      }
      setLoading(true);
      const response = await UpdateSiteImage(siteId, imageUrl);
      if (response) {
        toast.success("Image updated successfully");
        router.refresh();
        router.push(`/dashboard/sites/${siteId}`);
      }
    } catch (error) {
      toast.error((error as Error).message, {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image</CardTitle>
        <CardDescription>
          This is the image of your site. you can change it here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded Image"
            width={200}
            height={200}
            className="size-[200px] object-cover rounded-lg"
          />
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageUrl(res[0].url);
              toast.success("Image has been uploaded");
            }}
            onUploadError={() => {
              toast.error("Something went wrong.");
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          disabled={!imageUrl || loading}
          onClick={handleSave}
        >
          {loading ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
