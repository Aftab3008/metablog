"use server";

import { parseWithZod } from "@conform-to/zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "../db";
import { PostSchema, siteSchema } from "../ZodSchema";

export async function CreateSiteAction(formData: FormData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/api/auth/login");
    }
    const submission = parseWithZod(formData, { schema: siteSchema });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const response = await prisma.site.create({
      data: {
        description: submission.value.description,
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
        userId: user.id,
      },
    });

    if (!response) {
      throw new Error("Failed to create site");
    }

    return JSON.stringify(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Subdirectory already exists");
      }
    }
  }
}

export async function CreatePostAction(formData: FormData, siteId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/api/auth/login");
    }

    const submission = parseWithZod(formData, { schema: PostSchema });
    if (submission.status !== "success") {
      console.error("Form submission error:", submission.error);
      return submission.reply();
    }

    const response = await prisma.post.create({
      data: {
        title: submission.value.title,
        smallDescription: submission.value.smallDescription,
        slug: submission.value.slug,
        articleContent: JSON.parse(submission.value.articleContent),
        image: submission.value.coverImage,
        userId: user.id,
        siteId: siteId,
      },
    });

    if (!response) {
      throw new Error("Failed to create post");
    }
    return JSON.stringify(response);
  } catch (error) {
    console.error("Error in CreatePostAction:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Slug already exists");
      } else {
        throw new Error("Error creating post");
      }
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function EditPostAction(formData: FormData, articleId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/api/auth/login");
    }
    const submission = parseWithZod(formData, { schema: PostSchema });
    if (submission.status !== "success") {
      return submission.reply();
    }
    const response = await prisma.post.update({
      where: {
        userId: user.id,
        id: articleId,
      },
      data: {
        title: submission.value.title,
        smallDescription: submission.value.smallDescription,
        slug: submission.value.slug,
        articleContent: JSON.parse(submission.value.articleContent),
        image: submission.value.coverImage,
      },
    });
    if (!response) {
      throw new Error("Failed to update post");
    }
    return JSON.stringify(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Slug already exists");
      }
    }
  }
}

export async function DeletePostAction(articleId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/api/auth/login");
    }
    const response = await prisma.post.delete({
      where: {
        userId: user.id,
        id: articleId,
      },
    });
    if (!response) {
      throw new Error("Failed to delete post");
    }
    return JSON.stringify(response);
  } catch (error) {
    throw new Error("Error deleting post");
  }
}

export async function UpdateSiteImage(siteId: string, imageUrl: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/api/auth/login");
    }
    const response = await prisma.site.update({
      where: {
        id: siteId,
      },
      data: {
        imageUrl: imageUrl,
      },
    });
    if (!response) {
      throw new Error("Failed to update site image");
    }
    return JSON.stringify(response);
  } catch (error) {
    throw new Error("Error updating site image");
  }
}

export async function DeleteSiteAction(siteId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/api/auth/login");
    }
    const response = await prisma.site.delete({
      where: {
        userId: user.id,
        id: siteId,
      },
    });
    if (!response) {
      throw new Error("Failed to delete site");
    }
    return JSON.stringify(response);
  } catch (error) {
    throw new Error("Error deleting site");
  }
}

export async function getSiteData(siteId: string) {
  try {
    const data = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!data) {
      throw new Error("Site not found");
    }
    return data;
  } catch (error) {
    throw new Error("Error getting site data");
  }
}
