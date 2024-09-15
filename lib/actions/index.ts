"use server";

import { parseWithZod } from "@conform-to/zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../db";
import { siteSchema } from "../ZodSchema";
import { Prisma } from "@prisma/client";

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
