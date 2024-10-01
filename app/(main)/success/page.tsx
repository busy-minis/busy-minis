import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-center">
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You can now view and manage your new ride.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/my-rides" passHref>
            <Button className="w-full sm:w-auto">Go to Your Rides</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
