import Image from "next/image";
import KindeLogo from "@/public/logos/kinde.svg";
import Nextjs from "@/public/logos/nextjs.svg";

export function Logos() {
  return (
    <div className="py-10">
      <h2 className="text-center text-lg font-semibold leading-7">
        Trusted by the best companies in the world
      </h2>
      <div className="mt-10 max-w-lg mx-auto">
        <div className="flex justify-center items-center gap-x-8">
          <Image
            src={KindeLogo}
            alt="Kinde Logo"
            className="max-h-12 w-auto object-contain dark:invert"
          />
          <Image
            src={Nextjs}
            alt="Next.js Logo"
            className="max-h-12 w-auto object-contain dark:invert"
          />
        </div>
      </div>
    </div>
  );
}
