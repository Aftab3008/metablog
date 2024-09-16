"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { PostSchema } from "@/lib/ZodSchema";
import { UploadDropzone } from "@/utils/uploadthing";
import slugify from "react-slugify";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowLeft, Atom, Loader } from "lucide-react";
import Link from "next/link";
import { CreatePostAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import TailwindEditor from "@/components/shared/TailwindEditor";

export default function ArticleCreationRoute({
  params,
}: {
  params: { siteId: string };
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      smallDescription: "",
      articleContent: "",
    },
  });

  const { setError } = form;

  async function onSubmit(values: z.infer<typeof PostSchema>) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await CreatePostAction(formData, params.siteId);
      if (response) {
        toast.success("Article created successfully");
        router.push(`/dashboard/sites/${params.siteId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Slug already exists") {
          setError("slug", {
            type: "manual",
            message: "Slug already exists",
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  function handleSlugGeneration() {
    const titleInput = form.getValues("title");
    if (!titleInput) {
      return toast.error("Please create a title first");
    }
    const generatedSlug = slugify(titleInput);
    form.setValue("slug", generatedSlug);
    toast.success("Slug has been created");
  }

  return (
    <>
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Fill out the form below to create a new article.
          </CardDescription>
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
                      <Input
                        placeholder="Article Slug"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <Button
                      onClick={handleSlugGeneration}
                      variant="secondary"
                      type="button"
                    >
                      <Atom className="size-4 mr-2" />
                      Generate Slug
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
                        placeholder="Write a short description of your article..."
                        {...field}
                        className="h-24"
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
                      <>
                        {field.value ? (
                          <Image
                            src={field.value}
                            alt="Uploaded cover"
                            className="object-cover w-[200px] h-[200px] rounded-lg"
                            width={200}
                            height={200}
                          />
                        ) : (
                          <UploadDropzone
                            onClientUploadComplete={(res) => {
                              form.setValue("coverImage", res[0].url);
                              toast.success("Image uploaded successfully");
                            }}
                            onUploadError={(err) => {
                              if (
                                err.message ===
                                "Invalid config: FileSizeMismatch"
                              ) {
                                toast.warning("File is too large ", {
                                  description:
                                    "Please upload a file less than 4MB",
                                });
                              } else {
                                toast.error("Failed to upload image", {
                                  description: "Please try again",
                                });
                              }
                            }}
                            endpoint="imageUploader"
                          />
                        )}
                      </>
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
                        initialValue={
                          field.value ? JSON.parse(field.value) : {}
                        }
                        onChange={(value) => {
                          field.onChange(JSON.stringify(value));
                        }}
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
                    <Loader className="size-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Article"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
