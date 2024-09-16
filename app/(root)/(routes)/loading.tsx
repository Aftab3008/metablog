import { Loader } from "lucide-react";

export default function loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader className="animate-spin h-10 w-10" color="#2b58f7" />
    </div>
  );
}
