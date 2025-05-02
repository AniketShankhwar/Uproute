import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="max-w-[700px] w-full">
          <img
            src="/Error.gif"
            alt="404 error animation"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-4">
          <p className="text-lg md:text-xl">
            Sorry, the page you're looking for doesn't exist.
          </p>
          <Link href="/" passHref>
            <Button className="text-md px-8 py-4">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
