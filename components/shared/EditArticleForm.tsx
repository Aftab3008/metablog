"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditPostAction } from "@/lib/actions";
import { PostSchema } from "@/lib/ZodSchema";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Atom, Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import slugify from "react-slugify";
import { toast } from "sonner";
import { z } from "zod";
import TailwindEditor from "./TailwindEditor";

interface iAppProps {
  data: {
    slug: string;
    title: string;
    smallDescription: string;
    articleContent: any;
    id: string;
    image: string;
  };
  siteId: string;
}

export function EditArticleForm({ data, siteId }: iAppProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      smallDescription: data.smallDescription,
      coverImage: data.image,
      articleContent: JSON.stringify(data.articleContent),
    },
  });

  const { setValue, getValues } = form;

  async function onSubmit(values: z.infer<typeof PostSchema>) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("coverImage", values.coverImage);
      formData.append("smallDescription", values.smallDescription);
      formData.append("articleContent", values.articleContent);

      const response = await EditPostAction(formData, data.id);
      if (response) {
        toast.success("Article updated successfully");
        router.push(`/dashboard/sites/${siteId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  const handleSlugGeneration = () => {
    const titleInput = getValues("title");

    if (!titleInput) {
      return toast.error("Please create a title first");
    }

    const generatedSlug = slugify(titleInput);
    setValue("slug", generatedSlug);
    toast.success("Slug has been created");
  };
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Edit Article</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Article Slug" {...field} />
                  </FormControl>
                  <Button
                    onClick={handleSlugGeneration}
                    className="w-fit mt-2"
                    variant="secondary"
                    type="button"
                  >
                    <Atom className="size-4 mr-2" /> Generate Slug
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smallDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Small Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Small description for your article..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    {getValues("coverImage") ? (
                      <Image
                        src={getValues("coverImage")}
                        alt="Uploaded Image"
                        className="object-cover w-[200px] h-[200px] rounded-lg"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <UploadDropzone
                        onClientUploadComplete={(res) => {
                          setValue("coverImage", res[0].url);
                          toast.success("Image uploaded successfully");
                        }}
                        endpoint="imageUploader"
                        onUploadError={() => {
                          toast.error("Something went wrong...");
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="articleContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Content</FormLabel>
                  <FormControl>
                    <TailwindEditor
                      onChange={(value) =>
                        setValue("articleContent", JSON.stringify(value))
                      }
                      initialValue={JSON.parse(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                "Save Article"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
