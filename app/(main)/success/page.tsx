import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center space-y-8 p-6">
      <div className="bg-black rounded-xl shadow-lg p-10 text-center max-w-lg border border-gray-700">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-400 mb-6 text-lg">
          Your payment has been processed successfully. You can now view and
          manage your rides.
        </p>
        <Link href="/my-rides">
          <div className="bg-gradient-to-r from-teal-500 to-orange-500 text-white font-semibold py-3 px-12 rounded-full shadow-lg hover:from-teal-600 hover:to-orange-600 transition duration-300 cursor-pointer">
            Go to Your Rides
          </div>
        </Link>
      </div>
    </div>
  );
}
