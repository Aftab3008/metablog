import { EmptyBlog } from "@/components/shared/EmptyBlog";
import Goback from "@/components/shared/Goback";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSiteSubData } from "@/lib/actions";
import Defaultimage from "@/public/default.png";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogIndexPage({
  params,
}: {
  params: { name: string };
}) {
  const data = await getSiteSubData(params.name);

  if (!data) {
    return notFound();
  }

  return (
    <>
      <nav className="flex items-center justify-between my-10 w-full">
        <div className="flex-shrink-0 ml-2">
          <Goback />
        </div>

        <div className="flex-grow flex items-center justify-center gap-x-4">
          <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        </div>
      </nav>

      {data.posts.length === 0 ? (
        <EmptyBlog
          title="No posts found"
          description="There are no posts found for this site. Please check back later."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {data.posts.map((item) => (
            <Card key={item.id} className="flex flex-col h-full">
              <Image
                src={item.image ?? Defaultimage}
                alt={item.title}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="truncate">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {item.smallDescription}
                  </CardDescription>
                </CardHeader>
                <div className="flex-grow"></div>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <Link href={`/blog/${params.name}/${item.slug}`}>
                      Read more
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
