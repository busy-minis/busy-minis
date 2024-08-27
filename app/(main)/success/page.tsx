import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen  flex-col  space-y-4 flex items-center justify-center">
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <Link href={"/my-rides"} className="bg-zinc-700 text-white py-2 px-12">
        Go to Your Rides
      </Link>
    </div>
  );
}
