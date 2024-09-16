import DeleteSite from "@/components/shared/DeleteSite";
import { UploadImageForm } from "@/components/shared/UploadImageForm";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSiteData } from "@/lib/actions";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function SettingsSiteRoute({
  params,
}: {
  params: { siteId: string };
}) {
  const data = await getSiteData(params.siteId);
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon">
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go back</h3>
      </div>

      <UploadImageForm siteId={params.siteId} />

      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger</CardTitle>
          <CardDescription>
            This will delete your site and all articles associated with it.
            Click the button below to delete everything
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <DeleteSite title={data.subdirectory} siteId={params.siteId} />
        </CardFooter>
      </Card>
    </>
  );
}
