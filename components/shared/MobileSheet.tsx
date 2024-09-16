"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MobileSheet() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger>
        <HamburgerMenuIcon className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="flex h-14 items-center border-b">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image src={Logo} alt="Logo" className="size-8" />
                <h3 className="text-2xl">
                  <span className="text-primary">Meta</span>Blog
                </h3>
              </Link>
            </div>
          </SheetTitle>
          <SheetDescription>
            <div className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <SheetClose key={item.name} asChild>
                  <Link
                    href={item.href}
                    key={item.name}
                    className={cn(
                      pathname == item.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground bg-none",
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary/70 text-xl"
                    )}
                  >
                    <item.icon className="size-6" />
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
