"use server";

import { stripe } from "@/utils/stripe";
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

    const [subStatus, sites] = await Promise.all([
      prisma.subscription.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          status: true,
        },
      }),
      prisma.site.findMany({
        where: {
          userId: user.id,
        },
      }),
    ]);

    if (!subStatus || subStatus.status !== "active") {
      if (sites.length >= 20) {
        return redirect("/dashboard/pricing");
      }

      const submission = parseWithZod(formData, { schema: siteSchema });

      if (submission.status !== "success") {
        return submission.reply();
      }

      const response = await prisma.site.create({
        data: {
          description: submission.value.description,
          name: submission.value.name,
          subdirectory: submission.value.subdirectory.toLowerCase(),
          userId: user.id,
        },
      });

      if (!response) {
        throw new Error("Failed to create site");
      }

      return JSON.stringify(response);
    } else {
      const submission = parseWithZod(formData, { schema: siteSchema });

      if (submission.status !== "success") {
        return submission.reply();
      }

      const response = await prisma.site.create({
        data: {
          description: submission.value.description,
          name: submission.value.name,
          subdirectory: submission.value.subdirectory.toLowerCase(),
          userId: user.id,
        },
      });

      if (!response) {
        throw new Error("Failed to create site");
      }

      return JSON.stringify(response);
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Subdirectory already exists");
      }
    } else if (
      error instanceof Error &&
      error.message === "Subscription required"
    ) {
      throw new Error("Subscription required");
    } else {
      throw error;
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

export async function getData(userId: string) {
  try {
    const [sites, articles] = await Promise.all([
      prisma.site.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      }),
      prisma.post.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      }),
    ]);
    return { sites, articles };
  } catch (error) {
    throw new Error("Error getting data");
  }
}

export async function getSiteSubData(subDir: string) {
  try {
    const data = await prisma.site.findUnique({
      where: {
        subdirectory: subDir,
      },
      select: {
        name: true,
        posts: {
          select: {
            smallDescription: true,
            title: true,
            image: true,
            createdAt: true,
            slug: true,
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return data;
  } catch (error) {
    throw new Error("Error getting site data");
  }
}

export async function getPostData(slug: string) {
  try {
    const data = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
      select: {
        articleContent: true,
        title: true,
        smallDescription: true,
        image: true,
        createdAt: true,
      },
    });

    return data;
  } catch (error) {
    throw new Error("Error getting post data");
  }
}

export async function getUserSubscriptions(userId: string) {
  try {
    const data = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
      select: {
        status: true,
        User: {
          select: {
            customerId: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    throw new Error("Error getting user subscriptions");
  }
}

export async function CreateSubscription() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  let stripeUserId = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      customerId: true,
      email: true,
      firstName: true,
    },
  });

  if (!stripeUserId?.customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: stripeUserId?.email,
      name: stripeUserId?.firstName,
    });

    stripeUserId = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: stripeCustomer.id,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeUserId.customerId as string,
    mode: "subscription",
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url:
      process.env.NODE_ENV === "production"
        ? "https://metablog-red.vercel.app/dashboard/payment/success"
        : "http://localhost:3000/dashboard/payment/success",
    cancel_url:
      process.env.NODE_ENV === "production"
        ? "https://metablog-red.vercel.app/dashboard/payment/cancelled"
        : "http://localhost:3000/dashboard/payment/cancelled",
  });

  return redirect(session.url as string);
}

export async function getSiteInfo(userId: string, siteId: string) {
  try {
    const data = await prisma.site.findUnique({
      where: {
        id: siteId,
        userId: userId,
      },
      select: {
        subdirectory: true,
        posts: {
          select: {
            image: true,
            title: true,
            createdAt: true,
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}
