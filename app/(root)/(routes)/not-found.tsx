import Goback from "@/components/shared/Goback";
import Link from "next/link";

export default function notfound() {
  return (
    <>
      <Goback />
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          404! There no such page found!
        </h2>
      </div>
    </>
  );
}
